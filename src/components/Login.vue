<template>
  <div v-show="!authorized">
    <q-card>
      <q-card-title class="bg-light">
        Вхід в систему
        <span slot="subtitle" class="text-negative">{{authError}}</span>
      </q-card-title>
      <q-card-main>
        <form>
          <q-field
            icon="account box"
            helper="Ім'я користувача"
          >
            <q-input
              float-label="Користувач"
              v-model="username"
            ></q-input>
          </q-field>
          <q-field
            icon="fingerprint"
            helper="Пароль користувача"
          >
            <q-input
              float-label="Пароль"
              type="password"
              v-model="userpass"
            ></q-input>
          </q-field>
        </form>
      </q-card-main>
      <q-card-actions>
        <q-btn flat color="primary" @click="doLogin()">ОК</q-btn>
        <q-btn flat color="primary" @click="doCancel()">Скасування</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
  import {
    QCard, QCardTitle, QCardMain, QField, QInput, QCardActions,
    QBtn
  } from 'quasar'
  import { mapState } from 'vuex'

  export default {
    components: {
      QCard,
      QCardTitle,
      QCardMain,
      QField,
      QInput,
      QCardActions,
      QBtn
    },
    data () {
      return {
        username: '',
        userpass: ''
      }
    },
    methods: {
      doLogin () {
        const message = {
          user: this.username,
          pass: this.userpass
        }
        this.$socket.emit('authenticate', message)
      },
      doCancel () {
        this.$router.back()
      }
    },
    computed: {
      ...mapState({
        authError: state => state.auth.authError,
        authorized: state => state.auth.authorized
      })
    },
    watch: {
      authorized (value) {
        if (value) {
          this.$router.push('/claims')
        }
      }
    }
  }
</script>

<style>
</style>

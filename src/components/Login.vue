<template>
  <div>
    <q-card>
      <q-card-title>
        Вхід в систему
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
        <q-btn flat color="primary" :click="doLogin()">ОК</q-btn>
        <q-btn flat color="primary">Скасування</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
  import {
    QCard, QCardTitle, QCardMain, QField, QInput, QCardActions,
    QBtn
  } from 'quasar'

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
        this.$socket.emit('authentication', {
          user: this.username,
          pass: this.userpass
        })
      }
    }

  }
</script>

<style>
</style>

<template>
  <div class="row justify-center">
  <af-form
    title="Вхід в систему"
    :subtitle="authError"
    subtitle-class="af-error-title"
    class="col"
    style="max-width: 800px;"
    :bottomActions="bActions"
  >
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
  </af-form>
  </div>
</template>

<script>
  import {QField, QInput} from 'quasar-framework'
  import { AfForm } from './base'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    name: '',
    props: [],
    data () {
      return {
        username: '',
        userpass: ''
      }
    },
    components: {
      AfForm,
      QField,
      QInput
    },
    methods: {
      ...mapActions([]),
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
      }),
      ...mapGetters([]),
      bActions () {
        return [
          {
            caption: 'Увійти',
            action: 'doLogin',
            handler: this.doLogin,
            color: 'primary'
          },
          {
            caption: 'Скасування',
            action: 'doCancel',
            handler: this.doCancel,
            color: 'negative'
          }
        ]
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    watch: {
      authorized (value) {
        if (value) {
          this.$router.push('/claims')
        }
      }
    }
  }
  //     -- text-shadow 2px 2px 0px $negative
</script>

<style lang="stylus">
  @import '~variables'
  .af-error-title
    color: $yellow-12
</style>

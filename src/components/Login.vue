<template>
  <div class="row justify-center">
    <af-form
      title="Вхід в систему"
      :subtitle="authError"
      subtitle-class="af-error-title"
      class="col"
      style="max-width: 800px;"
      ref="form"
    >
      <af-field-set caption="Облікові дані">
        <af-input
          label="Користувач"
          v-model="username"
          icon="account box"
          required
        />
        <af-input
          label="Пароль"
          v-model="userpass"
          icon="fingerprint"
          type="password"
          required
        />
      </af-field-set>
      <q-btn
        flat
        color="primary"
        @click="doLogin"
        slot="bottom-buttons"
        :disabled="!isValid"
      >Увійти
      </q-btn>
      <q-btn
        flat
        color="negative"
        @click="doCancel"
        slot="bottom-buttons"
      >Скасування
      </q-btn>
    </af-form>
  </div>
</template>

<script>
  import {QBtn} from 'quasar-framework'
  import {AfForm, AfFieldSet, AfInput} from './base'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {mapEvent, strNotEmpty} from '../routines'

  export default {
    name: '',
    props: [],
    data () {
      return {
        username: '',
        userpass: '',
        eventMapper: {
          'key:enter': this.doLogin
        }
      }
    },
    components: {
      AfForm,
      QBtn,
      AfInput,
      AfFieldSet
    },
    methods: {
      doLogin () {
        if (!this.isValid) return
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
      isValid () {
        return strNotEmpty(this.username) && strNotEmpty(this.userpass)
      }
    },
    created () {
      mapEvent(this, true)
    },
    mounted () {
    },
    beforeDestroy () {
      mapEvent(this, false)
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

<style lang="stylus">
  @import '~variables'
</style>

<template>
  <div class="row justify-center relative-position">
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
      >УВІЙТИ
      </q-btn>
      <q-btn
        flat
        color="negative"
        @click="doCancel"
        slot="bottom-buttons"
      >СКАСУВАННЯ
      </q-btn>
    </af-form>
    <af-load-cover :progress="isActionInProgress"/>
  </div>
</template>

<script>
  import {QBtn} from 'quasar-framework'
  import {AfForm, AfFieldSet, AfInput, AfLoadCover} from './base'
  import {mapState, mapGetters} from 'vuex'
  import {mapEvent, strNotEmpty} from '../routines'

  export default {
    name: '',
    props: [],
    data () {
      return {
        username: '',
        userpass: '',
        eventMapper: {
          'key:enter': this.doLogin,
          'app:userdata:loaded': this.toClaims
        }
      }
    },
    components: {
      AfForm,
      QBtn,
      AfInput,
      AfFieldSet,
      AfLoadCover
    },
    methods: {
      doLogin () {
        if (!this.isValid) return
        void this.$store.dispatch('authDoLogin', {
          socket: this.$socket,
          user: this.username,
          pass: this.userpass
        })
      },
      doCancel () {
        this.$router.back()
      },
      toClaims () {
        this.authorized && this.$router.push('/claims')
      }
    },
    computed: {
      ...mapState({
        authError: state => state.auth.authError,
        authorized: state => state.auth.authorized
      }),
      ...mapGetters([
        'isActionInProgress'
      ]),
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
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

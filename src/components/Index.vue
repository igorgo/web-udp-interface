<!--suppress JSUnusedGlobalSymbols -->
<template>
  <q-layout
    ref="layout"
    view="hHh Lpr lff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar class="afinasql-bg">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu"/>
      </q-btn>
      <q-toolbar-title>
        Афіна Сіквел Рекламації
        <div slot="subtitle">Проектно-методічний відділ</div>
      </q-toolbar-title>
    </q-toolbar>
    <div slot="left">
      <main-menu/>
    </div>
    <router-view/>
  </q-layout>
</template>

<script>
  import {
    QLayout,
    QToolbar,
    QBtn,
    QIcon,
    QToolbarTitle
  } from 'quasar-framework'
  import mainMenu from './main-menu/MainMenu.vue'

  export default {
    data () {
      return {
        eventsMap: {
          'app:unauthorized': this.__onUnauthorized,
          'app:session:not:valid': this.__onSessionNonValid
        }
      }
    },
    components: {
      QLayout,
      QToolbar,
      QBtn,
      QIcon,
      QToolbarTitle,
      mainMenu
    },
    methods: {
      __onUnauthorized () {
        if (this.$store.state.auth.sessionID) {
          this.$socket.emit('validate_session', {sessionID: this.$store.state.auth.sessionID})
        }
        else this.$router.push('/login')
      },
      __onSessionNonValid () {
        this.$router.push('/login')
      }
    },
    created () {
      for (let i in this.eventsMap) {
        if (this.eventsMap.hasOwnProperty(i)) this.$q.events.$on(i, this.eventsMap[i])
      }
    },
    beforeDestroy () {
      for (let i in this.eventsMap) {
        if (this.eventsMap.hasOwnProperty(i)) this.$q.events.$off(i, this.eventsMap[i])
      }
    }

  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

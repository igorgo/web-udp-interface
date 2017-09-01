<template>
  <q-layout
    ref="layout"
    view="hHh Lpr lff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar>
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
      <q-list no-border link inset-delimiter>
        <q-list-header class="text-center">
          <img height="24" src="~assets/logos_afina_color.png">
        </q-list-header>
        <q-item @click="login()">
          <q-item-side icon="account circle"/>
          <q-item-main label="Вхід"></q-item-main>
        </q-item>
        <q-item @click="logoff()">
          <q-item-side icon="exit to app"/>
          <q-item-main label="Вихід"></q-item-main>
        </q-item>
      </q-list>
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
    QToolbarTitle,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain
  } from 'quasar'

  export default {
    components: {
      QLayout,
      QToolbar,
      QBtn,
      QIcon,
      QToolbarTitle,
      QList,
      QListHeader,
      QItem,
      QItemSide,
      QItemMain
    },
    data () {
      return {}
    },
    methods: {
      login (val) {
        this.$refs.layout.toggleLeft()
        this.$router.push('/login')
        // this.$socket.emit('authentication', val)
      },
      logoff (val) {
        this.$refs.layout.toggleLeft()
        this.$router.push('/')
        this.$socket.emit('logoff', val)
      }
    },
    mounted: function () {
      this.$options.sockets.authorized = () => {
        alert('authorized')
      }
      this.$options.sockets.unauthorized = (d) => {
        alert('unauthorized:' + d.message)
      }
    }
  }
</script>

<style lang="stylus">

</style>

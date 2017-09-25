<template>
  <q-layout
    ref="layout"
    view="hHh Lpr lff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar color="deep-orange-12">
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
        <q-list-header class="text-center" v-show="authorized"><q-icon name="account circle" /> {{userFullName}} </q-list-header>
        <q-item-separator />
        <q-side-link item to="/login" exact v-show="!authorized">
          <q-item-side icon="fa-sign-in"/>
          <q-item-main label="Вхід"></q-item-main>
        </q-side-link>
        <q-side-link item to="/main" exact>
          <q-item-side icon="fa-home"/>
          <q-item-main label="Головна"></q-item-main>
        </q-side-link>
        <q-side-link item to="/claims" exact v-show="authorized">
          <q-item-side icon="whatshot"/>
          <q-item-main label="Рекламації"></q-item-main>
        </q-side-link>
        <q-side-link item to="/filters" exact v-show="authorized">
          <q-item-side icon="filter list"/>
          <q-item-main label="Управління фільтрами"></q-item-main>
        </q-side-link>
        <q-item-separator v-show="authorized" />
        <q-item @click="logoff()" v-show="authorized">
          <q-item-side icon="fa-sign-out"/>
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
    QItemMain,
    QSideLink,
    QItemSeparator
  } from 'quasar'
  import { mapState } from 'vuex'

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
      QItemMain,
      QSideLink,
      QItemSeparator
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState({
        authorized: state => state.auth.authorized,
        userFullName: state => state.auth.userFullName
      })
    },
    methods: {
      login () {
        this.$refs.layout.toggleLeft()
        this.$router.push({path: '/login', query: {redirect: 'test'}})
      },
      logoff () {
        // this.$refs.layout.toggleLeft()
        this.$router.push('/main')
        this.$socket.emit('logoff')
      }
    },
    mounted: function () {
      // this.$refs.layout.hideLeft()
    }
  }
</script>

<style lang="stylus">

</style>

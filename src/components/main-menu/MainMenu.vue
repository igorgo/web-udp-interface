<!--suppress HtmlUnknownTarget -->
<template>
  <q-list no-border link inset-delimiter>
    <q-list-header class="text-center af-header-title">
      <!--suppress HtmlUnknownTarget -->
      <img style="max-width: 80%;" src="~assets/afina_sql_col.svg">
    </q-list-header>
    <q-list-header class="text-center af-header-title" v-if="authorized">
      <q-icon style="font-size: 2em" name="account circle"/>
      {{userFullName}}
    </q-list-header>
    <q-item-separator/>
    <main-menu-item
      v-if="!authorized"
      route-to="/login"
      icon="fa-sign-in"
      label="Вхід"
    />
    <main-menu-item
      route-to="/main"
      icon="fa-home"
      label="Головна"
    />
    <main-menu-item
      v-if="authorized"
      route-to="/claims"
      icon="whatshot"
      label="Рекламації"
    />
    <main-menu-item
      v-if="authorized"
      route-to="/filters"
      icon="filter list"
      label="Управління фільтрами"
    />
    <q-item-separator v-if="authorized"/>
    <main-menu-item
      v-if="authorized"
      @click="logoff"
      icon="fa-sign-out"
      label="Вихід"
    />
  </q-list>
</template>

<script>
  import {QList, QItemSeparator, QListHeader, QIcon} from 'quasar-framework'
  import MainMenuItem from './MainMenuItem.vue'
  import {mapState} from 'vuex'

  export default {
    components: { QList, QItemSeparator, QListHeader, QIcon, MainMenuItem },
    methods: {
      logoff () {
        void this.$store.dispatch('rootLogoff', { router: this.$router, socket: this.$socket })
      }
    },
    computed: {
      ...mapState({
        authorized: state => state.auth.authorized,
        userFullName: state => state.auth.userFullName
      })
    }
  }
</script>

<style lang="stylus">
  .af-header-title
    padding-right 16px
</style>

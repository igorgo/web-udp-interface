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
    components: {
      QLayout,
      QToolbar,
      QBtn,
      QIcon,
      QToolbarTitle,
      mainMenu
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

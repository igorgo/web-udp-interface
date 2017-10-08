<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
  /*
   * Root component
   */
  export default {
    created () {
      if (this.$store.state.auth.sessionID) {
        this.$socket.emit('validate_session', { sessionID: this.$store.state.auth.sessionID })
      }
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  .content
    margin 10px 15px 0 15px

  h5
    color $afinasql

  pre
    white-space pre-wrap
    white-space -moz-pre-wrap
    white-space -pre-wrap
    white-space -o-pre-wrap
    word-wrap break-word

  .afina-bg
    background $afina !important
    color white

  .afinasql-bg
    background $afinasql !important
    color white

  .af-disabled-nonactive
    color $af-disabled-fg !important

  .af-disabled-active
    color $af-disabled-fg-invert !important

  .af-enabled-nonactive
    color $af-enabled-fg !important

  .af-enabled-active
    color $af-enabled-fg-invert !important

  .af-selectable
    -webkit-user-select text !important
    -moz-user-select text !important
    -ms-user-select text !important
    user-select text !important

</style>

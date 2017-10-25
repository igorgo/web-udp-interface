<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
  import {
    AE_PROGRESS_SET,
    AE_PROGRESS_RESET
  } from 'app-events'
  /*
   * Root component
   */
  export default {
    created () {
      if (this.$store.getters.sessionID) {
        this.$store.dispatch('validateSession', { socket: this.$socket })
      }
      this.$q.events.$on(AE_PROGRESS_SET, () => { this.$store.dispatch('setActionProgress') })
      this.$q.events.$on(AE_PROGRESS_RESET, () => { this.$store.dispatch('resetActionProgress') })
    }
  }
</script>

<style lang="stylus">
</style>

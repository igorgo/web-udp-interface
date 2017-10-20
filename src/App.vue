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
      this.$q.events.$on('progress:set', () => { this.$store.dispatch('setActionProgress') })
      this.$q.events.$on('progress:reset', () => { this.$store.dispatch('resetActionProgress') })
    }
  }
</script>

<style lang="stylus">
</style>

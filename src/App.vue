<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
/*
 * Root component
 */
export default {
  created () {
    if (this.$store.getters.sessionID) {
      this.$socket.emit('validate_session', {sessionID: this.$store.getters.sessionID})
    }
  }
}
</script>

<style></style>

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
    if (this.$store.state.auth.sessionID) {
      this.$socket.emit('validate_session', {sessionID: this.$store.state.auth.sessionID})
    }
  }
}
</script>

<style>
  .content {
    margin: 10px auto 0 15px;
  }
  h5 {
    color: #ff6e40;
  }

</style>

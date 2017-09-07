<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted: function () {
    this.$socket.emit('get_claim_list', {})
  }
}
</script>

<style>
</style>

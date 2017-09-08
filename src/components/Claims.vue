<template>
  <div></div>
</template>

<script>
  import {SessionStorage} from 'quasar'

  export default {
    data () {
      return {}
    },
    computed: {
      currentCondition: () => this.$store.getters.currentCondition
    },
    mounted: function () {
      this.$socket.emit('get_claim_list', {
        conditionId: this.currentCondition
      })
    }
  }
</script>

<style>
</style>

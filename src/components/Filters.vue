<template>
  <div>
    <h5>Мої фільтри рекламацій</h5>
    <q-list highlight>
      <div v-for="filter in filters">
        {{filter['RN']}}
      </div>
    </q-list>
  </div>
</template>

<script>
  import {QList} from 'quasar'

  export default {
    data () {
      return {}
    },
    components: {
      QList
    },
    computed: {
      filters () {
        return this.$store.getters.filters
      }
    },
    mounted: function () {
      this.$socket.emit('get_claim_conditions_list')
    }
  }
</script>

<style>
</style>

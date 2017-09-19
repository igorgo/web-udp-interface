<template>
  <div class="row items-center justify-around">
    <div class="col-6 text-center">
      <q-select
        stack-label="Фільтр"
        inverted
        color="amber"
        separator
        :options="filterOptions"
        v-model="currCondition"
        @change="onFilterChange"
      />
    </div>
    <div class="col-6 text-center">Сортування</div>
  </div>
</template>

<script>
  import {QSelect} from 'quasar'

  export default {
    data () {
      return {}
    },
    components: {
      QSelect
    },
    computed: {
      filterOptions () {
        // const filters = this.$store.getters.filters
        return this.$store.getters.filters.map(f => {
          return {
            label: f['SNAME'],
            value: f['RN']
          }
        })
      },
      currCondition () {
        return this.$store.getters.currentCondition
      }
    },
    name: 'claims-header',
    created: function () {
      this.$socket.emit('get_claim_conditions_list')
    },
    methods: {
      onFilterChange (val) {
        this.$store.dispatch('setCurrentCondition', {value: val, socket: this.$socket})
      }
    }
  }
</script>

<style>
</style>

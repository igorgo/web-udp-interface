<template>
  <div class="row items-center justify-around">
    <div class="col-6">
      <q-select
        float-label="Фільтр"
        inverted
        color="amber"
        separator
        :options="filterOptions"
        v-model="currCondition"
        @change="onFilterChange"
        class="no-margin"
      />
    </div>
    <div class="col-6 text-center">Сортування</div>
  </div>
</template>

<script>
  import {QSelect} from 'quasar'
  import * as mts from '../../store/mutation-types'
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
        this.$store.commit(mts.CLAIMS_FILTER_CHANGE, {value: val, socket: this.$socket})
        // this.$store.dispatch('setCurrentCondition', {value: val, socket: this.$socket})
      }
    }
  }
</script>

<style lang="styl">
</style>

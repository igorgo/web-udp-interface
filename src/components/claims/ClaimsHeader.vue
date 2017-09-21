<template>
  <div class="row items-center justify-around">
    <div class="col-5">
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
    <div class="col-1">
      <q-btn
        small
        color="amber"
        style="margin-left: 5px"
        @click="onNewFilterClick"
      >Новий</q-btn>
    </div>
    <div class="col-5"><q-select
      float-label="Сортування"
      inverted
      color="purple"
      separator
      :options="sortOptions"
      v-model="currSort"
      @change="onSortChange"
      class="no-margin"
    /></div>
    <div class="col-1">
      <q-checkbox
        v-model="currSortOrder"
        @change="onSortOrderChange"
        class="cb-large"
        checked-icon="arrow drop down"
        unchecked-icon="arrow drop up"
        color="purple"
      />
    </div>
  </div>
</template>

<script>
  import {QSelect, QCheckbox, QBtn} from 'quasar'
  import * as mts from '../../store/mutation-types'
  export default {
    data () {
      return {}
    },
    components: {
      QSelect,
      QCheckbox,
      QBtn
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
      currCondition () { return this.$store.getters.currentCondition },
      sortOptions () { return this.$store.getters.sortsList },
      currSort () { return this.$store.getters.claimSort },
      currSortOrder () { return this.$store.getters.claimSortDesc }
    },
    name: 'claims-header',
    created: function () {
      this.$socket.emit('get_claim_conditions_list')
    },
    methods: {
      onFilterChange (val) {
        this.$store.commit(mts.CLAIMS_FILTER_CHANGE, {value: val, socket: this.$socket})
      },
      onSortChange (val) {
        this.$store.commit(mts.CLAIMS_SORT_CHANGE, {value: val, socket: this.$socket})
      },
      onSortOrderChange (val) {
        this.$store.commit(mts.CLAIMS_SORT_ORDER_CHANGE, {value: !val, socket: this.$socket})
      },
      onNewFilterClick () {
        console.log('todo: new filter redirect')
        // todo: new filter redirect
      }
    }
  }
</script>

<style lang="styl">
  .q-checkbox-checked
  .q-checkbox-unchecked
  .cb-large
    height: 54px !important
    width: 30px !important
    font-size: 54px !important
</style>

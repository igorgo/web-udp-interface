<template>
  <div class="row items-center justify-around">
    <div class="col-xl-5 col-9">
      <q-select
        float-label="Фільтр"
        inverted
        color="amber"
        separator
        :options="filterOptions"
        v-model="currentCondition"
        @change="onFilterChange"
        class="no-margin"
      />
    </div>
    <div class="col-xl-1 col-3">
      <q-btn
        small
        color="amber"
        style="margin-left: 5px"
        @click="onNewFilterClick"
      >Новий</q-btn>
    </div>
    <div class="col-xl-5 col-9"><q-select
      float-label="Сортування"
      inverted
      color="purple"
      separator
      :options="sortsList"
      v-model="currentClaimSort"
      @change="onSortChange"
      class="no-margin"
    /></div>
    <div class="col-xl-1 col-3">
      <q-checkbox
        v-model="claimSortDesc"
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
  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      QSelect,
      QCheckbox,
      QBtn
    },
    computed: {
      ...mapState({
        currentCondition: store => store.claims.currentCondition,
        currentClaimSort: store => store.claims.currentClaimSort
      }),
      ...mapGetters([
        'filterOptions',
        'sortsList',
        'claimSortDesc'
      ])
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
        alert('todo: new filter redirect')
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

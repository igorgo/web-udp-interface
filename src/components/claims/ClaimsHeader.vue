<template>
  <div class="row items-center justify-around">
    <div class="col-md col-sm-12 row  items-center">
      <div class="col-10">
        <q-select
          stack-label="Фільтр"
          inverted
          color="secondary"
          separator
          :options="filterOptions"
          v-model="currentCondition"
          @change="onFilterChange"
          class="no-margin"
        />
      </div>
      <div class="col-2">
        <q-btn
          small
          round
          flat
          color="secondary"
          @click="onNewFilterClick"
          icon="ion-funnel"
        />
      </div>
    </div>
    <div class="col-md col-sm-12 row  items-center">
      <div class="col-10">
        <q-select
          stack-label="Сортування"
          inverted
          color="secondary"
          separator
          :options="sortsList"
          v-model="currentClaimSort"
          @change="onSortChange"
          class="no-margin"
        />
      </div>
      <div class="col-2">
        <q-checkbox
          v-model="claimSortDesc"
          @change="onSortOrderChange"
          class="sort-icon"
          checked-icon="arrow drop down"
          unchecked-icon="arrow drop up"
          color="secondary"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import {QSelect, QCheckbox, QBtn} from 'quasar-framework'
  import {mapState, mapGetters} from 'vuex'

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
      void this.$store.dispatch('getConditionsList', {socket: this.$socket})
    },
    methods: {
      onFilterChange (value) {
        void this.$store.dispatch('setCurrentCondition', { value, socket: this.$socket })
      },
      onSortChange (value) {
        void this.$store.dispatch('setCurrentSort', { value, socket: this.$socket })
      },
      onSortOrderChange (value) {
        void this.$store.dispatch('setCurrentClaimSortOrder', { value: !value, socket: this.$socket })
      },
      onNewFilterClick () {
        void this.$store.dispatch('getConditionFilter', { socket: this.$socket, conditionId: null, from: 'claims' })
        this.$router.push('/filter')
      }
    }
  }
</script>

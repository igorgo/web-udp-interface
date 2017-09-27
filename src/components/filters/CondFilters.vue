<template>
  <div class="content">
    <h5>Мої фільтри рекламацій</h5>
    <q-list no-border highlight>
      <cond-filter v-for="iFilter in filters" :key="iFilter['RN']" :filterRec="iFilter"/>
    </q-list>
    <q-fixed-position corner="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" @click="addFilter">
        <q-icon name="add" />
      </q-btn>
    </q-fixed-position>
  </div>
</template>

<script>
  import { QList, QFixedPosition, QIcon, QBtn } from 'quasar'
  import CondFilter from './CondFilter.vue'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {}
    },
    components: {
      CondFilter,
      QList,
      QFixedPosition,
      QIcon,
      QBtn
    },
    computed: {
      ...mapState({
        filters: state => state.filters.filters
      })
    },
    methods: {
      addFilter () {
        this.$store.dispatch('getConditionFilter', {socket: this.$socket, conditionId: null})
        this.$router.push('/filter')
      }
    },
    mounted: function () {
      this.$socket.emit('get_claim_conditions_list')
    }
  }
</script>

<style>
</style>

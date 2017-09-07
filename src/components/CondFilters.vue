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
  import CondFilter from './filters/CondFilter.vue'

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
      filters () {
        return this.$store.getters.filters
      }
    },
    methods: {
      addFilter () {
        alert('add')
      }
    },
    mounted: function () {
      this.$socket.emit('get_claim_conditions_list')
    }
  }
</script>

<style>
</style>

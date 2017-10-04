<template>
  <div class="content">
    <h5>Мої фільтри рекламацій</h5>
    <q-list no-border>
      <cond-filter :class="{'afinasql-bg':index===listIndex}" v-for="(item, index) in filters" :key="index"
                   :filterRec="item" :filterIndex="index"/>
    </q-list>
    <q-fixed-position corner="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" @click="addFilter">
        <q-icon name="add"/>
      </q-btn>
    </q-fixed-position>
  </div>
</template>

<script>
  import {QList, QFixedPosition, QIcon, QBtn} from 'quasar-framework'
  import CondFilter from './CondFilter.vue'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        eventMapper: {
          'key:arrow:down': this.__onKeyArrowDown,
          'key:arrow:up': this.__onKeyArrowUp,
          'key:f2': this.__editFilter,
          'key:insert': this.addFilter
        }
      }
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
        filters: state => state.filters.filters,
        listIndex: state => state.filters.listIndex
      })
    },
    methods: {
      addFilter () {
        void this.$store.dispatch('getConditionFilter', { conditionId: null, from: 'filters' })
        this.$router.push('/filter')
      },
      __onKeyArrowDown () {
        void this.$store.dispatch('conditionListScroll', 1)
      },
      __onKeyArrowUp () {
        void this.$store.dispatch('conditionListScroll', -1)
      },
      __editFilter () {
        if ((this.listIndex >= 0) && (this.filters[this.listIndex]['EDITABLE'] === 'Y')) {
          void this.$store.dispatch('getConditionFilter', {socket: this.$socket, conditionId: this.filters[this.listIndex]['RN'], from: 'filters'})
          this.$router.push('/filter')
        }
      }
    },
    mounted: function () {
      void this.$store.dispatch('getConditionsList', this.$socket)
    },
    created () {
      for (let i in this.eventMapper) {
        if (this.eventMapper.hasOwnProperty(i)) this.$q.events.$on(i, this.eventMapper[i])
      }
    },
    beforeDestroy () {
      for (let i in this.eventMapper) {
        if (this.eventMapper.hasOwnProperty(i)) this.$q.events.$off(i, this.eventMapper[i])
      }
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  .af-active-line
    background-color $primary
</style>

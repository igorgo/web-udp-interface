<template>
  <q-item @click="conditionListPos(filterIndex)">
    <q-item-main
      :label="filterRec['SNAME']"
    />
    <q-item-side
      :class="[{'cursor-pointer': editable}, iconClass]"
      :icon="iconEdit"
      @click="editable && editFilter(filterRec['RN'])"
    />
  </q-item>
</template>

<script>
  import {
    QItem,
    QItemSide,
    QItemMain,
    QTooltip
  } from 'quasar-framework'
  import {mapActions, mapState} from 'vuex'

  export default {
    data () {
      return {}
    },
    components: {
      QItem,
      QItemSide,
      QItemMain,
      QTooltip
    },
    name: 'cond-filter',
    props: ['filterRec', 'filterIndex'],
    computed: {
      ...mapState({
        listIndex: state => state.filters.listIndex
      }),
      editable () {
        return this.$props['filterRec']['EDITABLE'] === 'Y'
      },
      iconEdit () {
        return this.editable ? 'edit' : 'lock'
      },
      iconClass () {
        return `af-${this.editable ? 'en' : 'dis'}abled-${(this.listIndex === this.filterIndex) ? '' : 'non'}active`
      }
    },
    methods: {
      ...mapActions([
        'conditionListPos'
      ]),
      editFilter (rn) {
        void this.$store.dispatch('getConditionFilter', { socket: this.$socket, conditionId: rn, from: 'filters' })
        this.$router.push('/filter')
      }
    }
  }
</script>

<style lang="stylus">
</style>

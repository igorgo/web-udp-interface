<template>
  <q-item @click="conditionListPos(filterIndex)">
    <q-item-main
      :label="filterRec['SNAME']"
    />
    <q-item-side
      :class="{'cursor-pointer': editable}"
      :icon="iconEdit"
      :color="iconColor"
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
  import {mapActions} from 'vuex'
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
      editable () {
        return this.$props['filterRec']['EDITABLE'] === 'Y'
      },
      iconEdit () {
        return this.editable ? 'edit' : 'lock'
      },
      iconColor () {
        return this.editable ? 'primary' : 'grey-6'
      }
    },
    methods: {
      ...mapActions([
        'conditionListPos'
      ]),
      editFilter (rn) {
        void this.$store.dispatch('getConditionFilter', {socket: this.$socket, conditionId: rn, from: 'filters'})
        this.$router.push('/filter')
      }
    }
  }
</script>

<style>
</style>

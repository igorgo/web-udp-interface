<template>
  <q-item>
    <q-item-main
      :label="filterRec['SNAME']"
    />
    <q-item-side :icon="iconEdit" :color="iconColor"/>
  </q-item>
</template>

<script>
  import {
    QItem,
    QItemSide,
    QItemMain
  } from 'quasar'

  export default {
    data () {
      return {}
    },
    components: {
      QItem,
      QItemSide,
      QItemMain
    },
    name: 'cond-filter',
    props: ['filterRec'],
    computed: {
      editable () {
        return this.$props['filterRec']['EDITABLE'] === 'Y'
      },
      iconEdit () {
        return this.$props['filterRec']['EDITABLE'] === 'Y'
          ? 'edit' : 'lock'
      },
      iconColor () {
        return this.$props['filterRec']['EDITABLE'] === 'Y'
          ? 'primary' : 'grey-6'
      }
    }
  }
</script>

<style>
</style>

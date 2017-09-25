<template>
  <q-item>
    <q-item-main
      :label="filterRec['SNAME']"
    />
    <q-item-side :class="{'cursor-pointer': editable}" :icon="iconEdit" :color="iconColor" @click="editable && editFilter(filterRec['RN'])"/>
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
        return this.editable ? 'edit' : 'lock'
      },
      iconColor () {
        return this.editable ? 'primary' : 'grey-6'
      }
    },
    methods: {
      editFilter (rn) {
        // todo: open filter edit form
        alert('todo: open filter edit form ' + rn)
      }
    }
  }
</script>

<style>
</style>

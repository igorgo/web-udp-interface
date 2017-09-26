<template>
  <q-collapsible :class="cls" opened icon-toggle :label="caption">
    <div :style="slotStyle">
      <slot></slot>
    </div>
  </q-collapsible>
</template>

<script>
  import { QList, QListHeader, QCollapsible } from 'quasar'
  export default {
    name: 'af-field-set',
    components: { QList, QListHeader, QCollapsible },
    props: {
      caption: String
    },
    data () {
      return {
      }
    },
    computed: {
      cls () {
        if (this.$parent['color']) {
          return 'text-' + this.$parent['color']
        }
      },
      slotStyle () {
        console.log(this)
        if (this.$parent['color']) {
          return 'border-top: 1px solid ' + this.$parent['color'] + ';'
        }
      }
    },
    methods: {}
  }
</script>

<style lang="styl">
  .q-list  + .q-list
    margin-top: 10px
  .q-list
    margin-top: 10px
  .q-list-header
    line-height: 1em
</style>

<template>
  <q-collapsible class="af-field-set" opened icon-toggle :label="caption">
    <div class="af-field-set-slot">
      <slot></slot>
    </div>
  </q-collapsible>
</template>

<script>
  import { QList, QListHeader, QCollapsible } from 'quasar-framework'

  export default {
    name: 'af-field-set',
    components: { QList, QListHeader, QCollapsible },
    props: {
      caption: String
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  .q-list + .q-list
    margin-top: 10 px
  .q-list
    margin-top: 10 px
  .q-list-header
    line-height: 1 em
  .af-field-set > .q-item-division
    min-height: 20px
    padding-bottom: 0
  .af-field-set>div>.q-collapsible-sub-item
    padding-top: 0
  .af-field-set-slot
    padding-top: 8px
    border-top: 1px solid $primary
</style>

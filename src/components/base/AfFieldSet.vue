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
    padding-top: 5px
  .af-field-set>div>.q-collapsible-sub-item
    padding-top: 0
  .af-field-set-slot
    padding-top: 4px
    border-top: 1px solid $primary
  .af-field-set-slot .q-if
    font-size 14px
    min-height 16px
    margin-bottom: 4px
    margin-top: 4px
    padding-bottom: 3px
  .af-field-set-slot .q-if+.q-select
    min-height 42px !important
  .af-field-set-slot .q-if-label
    color $primary
    top 15px
  .af-field-set-slot .q-if-has-label .q-if-inner
    min-height 20px !important
  .af-field-set-slot .self-start
    align-self flex-end
  .af-field-set-slot .q-if-label-above
    -webkit-transform scale(0.9) translate(0, -22px)
    transform: scale(0.85) translate(0, -22px)
</style>

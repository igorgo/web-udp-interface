<template>
  <q-collapsible class="af-field-set" :class="cls" opened icon-toggle :label="caption">
    <div :style="slotStyle" class="af-field-set-slot">
      <slot></slot>
    </div>
  </q-collapsible>
</template>

<script>
  import { QList, QListHeader, QCollapsible, dom } from 'quasar'

  export default {
    name: 'af-field-set',
    components: { QList, QListHeader, QCollapsible },
    props: {
      caption: String
    },
    data () {
      return {
        txtColor: ''
      }
    },
    computed: {
      cls () {
        /* if (this.color) {
          return 'text-' + this.$parent['color']
        } */
      },
      slotStyle () {
        /* if (this.$parent['color']) {
          // return 'border-top: 1px solid ' + dom.style(this.$el, 'color') + ';'
          return 'border-top: 1px solid ' + this.txtColor + ';'
        } */
        return 'border-top: 1px solid ' + this.txtColor + ';'
      },
      color () {
        // return this.$parent['color']
      }
    },
    mounted () {
      this.txtColor = dom.style(this.$el, 'color')
    },
    methods: {
    }
  }
</script>

<style lang="styl">
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

</style>

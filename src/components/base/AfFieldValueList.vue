<template>
  <div>
    <div class="af-f-v-list">
      <!--div v-for="item in items" class="row">
        <div :class="labelClasses">
          <div
            :class="[labelBg ? 'bg-' + labelBg: '', labelFg ? 'text-' + labelFg: '', 'text-' + labelAlign]"
            class="strong af-f-v-list-cell"
          >
            {{item.label}}:
          </div>
        </div>
        <div :class="valueClasses">
          <div
            :class="[valueBg ? 'bg-' + valueBg: '', valueFg ? 'text-' + valueFg: '', 'text-' + valueAlign]"
            class="af-f-v-list-cell"
          >
            {{item.text}}
          </div>
        </div>
      </div-->
      <div v-for="item in items" class="af-f-v-list-row">
        <div class="strong af-f-v-list-lab"
             :class="[labelBg ? 'bg-' + labelBg: '', labelFg ? 'text-' + labelFg: '', 'text-' + labelAlign]"
        >
          {{item.label}}:
        </div>
        <div class="af-f-v-list-val"
             :class="[valueBg ? 'bg-' + valueBg: '', valueFg ? 'text-' + valueFg: '', 'text-' + valueAlign]"
        >
          {{item.text || '&nbsp;'}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'af-field-value-list',
    props: {
      items: Array,
      valueWidth: {
        type: Array,
        default: [6, 6, 6, 6, 6]
      },
      valueBg: String,
      valueFg: String,
      labelBg: String,
      labelFg: String,
      labelAlign: {
        type: String,
        default: 'left',
        validator: val => (new Set(['left', 'right', 'center'])).has(val)
      },
      valueAlign: {
        type: String,
        default: 'right',
        validator: val => (new Set(['left', 'right', 'center'])).has(val)
      }
    },
    computed: {
      labelClasses () {
        return `col-xl-${12 - this.valueWidth[0]} col-lg-${12 - this.valueWidth[1]} col-md-${12 - this.valueWidth[2]} col-sm-${12 - this.valueWidth[3]} col-xs-${12 - this.valueWidth[4]}`
      },
      valueClasses () {
        return `col-xl-${this.valueWidth[0]} col-lg-${this.valueWidth[1]} col-md-${this.valueWidth[2]} col-sm-${this.valueWidth[3]} col-xs-${this.valueWidth[4]}`
      }
    }
  }
</script>

<style lang="stylus">
  @import '~variables'

  .af-f-v-list
    border 2px solid $primary
    border-radius 5px
    margin 5px
    padding 5px
    font-size 0.8em

  .af-f-v-list-lab, .af-f-v-list-val
    padding 3px
    margin 0 0 1px 0
    border-radius 3px
    height calc(100% - 1px)
    display: inline-block

</style>


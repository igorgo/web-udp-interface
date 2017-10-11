<template>
  <div style="padding: 2px">
    <table class="af-f-v-list" cellspacing="1px" :class="{'af-f-v-list-brd': border}">
      <tr v-for="item in items" class="af-f-v-list-row">
        <td class="strong af-f-v-list-lab"
             :class="[labelBg ? 'bg-' + labelBg: '', labelFg ? 'text-' + labelFg: '', 'text-' + labelAlign]"
        >
          {{item.label}}:
        </td>
        <td class="af-f-v-list-val"
             :class="[valueBg ? 'bg-' + valueBg: '', valueFg ? 'text-' + valueFg: '', 'text-' + valueAlign]"
        >
          <div style="display: inline-block; padding: 0 1px">{{item.value}}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'af-field-value-list',
    props: {
      items: Array,
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
      },
      border: Boolean
    }
  }
</script>

<style lang="stylus">
  @import '~variables'

  .af-f-v-list
    padding 2px
    font-size 0.8em
    width 100%

  .af-f-v-list-brd
    border 2px solid $primary
    border-radius 5px

  .af-f-v-list-lab, .af-f-v-list-val
    padding 3px
    border-radius 3px

</style>


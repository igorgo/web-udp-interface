<template>
  <div>
    <table class="full-width">
      <tr v-for="item in items">
        <td class="af-label">{{item.label}}</td>
        <td class="af-field" :style="{width: textWidth}">{{item.text}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'af-comp-table',
    props: {
      items: {
        type: Array,
        required: false
      },
      textWidth: String
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  .af-row
    display: flex
    flex-flow: row wrap
    justify-content: space-around

  .af-field
    text-align: right
    color: white
    font-size: 0.9rem
    background: $primary
    padding: 3px 3px
    margin: 1px
    border-radius: 3px

  .af-label
    text-align: left
    font-size: 0.9rem
    background: ivory
    padding: 3px 3px
    margin: 1px
    border-radius: 3px
</style>


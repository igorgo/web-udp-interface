<template>
  <table>
    <tr v-for="item in items">
      <td class="af-label">{{item.label}}</td><td class="af-field">{{item.text}}</td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'af-comp-table',
    props: {
      items: {
        type: Array,
        required: false
      }
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
    text-align:right
    color:white
    font-size : 0.9rem
    background:$primary
    padding: 3px 3px
    margin:1px
    border-radius: 3px
  .af-label
    text-align:left
    font-size : 0.9rem
    background:ivory
    padding: 3px 3px
    margin:1px
    border-radius: 3px
</style>


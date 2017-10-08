<template>
  <div class="af-row">
    <div v-if="value" class="af-label">{{caption}}</div>
    <div v-if="value" class="af-date-field">{{value}}</div>
  </div>
</template>

<script>
  export default {
    name: 'af-text-with-label',
    components: {},
    props: {
      caption: String,
      value: String
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  .af-row
    display: flex
    flex-flow: row wrap
    justify-content: flex-end
  .af-date-field
    text-align:right
    color:white
    font-size : 0.9rem
    background:$primary
    padding: 3px 3px
    margin:1px
    border-radius: 0 3px 3px 0
  .af-label
    text-align:left
    font-size : 0.9rem
    background:ivory
    padding: 3px 3px
    margin:1px
    border-radius: 3px 0 0 3px
</style>

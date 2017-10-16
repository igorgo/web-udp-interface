<template>
  <q-input
    inverted
    :stack-label="label"
    :value="value"
    :type="type"
    :before="__icon"
    @input="__input"
    :clearable="clearable"
    :color="__color"
  >
    <q-autocomplete
      :staticData="staticData"
      :filter="filter"
      :max-results="maxResults"
    />
  </q-input>
</template>
<script>
  import {QAutocomplete} from 'quasar-framework'
  import AfInputMixin from './af-input-mixin'
  export default {
    name: 'af-autocomplete',
    mixins: [AfInputMixin],
    components: {
      QAutocomplete
    },
    props: {
      staticData: Object,
      filter: Function,
      maxResults: {
        type: Number,
        default: 10000
      }
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

<style lang="stylus">
    @import '~variables'
</style>

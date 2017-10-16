<template>
    <af-dialog-select
      :stack-label="label"
      :value="value"
      :options="options"
      multiple
      inverted
      :disable="disable"
      @change="__change"
    />
</template>

<script>
  import {} from 'quasar-framework'
  import AfDialogSelect from './am-multi-select-mixin'

  export default {
    name: '',
    props: {
      label: String,
      options: Array,
      value: {
        required: true
      },
      disable: Boolean
    },
    components: {AfDialogSelect},
    methods: {
      __change (data) {
        this.$emit('change', data)
      }
    }
  }
</script>

<style lang="stylus">
    @import '~variables'
</style>

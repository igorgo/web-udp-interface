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
    :min="min"
    :max="max"
    :min-rows="minRows"
    :fixed-font="fixedFont"
    :class="{'af-fixed-font': fixedFont}"
  />
</template>
<script>
  import AfInputMixin from './af-input-mixin'
  export default {
    name: 'af-input',
    mixins: [AfInputMixin]
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

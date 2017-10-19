<template>
  <q-select
    :color="__color"
    :value="value"
    :options="options"
    inverted
    :stack-label="label"
    @input="__change"
    :multiple="multiple"
    :filter="filter"
    :autofocus-filter="autofocusFilter"
    :disable="disable"
  />
</template>

<script>
  import {QSelect} from 'quasar-framework'

  export default {
    name: 'af-select',
    mixins: [QSelect],
    props: {
      label: String,
      required: Boolean
    },
    components: {QSelect},
    methods: {
      __change (val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    computed: {
      __color () {
        if (this.required) {
          if ((typeof this.value) === 'number') {
            return (this.value !== -1) ? 'primary' : 'secondary'
          }
          else {
            return (this.value) ? 'primary' : 'secondary'
          }
        }
        else {
          return 'primary'
        }
      }
    }
  }
</script>


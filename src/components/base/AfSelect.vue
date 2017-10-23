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
    :disabled="disable"
    :disable="disable"
    :after="additionalBtns"
  />
</template>

<script>
  import {QSelect} from 'quasar-framework'

  export default {
    name: 'af-select',
    mixins: [QSelect],
    props: {
      label: String,
      required: Boolean,
      clearable: Boolean
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
        return this.isValid ? 'primary' : 'secondary'
      },
      isValid () {
        if (this.required) {
          let valid = false
          switch (typeof this.value) {
            case 'number':
              valid = this.value >= 0
              break
            case 'object':
              if (Array.isArray(this.value)) valid = this.value.length > 0
              else valid = !!this.value
              break
            default:
              valid = !!this.value
          }
          return valid
        }
        else {
          return true
        }
      },
      additionalBtns () {
        if (this.clearable) {
          return [
            {
              icon: 'cancel',
              content: true,
              handler: () => { this.__change(this.multiple ? [] : '') }
            }
          ]
        }
        else {
          return []
        }
      }
    }
  }
</script>


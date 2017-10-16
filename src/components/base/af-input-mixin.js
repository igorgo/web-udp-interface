'use strict'

import {QInput} from 'quasar-framework'

export default {
  props: {
    label: String,
    value: { required: true },
    icon: String,
    type: String,
    clearable: {
      type: Boolean,
      default: true
    },
    required: Boolean
  },
  components: { QInput },
  methods: {
    __input (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  computed: {
    __icon () {
      return this.icon ? [{
        icon: this.icon,
        handler () {
        }
      }] : []
    },
    __color () {
      if (this.$props.required) {
        return this.$props.value && this.$props.value.trim().length > 0 ? 'primary' : 'secondary'
      }
      else {
        return 'primary'
      }
    }
  }
}

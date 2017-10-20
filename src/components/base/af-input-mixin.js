'use strict'

import {QInput} from 'quasar-framework'

export default {
  props: {
    label: String,
    value: { required: true },
    icon: String,
    type: String,
    min: Number,
    max: Number,
    clearable: {
      type: Boolean,
      default: true
    },
    required: Boolean,
    minRows: Number,
    fixedFont: Boolean
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
    __valid () {
      let b = true
      if (this.max) {
        b = b && ((this.value <= this.max) || (!this.$props.required && this.value === null))
      }
      if (this.min) {
        b = b && ((this.value >= this.min) || (!this.$props.required && this.value === null))
      }
      if (this.$props.required) {
        if ((this.type === 'text') || (this.type === 'textarea')) {
          b = b && !!this.value && this.value.trim().length > 0
        }
        else if (this.type === 'number') {
          b = b && (this.value !== null)
        }
        else {
          b = b && !!this.value
        }
      }
      return b
    },
    __color () {
      return this.__valid ? 'primary' : 'secondary'
    }
  }
}

<template>
  <af-field-set
    caption="Коментар"

  >
    <af-select
      ref="noteHeader"
      label="Тип"
      v-model="value.header"
      :options="headers"
      required
      :disable="headerDisable"
      @change="__change"
    />
    <af-input
      ref="note"
      type="textarea"
      :min-rows="5"
      v-model="value.note"
      fixed-font
      :disable="noteDisable"
      :required="required"
      @change="__change"
    />
  </af-field-set>
</template>

<script>
  import {AfFieldSet, AfInput, AfSelect} from '../../base'
  import {NOTES_HEADER_OPTIONS} from '../../../constants'
  export default {
    name: 'claim-note-field-set',
    props: {
      value: Object,
      headerDisable: {
        type: Boolean,
        default: false
      },
      noteDisable: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        headers: NOTES_HEADER_OPTIONS
      }
    },
    methods: {
      __change () {
        this.$emit('change')
      }
    },
    components: {
      AfFieldSet,
      AfInput,
      AfSelect
    }
  }
</script>


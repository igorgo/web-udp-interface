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
    />
    <af-input
      ref="note"
      type="textarea"
      :min-rows="5"
      v-model="value.note"
      fixed-font
    />
  </af-field-set>
</template>

<script>
  import {AfFieldSet, AfInput, AfSelect} from '../../base'
  import {NOTES_HEADER_OPTIONS} from '../../../constants'
  export default {
    name: 'claim-note-field-set',
    props: {
      value: Object
    },
    data () {
      return {
        headers: NOTES_HEADER_OPTIONS
      }
    },
    components: {
      AfFieldSet,
      AfInput,
      AfSelect
    }
  }
</script>


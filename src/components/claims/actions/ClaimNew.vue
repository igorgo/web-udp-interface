<template>
  <af-modal-form ref="form"
    title="Додавання рекламації"
    :valid="__validate()"
    :okHandle="__onOkClick"
  >
    <div></div>
    <af-field-set caption="Параметри">
      <div class="row">
        <q-option-group
          type="radio"
          v-model="recType"
          :options="recTypes"
          class="col"
        />
        <div class="col row" style="padding-left: 5px">
        <af-input
          type="number"
          min="1"
          max="10"
          label="Пріоритет"
          class="col"
          v-model="recPriority"
        />
        <q-checkbox v-model="recSendToProgr" label="На розгляд" class="col"/>
        </div>
      </div>
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {AfModalForm, AfFieldSet, AfInput} from '../../base'
  import {QOptionGroup, QCheckbox} from 'quasar-framework'
  import {CLAIM_TYPE_OPTIONS} from '../../../constants'
  export default {
    data () {
      return {
        isOpen: false,
        recType: 'ДОРАБОТКА',
        recTypes: CLAIM_TYPE_OPTIONS,
        recPriority: 5,
        recSendToProgr: false
      }
    },
    props: {
    },
    components: {
      AfModalForm,
      AfFieldSet,
      QOptionGroup,
      AfInput,
      QCheckbox
    },
    methods: {
      __validate () {
        return true
      },
      __onOkClick () {
        console.log('__onOkClick')
      },
      open () {
        this.$refs.form.open()
        this.$emit('open')
      },
      close () {
        this.$refs.form.close()
        this.$emit('close')
      }
    }
  }
</script>

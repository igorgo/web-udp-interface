<template>
  <af-modal-form ref="form"
                 title="Додавання рекламації"
                 :valid="__validate()"
                 :okHandle="__onOkClick"
  >
    <div></div>
    <af-field-set caption="Параметри">
      <div class="row">
        <div class="col-xs-6 col-sm-3">
          <q-option-group
            type="radio"
            v-model="recType"
            :options="recTypes"
          />
        </div>
        <div class="col-xs-6 col-sm-9 row items-center xs-gutter">
          <div class="col-sm-8">
            <af-input
              type="number"
              :min="1"
              :max="10"
              label="Пріоритет"
              v-model="recPriority"
              required
            />
          </div>
          <div class="col-sm-4 float-right">
            <q-checkbox
              v-model="recSendToProgr"
              label="На розгляд"
            />
          </div>
        </div>
      </div>
      <div>
        <af-select
          label="Ініціатор"
          v-model="recAuthor"
          :options="initiatorSelect"
        />
      </div>
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {AfModalForm, AfFieldSet, AfInput, AfSelect} from '../../base'
  import {QOptionGroup, QCheckbox} from 'quasar-framework'
  import {CLAIM_TYPE_OPTIONS} from '../../../constants'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        isOpen: false,
        recType: 'ДОРАБОТКА',
        recTypes: CLAIM_TYPE_OPTIONS,
        recPriority: 5,
        recSendToProgr: false,
        recAuthor: -1
      }
    },
    props: {},
    computed: {
      ...mapGetters([
        'initiatorSelect'
      ])
    },
    components: {
      AfModalForm,
      AfFieldSet,
      QOptionGroup,
      AfSelect,
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

<template>
  <af-modal-form ref="form"
                 :title="formTitle"
                 :valid="validate()"
                 :okHandle="onOkClick"
                 :scrollable="formMaxHeight"
                 :maximized="false"
                 :minimized="true"
  >
    <af-field-set caption="Стан">
      <div class="row">
        <af-select
          class="col"
          ref="helpstate"
          v-model="status"
          :options="statuses"
          required
        />
      </div>
    </af-field-set>
    <af-field-set
      caption="Коментар"
      v-show="status===2"
    >
      <div class="row">
        <af-input
          class="col"
          ref="note"
          type="textarea"
          :min-rows="5"
          v-model="note"
          fixed-font
        />
      </div>
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {} from 'quasar-framework'
  import {mapGetters} from 'vuex'
  import {AfModalForm, AfMfMixin, AfFieldSet, AfInput, AfSelect} from '../../base'
  import {FORM_CLAIM_HELP_MODE, HELP_STATUS_OPTIONS, HELP_NEED_OPTIONS} from '../../../constants'
  import {AE_PROGRESS_SET} from '../../../app-events'
  import {sockOk, SE_CLAIMS_HELP_NEED, SE_CLAIMS_HELP_STATUS} from '../../../socket-events'

  export default {
    name: '',
    mixins: [AfMfMixin],
    props: [],
    data () {
      return {
        formTitle: '',
        formMaxHeight: 300, // change this
        status: null,
        statuses: [],
        note: null,
        mode: null
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      AfInput,
      AfSelect
    },
    methods: {
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.helpstate.isValid && this.$refs.note.isValid
      },
      onOkClick () {
        this.$q.events.$emit(AE_PROGRESS_SET)
        if (this.mode === FORM_CLAIM_HELP_MODE.NEED) {
          this.$q.events.$once(sockOk(SE_CLAIMS_HELP_NEED), this.__complete)
          this.$socket.emit(SE_CLAIMS_HELP_NEED, {
            sessionID: this.sessionID,
            id: this.claimRecord.id,
            status: this.status,
            note: this.note
          })
        }
        else {
          this.$q.events.$once(sockOk(SE_CLAIMS_HELP_STATUS), this.__complete)
          this.$socket.emit(SE_CLAIMS_HELP_STATUS, {
            sessionID: this.sessionID,
            id: this.claimRecord.id,
            status: this.status
          })
        }
      },
      open (mode) {
        this.mode = mode
        if (mode === FORM_CLAIM_HELP_MODE.NEED) {
          this.formTitle = 'Зміна необхідності хелпу'
          this.statuses = HELP_NEED_OPTIONS
          this.status = this.claimRecord.helpSign < 20 ? this.claimRecord.helpSign : null
        }
        else {
          this.formTitle = 'Зміна статусу хелпу'
          this.statuses = HELP_STATUS_OPTIONS
          this.status = this.claimRecord.helpSign > 20 ? this.claimRecord.helpSign : null
        }
        this.$refs.form.open()
      },
      __complete () {
        this.$refs.form.close()
      }
    },
    computed: {
      ...mapGetters([
        'sessionID',
        'claimRecord'
      ])
    }
  }
</script>

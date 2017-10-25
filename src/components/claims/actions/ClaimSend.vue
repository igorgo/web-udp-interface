<template>
  <af-modal-form ref="form"
                 :title="formTitle"
                 :valid="validate()"
                 :okHandle="onOkClick"
                 :scrollable="formMaxHeight"
  >
    <af-field-set class="hidden"/>
    <af-field-set caption="Виконавець">
      <div class="row">
        <af-select
          class="col"
          ref="executor"
          v-model="cSend"
          :options="executors"
          required
        />
      </div>
    </af-field-set>
    <claim-note-field-set
      ref="comment"
      v-model="noteObj"
    />
  </af-modal-form>
</template>

<script>
  import {} from 'quasar-framework'
  import {AfModalForm, AfMfMixin, AfFieldSet, AfSelect} from '../../base'
  import ClaimNoteFieldSet from './ClaimNoteFieldSet.vue'
  import {DEFAULT_HEADER} from '../../../constants'
  import {
    AE_CLAIMS_REC_CURREXECS_FOUND,
    AE_CLAIMS_REC_SENT
  } from '../../../app-events'

  export default {
    mixins: [AfMfMixin],
    data () {
      return {
        formTitle: 'Призначення виконавця',
        formMaxHeight: 600,
        cSend: null,
        executors: [],
        noteObj: {
          note: null,
          header: null
        }
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      AfSelect,
      ClaimNoteFieldSet
    },
    methods: {
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return (this.$refs.executor ? this.$refs.executor.isValid : true) &&
          this.$refs.comment.$refs.noteHeader.isValid &&
          this.$refs.comment.$refs.note.isValid
      },
      onOkClick () {
        this.$q.events.$once(AE_CLAIMS_REC_SENT, () => {
          this.$store.dispatch('getClaimRecord', { socket: this.$socket, idx: null })
          this.$refs.form.close()
        })
        void this.$store.dispatch('doClaimSend', {
          socket: this.$socket,
          cSendTo: this.cSend,
          cNoteHeader: this.noteObj.header,
          cNote: this.noteObj.note
        })
      },
      open () {
        // init field values
        this.$refs.form.open()
        this.executors = []
        this.cSend = null
        this.noteObj.note = null
        this.noteObj.header = DEFAULT_HEADER
        this.$q.events.$once(AE_CLAIMS_REC_CURREXECS_FOUND, executors => {
          this.executors = executors
        })
        void this.$store.dispatch('claimGetCurrExecs', { socket: this.$socket })
      }
    }
  }
</script>

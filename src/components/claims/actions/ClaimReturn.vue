<template>
  <af-modal-form ref="form"
                 :title="formTitle"
                 :valid="validate()"
                 :okHandle="onOkClick"
                 :scrollable="formMaxHeight"
  >
    <div class="af-field-set-slot">
      <pre>{{returnMessage}}</pre>
    </div>
    <claim-note-field-set
      ref="comment"
      v-model="note"
    />
  </af-modal-form>
</template>

<script>
  import {AfModalForm, AfMfMixin, AfFieldSet} from '../../base'
  import ClaimNoteFieldSet from './ClaimNoteFieldSet.vue'
  import {DEFAULT_HEADER} from '../../../constants'

  export default {
    mixins: [AfMfMixin],
    data () {
      return {
        formTitle: 'Повернення попереднього статусу',
        formMaxHeight: 600, // change this
        returnMessage: null,
        note: {
          header: null,
          note: null
        }
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      ClaimNoteFieldSet
    },
    methods: {
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.comment.$refs.noteHeader.isValid &&
          this.$refs.comment.$refs.note.isValid
      },
      onOkClick () {
        this.$q.events.$once('app:clame:returned', () => {
          this.$store.dispatch('getClaimRecord', { socket: this.$socket, idx: null })
          this.$refs.form.close()
        })
        void this.$store.dispatch('doClaimReturn', {
          socket: this.$socket,
          cNoteHeader: this.note.header,
          cNote: this.note.note
        })
      },
      open () {
        this.$refs.form.open()
        this.$q.events.$once('app:clame:retmsg:got', (message) => {
          this.returnMessage = message
        })
        void this.$store.dispatch('claimGetReturnMessage', { socket: this.$socket })
        this.returnMessage = ''
        this.note = {
          note: null,
          header: DEFAULT_HEADER
        }
      }
    }
  }
</script>

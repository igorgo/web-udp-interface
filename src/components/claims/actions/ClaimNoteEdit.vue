<template>
  <af-modal-form ref="form"
                 :title="formTitle"
                 :valid="formValid"
                 :okHandle="onOkClick"
                 :scrollable="formMaxHeight"
  >
    <claim-note-field-set
      ref="comment"
      :header-disable="headerDisable"
      v-model="noteObj"
      required
      @change="__noteChange"
    />
  </af-modal-form>
</template>

<script>
  import {} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {AfModalForm, AfMfMixin} from '../../base'
  import ClaimNoteFieldSet from './ClaimNoteFieldSet.vue'
  import {FORM_EDIT_MODES, DEFAULT_HEADER} from '../../../constants'
  import {
    AE_PROGRESS_SET,
    AE_PROGRESS_RESET
  } from '../../../app-events'
  import {
    sockOk,
    SE_CLAIMS_NOTE_FIND_ONE,
    SE_CLAIMS_NOTE_UPDATE,
    SE_CLAIMS_NOTE_INSERT
  } from '../../../socket-events'

  export default {
    name: '',
    mixins: [AfMfMixin],
    props: {},
    data () {
      return {
        formMaxHeight: 600, // change this
        mode: FORM_EDIT_MODES.NEW,
        noteObj: {
          note: null,
          header: null
        },
        id: null,
        noteVal: null,
        formValid: false
      }
    },
    components: {
      AfModalForm,
      ClaimNoteFieldSet
    },
    methods: {
      ...mapActions([]),
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.comment.$refs.noteHeader.isValid &&
          this.$refs.comment.$refs.note.isValid
      },
      __noteChange () {
        this.$nextTick(function () {
          this.formValid = this.validate()
        })
      },
      onOkClick () {
        if (this.mode === FORM_EDIT_MODES.NEW) {
          this.$q.events.$emit(AE_PROGRESS_SET)
          this.$q.events.$once(sockOk(SE_CLAIMS_NOTE_INSERT), this.__complete)
          this.$socket.emit(SE_CLAIMS_NOTE_INSERT, {
            sessionID: this.sessionID,
            cId: this.claimRecord.id,
            cNoteHeader: this.noteObj.header,
            cNote: this.noteObj.note
          })
        }
        else if (this.mode === FORM_EDIT_MODES.EDIT) {
          this.$q.events.$emit(AE_PROGRESS_SET)
          this.$q.events.$once(sockOk(SE_CLAIMS_NOTE_UPDATE), this.__complete)
          this.$socket.emit(SE_CLAIMS_NOTE_UPDATE, {
            sessionID: this.sessionID,
            id: this.id,
            note: this.noteObj.note
          })
        }
        else {
          this.$refs.form.close()
        }
      },
      __complete () {
        this.$store.dispatch('getClaimRecord', {socket: this.$socket, idx: null})
        this.$refs.form.close()
      },
      open ({mode = FORM_EDIT_MODES.NEW, id = null}) {
        // init field values
        this.$refs.form.open()
        this.mode = mode
        this.id = id
        if (mode === FORM_EDIT_MODES.NEW) {
          this.noteObj.note = null
          this.noteObj.header = DEFAULT_HEADER
        }
        else {
          this.$q.events.$emit(AE_PROGRESS_SET)
          this.$q.events.$once(
            sockOk(SE_CLAIMS_NOTE_FIND_ONE),
            ({header, note}) => {
              this.$q.events.$emit(AE_PROGRESS_RESET)
              this.noteObj.note = note
              this.noteObj.header = header
              this.__noteChange()
            }
          )
          this.$socket.emit(SE_CLAIMS_NOTE_FIND_ONE, {sessionID: this.sessionID, id})
        }
      }
    },
    computed: {
      ...mapState({
        // name: state => state.module.name
      }),
      ...mapGetters([
        'sessionID',
        'claimRecord'
      ]),
      headerDisable () {
        return this.mode === FORM_EDIT_MODES.EDIT
      },
      formTitle () {
        switch (this.mode) {
          case FORM_EDIT_MODES.NEW:
            return 'Додавання коментаря'
          case FORM_EDIT_MODES.EDIT:
            return 'Виправлення коментаря'
          default:
            return 'Коментар'
        }
      }
    }
  }
</script>

<style lang="stylus">
</style>

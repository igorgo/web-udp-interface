<template>
  <af-modal-form ref="form"
                 title="Додавання файлів"
                 :valid="validate()"
                 :okHandle="doAttach"
                 ok-caption="Додати"
  >
    <af-field-set caption="Файли">
      <af-uploader
        ref="uploader"
        @updated="onUploaderChange"
      />
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {AfFieldSet, AfUploader, AfModalForm, AfMfMixin} from '../../base'

  export default {
    name: 'claim-attach',
    mixins: [AfMfMixin],
    data () {
      return {
        files: []
      }
    },
    components: {
      AfFieldSet,
      AfUploader,
      AfModalForm
    },
    methods: {
      ...mapActions([
        'getClaimRecord'
      ]),
      validate () {
        return this.files.length > 0
      },
      onUploaderChange (files) {
        this.files = files
      },
      __reset () {
        this.files = []
        this.$refs.uploader.reset()
      },
      open () {
        this.__reset()
        this.$refs.form && this.$refs.form.open()
      },
      doAttach () {
        const sessionID = this.sessionID
        const id = this.recId
        this.$q.events.$emit('progress:set')
        this.$q.events.$on('claims:file:attached', this.__onFileAttached)
        this.files.forEach(file => {
          let reader = new FileReader()
          if (reader._realReader) reader = reader._realReader // Support Android Crosswalk
          reader.onload = (e) => {
            this.$socket.emit('act_claim_attach_file', {
              sessionID,
              id,
              filename: file.name,
              content: e.target.result
            })
          }
          reader.readAsArrayBuffer(file)
        })
      },
      __onFileAttached ({ id, filename }) {
        if (id === this.recId) {
          this.$refs.uploader.remove(filename)
          this.$nextTick(() => {
            if (this.files.length === 0) {
              this.$q.events.$emit('progress:reset')
              this.$q.events.$off('claims:file:attached', this.__onFileAttached)
              this.getClaimRecord({ socket: this.$socket, idx: null })
              this.$refs.form.close()
            }
          })
        }
      }
    },
    computed: {
      ...mapState({
        recId: state => state.claims.claimRecord.id
      }),
      ...mapGetters([
        'sessionID'
      ])
    }
  }
</script>

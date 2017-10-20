<template>
  <af-modal-form ref="form"
                 title="Додавання файлів"
                 :valid="__validate()"
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
  <!--q-modal maximized v-model="isOpen">
    <div class="row justify-center relative-position">
      <af-form title="Додавання файлів" style="width: 800px;">
        <af-field-set caption="Файли">
          <af-uploader ref="uploader"></af-uploader>
        </af-field-set>
        <q-btn
          flat
          :disabled="!hasExpandedContent"
          color="primary"
          @click="doAttach"
          slot="bottom-buttons"
        >Додати
        </q-btn>
        <q-btn
          flat
          color="negative"
          @click="close"
          slot="bottom-buttons"
        >Скасування
        </q-btn>
      </af-form>
      <af-load-cover :progress="uploading"/>
    </div>
  </q-modal-->
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {mapEvent} from '../../../routines'
  import {AfFieldSet, AfUploader, AfModalForm} from '../../base'

  export default {
    name: 'claim-attach',
    props: {
    },
    data () {
      return {
        files: [],
        eventMapper: {
          'claims:file:attached': this.__onFileAttached
        }
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
      __validate () {
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
        // this.$refs.modalcontent.open()
      },
      doAttach () {
        const sessionID = this.sessionID
        const id = this.recId
        this.$q.events.$emit('progress:set')
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
        // this.close()
      },
      __onFileAttached ({ id, filename }) {
        if (id === this.recId) {
          this.$refs.uploader.remove(filename)
          this.$nextTick(() => {
            if (this.files.length === 0) {
              this.$q.events.$emit('progress:reset')
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
    },
    created () {
      mapEvent(this, true)
    },
    beforeDestroy () {
      mapEvent(this, false)
    }
  }
</script>

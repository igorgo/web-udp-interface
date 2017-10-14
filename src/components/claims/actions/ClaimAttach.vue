<template>
  <q-modal maximized v-model="isOpen">
    <div class="row justify-center relative-position">
      <af-form title="Додавання файлів" style="width: 800px;">
        <q-input-frame
          ref="input"
          class="q-if-inverted q-if-dark bg-primary text-white"
          :color="color"
          additional-length
        >
          <div
            class="col row items-center q-input-target"
            v-html="label"
          />
          <q-icon
            slot="after"
            name="add"
            class="q-uploader-pick-button q-if-control relative-position overflow-hidden"
            @click="__pick"
          >
            <input
              type="file"
              ref="file"
              class="q-uploader-input absolute-full cursor-pointer"
              v-bind.prop="{multiple: true}"
              @change="__add"
            >
          </q-icon>
          <q-icon
            v-if="hasExpandedContent"
            slot="after"
            name="keyboard_arrow_down"
            class="q-if-control generic_transition"
            :class="{'rotate-180': expanded}"
            @click="expanded = !expanded"
          />
        </q-input-frame>
        <q-slide-transition>
          <div v-show="expanded">
            <div class="q-uploader-files scroll">
              <q-item
                v-for="file in files"
                :key="file.name"
                class="q-uploader-file"
              >
                <q-item-side v-if="file.__img" :image="file.__img.src"></q-item-side>
                <q-item-side v-else icon="insert_drive_file" :color="color"></q-item-side>
                <q-item-main :label="file.name" :sublabel="file.__size"></q-item-main>
                <q-item-side right>
                  <q-item-tile
                    icon="clear"
                    :color="color"
                    class="cursor-pointer"
                    @click="__remove(file)"
                  ></q-item-tile>
                </q-item-side>
              </q-item>
            </div>
          </div>
        </q-slide-transition>
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
  </q-modal>
</template>

<script>
  import {
    QModal,
    QBtn,
    QUploader,
    QInputFrame,
    QIcon,
    QSlideTransition,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile
  } from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {hrFileSize, mapEvent} from '../../../routines'
  import {AfForm, AfLoadCover} from '../../base'
  //  import AfForm from '../../base/AfForm.vue'

  export default {
    name: 'claim-attach',
    props: {
      color:
        {
          type: String,
          default: 'primary'
        }
    },
    data () {
      return {
        queue: [],
        files: [],
        totalSize: 0,
        expanded: false,
        isOpen: false,
        uploading: false,
        eventMapper: {
          'claims:file:attached': this.__onFileAttached
        }
      }
    },
    components: {
      QModal,
      QBtn,
      QUploader,
      QInputFrame,
      QIcon,
      QSlideTransition,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      AfForm,
      AfLoadCover
    },
    methods: {
      ...mapActions([
        'getClaimRecord'
      ]),
      open () {
        this.queue = []
        this.files = []
        this.totalSize = 0
        this.expanded = false
        this.isOpen = true
        this.uploading = false
        // this.$refs.modalcontent.open()
      },
      close () {
        this.isOpen = false
        // this.$refs.modalcontent.close()
      },
      __pick () {
        if (this.$q.platform.is.mozilla) {
          this.$refs.file.click()
        }
      },
      __add (e, files) {
        files = Array.prototype.slice.call(files || e.target.files)
        this.$refs.file.value = ''
        files = files.filter(file => !this.queue.some(f => file.name === f.name))
          .map(file => {
            file.__size = hrFileSize(file.size)
            if (!file.type.startsWith('image')) {
              this.queue.push(file)
            }
            else {
              const reader = new FileReader()
              reader.onload = (e) => {
                let img = new Image()
                img.src = e.target.result
                file.__img = img
                this.queue.push(file)
                this.__computeTotalSize()
              }
              reader.readAsDataURL(file)
            }
            return file
          })
        if (files.length > 0) {
          this.files = this.files.concat(files)
          this.__computeTotalSize()
        }
      },
      __computeTotalSize () {
        this.totalSize = this.queueLength
          ? this.queue.map(f => f.size).reduce((total, size) => total + size)
          : 0
      },
      __remove (file) {
        const name = file.name
        this.queue = this.queue.filter(obj => obj.name !== name)
        file.__removed = true
        this.files = this.files.filter(obj => obj.name !== name)
        this.__computeTotalSize()
      },
      doAttach () {
        this.uploading = true
        const sessionID = this.sessionID
        const id = this.recId
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
        console.log('attach')
        // this.close()
      },
      __onFileAttached ({id, filename}) {
        if (id === this.recId) {
          this.files = this.files.filter(obj => obj.name !== filename)
          if (this.files.length === 0) {
            this.getClaimRecord({socket: this.$socket, idx: null})
            this.uploading = false
            this.close()
          }
        }
      }
    },
    watch: {
      hasExpandedContent (v) {
        this.expanded = v
      }
    },
    computed: {
      ...mapState({
        recId: state => state.claims.claimRecord.id
      }),
      ...mapGetters([
        'sessionID'
      ]),
      label () {
        return `файлів: ${this.queueLength} (${hrFileSize(this.totalSize)})`
      },
      queueLength () {
        return this.queue.length
      },
      hasExpandedContent () {
        return this.files.length > 0
      }
    },
    created () {
      mapEvent(this, true)
    },
    beforeDestroy () {
      mapEvent(this, false)
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

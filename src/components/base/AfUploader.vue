<template>
  <div>
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
                @click="remove(file)"
              ></q-item-tile>
            </q-item-side>
          </q-item>
        </div>
      </div>
    </q-slide-transition>
  </div>

</template>

<script>
  import {
    QInputFrame,
    QIcon,
    QSlideTransition,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile
  } from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {hrFileSize} from '../../routines'

  export default {
    name: '',
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
        expanded: false
      }
    },
    components: {
      QInputFrame,
      QIcon,
      QSlideTransition,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile
    },
    methods: {
      ...mapActions([]),
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
        this.$emit('updated', this.files)
      },
      __computeTotalSize () {
        this.totalSize = this.queueLength
          ? this.queue.map(f => f.size).reduce((total, size) => total + size)
          : 0
      },
      reset () {
        this.queue = []
        this.files = []
        this.totalSize = 0
        this.expanded = false
        this.$emit('updated', this.files)
      },
      __remove (file) {
        file.__removed = true
        this.remove(file.name)
      },
      remove (filename) {
        this.queue = this.queue.filter(obj => obj.name !== filename)
        this.files = this.files.filter(obj => obj.name !== filename)
        this.__computeTotalSize()
        this.$emit('updated', this.files)
      }
    },
    computed: {
      ...mapState([]),
      ...mapGetters([]),
      queueLength () {
        return this.queue.length
      },
      hasExpandedContent () {
        return this.files.length > 0
      },
      getFiles () {
        return this.files
      },
      label () {
        return `файлів: ${this.queueLength} (${hrFileSize(this.totalSize)})`
      }
    },
    watch: {
      hasExpandedContent (v) {
        this.expanded = v
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

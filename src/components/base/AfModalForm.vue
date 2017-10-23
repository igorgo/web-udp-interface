<template>
  <q-modal maximized v-model="isOpen">
    <div class="row justify-center relative-position">
      <af-form
        :title="title"
        :style="'width: ' + formWidth + 'px;'"
        :scrollable="scrollable"
      >
        <slot></slot>
        <q-btn
          flat
          :disable="!valid"
          color="primary"
          @click="okHandle"
          slot="bottom-buttons"
        >{{okCaption.toUpperCase()}}
        </q-btn>
        <q-btn
          flat
          color="negative"
          @click="close()"
          slot="bottom-buttons"
        >СКАСУВАННЯ
        </q-btn>
      </af-form>
      <af-load-cover :progress="isActionInProgress"/>
    </div>
  </q-modal>
</template>

<script>
  import {QModal, QBtn} from 'quasar-framework'
  import AfForm from './AfForm.vue'
  import AfLoadCover from './AfLoadCover.vue'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        isOpen: false
      }
    },
    components: {QModal, AfForm, QBtn, AfLoadCover},
    computed: {
      ...mapGetters([
        'isActionInProgress'
      ])
    },
    methods: {
      open () {
        this.isOpen = true
        this.$emit('open')
      },
      close () {
        this.isOpen = false
        this.$emit('close')
      }
    },
    props: {
      formWidth: {
        type: Number,
        default: 800
      },
      title: {
        type: String,
        required: true
      },
      valid: {
        type: Boolean,
        default: true
      },
      okHandle: Function,
      okCaption: {
        type: String,
        default: 'OK'
      },
      scrollable: Number
    }
  }
</script>

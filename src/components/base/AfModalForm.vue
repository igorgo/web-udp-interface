<template>
  <q-modal maximized v-model="isOpen">
    <div class="row justify-center relative-position">
      <af-form :title="title" :style="'width: ' + formWidth + 'px;'">
        <slot></slot>
        <q-btn
          flat
          :disable="!valid"
          color="primary"
          @click="okHandle"
          slot="bottom-buttons"
        >{{okCaption}}
        </q-btn>
        <q-btn
          flat
          color="negative"
          @click="close()"
          slot="bottom-buttons"
        >Скасування
        </q-btn>
      </af-form>
    </div>
  </q-modal>
</template>

<script>
  import {QModal, QBtn} from 'quasar-framework'
  import AfForm from './AfForm.vue'

  export default {
    data () {
      return {
        isOpen: false
      }
    },
    components: {QModal, AfForm, QBtn},
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
      }
    }
  }
</script>

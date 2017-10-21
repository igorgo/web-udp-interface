<template>
  <q-card class="af-base-form">
    <q-card-title
      class="afinasql-bg"
    >
      {{title}}
      <div slot="subtitle" v-if="subtitle" :class="subtitleClass || 'text-white'">
        <div>
          <span>{{subtitle}}</span><span><slot name="after-subtitle"/></span>
        </div>
        <div>
          <slot name="under-subtitle"/>
        </div>
      </div>
      <div slot="right" class="afinasql-bg">
        <slot name="titleActions"></slot>
      </div>
    </q-card-title>
    <q-card-main ref="form-body">
      <template v-if="needScroll">
        <q-scroll-area :class="scrollClass">
          <slot></slot>
        </q-scroll-area>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </q-card-main>
    <q-card-actions class="justify-end">
      <slot name="bottom-buttons"></slot>
    </q-card-actions>
  </q-card>
</template>

<script>
  import {QCard, QCardTitle, QCardMain, QCardActions, QScrollArea} from 'quasar-framework'

  export default {
    name: 'af-form',
    components: { QCard, QCardTitle, QCardMain, QCardActions, QScrollArea },
    data () {
      return {
        needScroll: false
      }
    },
    computed: {
      scrollClass () {
        return this.onLayout ? 'af-form-body-lo' : 'af-form-body-mod'
      }
    },
    methods: {
    },
    props: {
      title: String,
      color: String,
      darktext: Boolean,
      subtitle: String,
      subtitleClass: String,
      scrollable: {
        type: Number,
        default: 600
      },
      onLayout: {
        type: Boolean,
        default: false
      }
    },
    created () {
      this.needScroll = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) < this.scrollable
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

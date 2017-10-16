<template>
  <q-card class="af-base-form">
    <q-card-title
      class="afinasql-bg"
    >
      {{title}}
      <div slot="subtitle" v-if="subtitle" :class="subtitleClass" class="afinasql-bg">
        <div>
          <span>{{subtitle}}</span><span><slot name="after-subtitle" /></span>
        </div>
        <div>
          <slot name="under-subtitle" />
        </div>
      </div>
    <div slot="right" class="afinasql-bg">
      <slot name="titleActions"></slot>
    </div>
    </q-card-title>
    <q-card-main ref="form-body">
      <template v-if="scrollable">
        <q-scroll-area class="af-form-body">
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
  import { QCard, QCardTitle, QCardMain, QCardActions, QScrollArea } from 'quasar-framework'
  export default {
    name: 'af-form',
    components: { QCard, QCardTitle, QCardMain, QCardActions, QScrollArea },
    computed: {
    },
    methods: {
    },
    props: {
      title: String,
      color: String,
      darktext: Boolean,
      subtitle: String,
      subtitleClass: String,
      scrollable: Boolean
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
</style>

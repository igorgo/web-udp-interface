<template>
  <q-card>
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
    <div slot="right" class="afinasql-bg" v-show="hasTitleActions">
      <q-btn
        v-for="iAction in titleActions"
        small
        round
        flat
        :key="iAction.action"
        :icon="iAction.icon"
        @click="iAction.handler()"
        class="float-right"
      />
    </div>
    </q-card-title>
    <q-card-main ref="form-body" :class="clsSlot">
      <slot></slot>
    </q-card-main>
    <q-card-actions v-show="hasBottomActions" class="justify-end">
      <q-btn
        v-for="iAction in bottomActions"
        flat
        :color="iAction.color"
        :key="iAction.action"
        @click="iAction.handler()"
      >{{iAction.caption}}</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
  import { QCard, QCardTitle, QIcon, QCardMain, QCardActions, QBtn } from 'quasar'
  export default {
    name: 'af-form',
    components: { QCard, QCardTitle, QIcon, QCardMain, QCardActions, QBtn },
    computed: {
      clsTitle () {
        let cls = []
        if (this.color) {
          cls.push('bg-' + this.color)
          if (!this.darktext) cls.push('text-white')
        }
        if (this.darktext) cls.push('text-black')
        return cls.join(' ')
      },
      clsSlot () {
        /* let cls = []
        if (this.color) {
          cls.push('text-' + this.color)
        }
        return cls.join(' ') */
      },
      hasTitleActions () {
        return this.titleActions && (this.titleActions.length > 0)
      },
      hasBottomActions () {
        return this.bottomActions && (this.bottomActions.length > 0)
      }
    },
    props: {
      title: String,
      color: String,
      darktext: Boolean,
      titleActions: Array,
      bottomActions: Array,
      subtitle: String,
      subtitleClass: String
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="stylus">

</style>

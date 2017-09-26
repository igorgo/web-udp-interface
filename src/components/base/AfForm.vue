<template>
  <q-card>
    <q-card-title
      :class="clsTitle"
    >
      {{title}}
    <div slot="right" v-show="hasTitleActions">
      <q-icon
        v-for="iAction in titleActions"
        :key="iAction.action"
        :name="iAction.icon"
        @click="iAction.handler()"
        class="cursor-pointer on-right"
        :class="clsTitle"
      />
    </div>
    </q-card-title>
    <q-card-main :class="clsSlot">
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
        let cls = []
        if (this.color) {
          cls.push('text-' + this.color)
        }
        return cls.join(' ')
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
      titleActions: {
        type: Array
      },
      bottomActions: {
        type: Array
      }
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="stylus">

</style>

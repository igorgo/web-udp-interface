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
        v-for="item in titleActions"
        small
        round
        flat
        :key="item.action"
        :icon="item.icon"
        @click="item.handler()"
        class="float-right"
      />
    </div>
    </q-card-title>
    <q-card-main ref="form-body">
      <slot></slot>
    </q-card-main>
    <q-card-actions v-show="hasBottomActions" class="justify-end">
      <q-btn
        v-for="item in bottomActions"
        flat
        :color="item.color"
        :key="item.action"
        @click="item.handler()"
      >{{item.caption}}</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
  import { QCard, QCardTitle, QIcon, QCardMain, QCardActions, QBtn } from 'quasar-framework'
  export default {
    name: 'af-form',
    components: { QCard, QCardTitle, QIcon, QCardMain, QCardActions, QBtn },
    computed: {
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
    }
  }
</script>

<style lang="stylus">

</style>

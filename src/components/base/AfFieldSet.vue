<template>
  <q-collapsible class="af-field-set" opened icon-toggle :label="caption">
    <div class="af-field-set-slot">
      <slot></slot>
    </div>
  </q-collapsible>
</template>

<script>
  import { QList, QListHeader, QCollapsible } from 'quasar-framework'

  export default {
    name: 'af-field-set',
    components: { QList, QListHeader, QCollapsible },
    props: {
      caption: String
    }
  }
</script>

<style lang="stylus">
  @import '~variables'

</style>

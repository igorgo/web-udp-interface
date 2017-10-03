<template>
  <q-side-link item :to="routeTo" exact v-if="routeTo">
    <q-item-side :icon="icon"/>
    <q-item-main :label="label"></q-item-main>
  </q-side-link>
  <q-item v-else @click="click">
    <q-item-side :icon="icon"/>
    <q-item-main :label="label"></q-item-main>
  </q-item>
</template>

<script>
  import {QSideLink, QItemSide, QItemMain, QItem} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    name: '',
    props: [
      'route-to',
      'icon',
      'label'
    ],
    data () {
      return {}
    },
    components: {QSideLink, QItemSide, QItemMain, QItem},
    methods: {
      ...mapActions([]),
      click () {
        this.$emit('click')
      }
    },
    computed: {
      ...mapState([]),
      ...mapGetters([])
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

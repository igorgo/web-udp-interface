<template>
    <div v-if="files.length">
      <hr/>
      <div v-for="item in files" class="vertical-middle">
        <q-btn icon="file download" small flat round @click="download(item.id)"/>
        <span>{{item.path}} ({{fileSize(item.sizeBite)}})</span>
        <q-btn v-if="item.own" icon="delete" small flat round @click="deleteDoc(item.id);"/>
      </div>
      <hr/>
    </div>
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import { hrFileSize } from '../../../routines'

  export default {
    name: '',
    props: [],
    data () {
      return {}
    },
    components: { QBtn },
    methods: {
      ...mapActions([]),
      download (id) {
        void this.$store.dispatch('downloadLinkedFile', { socket: this.$socket, id })
      },
      fileSize (size) {
        return hrFileSize(size)
      },
      deleteDoc (id) {
        console.log(id)
      }
    },
    computed: {
      ...mapState({
        files: state => state.claims.claimFiles
      }),
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

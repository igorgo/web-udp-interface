<template>
    <div>
      <div v-for="item in files">
        <q-btn icon="file download" small flat round @click="download(item.id)"/>
        <span>{{item.path}} ({{fileSize(item.sizeBite)}})</span>
      </div>
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
        this.$socket.emit('get_linked_file', { sessionID: this.$store.getters.sessionID, id })
      },
      fileSize (size) {
        return hrFileSize(size)
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

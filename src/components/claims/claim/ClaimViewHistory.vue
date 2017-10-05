<template>
    <div>
      <div v-for="item in history">{{item.who}} ...</div>
    </div>
</template>

<script>
  import {} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    name: '',
    props: [],
    data () {
      return {}
    },
    components: {},
    methods: {
      ...mapActions([])
    },
    computed: {
      ...mapState({
        history: state => state.claims.claimHistory
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

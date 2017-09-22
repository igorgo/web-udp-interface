<template>
  <div>
    <q-pagination
      v-model="claimListPage"
      :max="claimListPages"
      @change="goto"
    />
  </div>
</template>

<script>
  import {QPagination} from 'quasar'
  import * as mts from '../../store/mutation-types'

  export default {
    name: 'claims-paginator',
    data () {
      return {}
    },
    components: {
      QPagination
    },
    computed: {
      claimListPages () {
        return this.$store.getters.claimListPages
      },
      claimListPage () {
        return this.$store.getters.claimListPage
      }
    },
    methods: {
      goto (value) {
        this.$store.commit(mts.CLAIMS_PAGE_CHANGE, {value: value, socket: this.$socket})
      }
    }
  }
</script>

<style>
</style>

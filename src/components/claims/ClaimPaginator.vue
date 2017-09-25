<template>
  <div>
    <q-pagination
      v-model="currentClaimPage"
      :max="claimListPages"
      @change="goToPage"
    />
  </div>
</template>

<script>
  import { QPagination } from 'quasar'
  import { CLAIMS_PAGE_CHANGE } from '../../store/mutation-types'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'claims-paginator',
    components: {
      QPagination
    },
    computed: {
      ...mapState({
        currentClaimPage: state => state.claims.currentClaimPage
      }),
      ...mapGetters([
        'claimListPages'
      ])
    },
    methods: {
      goToPage (value) {
        this.$store.commit(CLAIMS_PAGE_CHANGE, {value: value, socket: this.$socket})
      }
    }
  }
</script>

<style>
</style>

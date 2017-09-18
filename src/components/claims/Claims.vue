<template>
  <div>
    <claim-header slot="header"/>
    <q-scroll-area style="height: auto" class="row">
      <claim-row v-for="iClaim in claimList" :key="iClaim['id']" :claimRec="iClaim"/>
    </q-scroll-area>
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import {QScrollArea} from 'quasar'
  export default {
    data () {
      return {}
    },
    components: {
      ClaimHeader,
      QScrollArea,
      ClaimRow
    },
    computed: {
      currentCondition () {
        return this.$store.getters.currentCondition
      },
      claimsCount () {
        return this.$store.getters.claimsCount
      },
      claimListPage () {
        return this.$store.getters.claimListPage
      },
      claimListLimit () {
        return this.$store.getters.claimListLimit
      },
      claimList () {
        return this.$store.getters.claimList
      }
    },
    mounted: function () {
      this.$socket.emit('get_claim_list', {
        conditionId: this.currentCondition,
        sortOrder: null,
        page: this.claimListPage,
        limit: this.claimListLimit,
        newClaimId: null
      })
    }
  }
</script>

<style>
</style>

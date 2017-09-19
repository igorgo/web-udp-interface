<template>
  <div>
    <claim-header class="claimheader"/>
    <q-scroll-area class="claimbody">
      <q-list>
        <claim-row v-for="iClaim in claimList" :key="iClaim['id']" :claimRec="iClaim"/>
      </q-list>
    </q-scroll-area>
    <div class="claimfooter text-center">Пагінатор</div>
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import {QScrollArea, QList} from 'quasar'

  export default {
    data () {
      return {}
    },
    components: {
      ClaimHeader,
      QScrollArea,
      ClaimRow,
      QList
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
        // todo: sortorder
        sortOrder: null,
        page: this.claimListPage,
        limit: this.claimListLimit,
        newClaimId: null
      })
    }
  }
</script>

<style>
  .claimheader {
    height: 70px;
    width: 100%;
    top: 0;
    left: 0;
    position: relative;
  }

  .claimbody {
    height: calc(100vh - 170px);
  }

  .claimfooter {
    height: 50px;
    width: 100%;
    bottom: 0;
    left: 0;
    position: relative;
  }
</style>

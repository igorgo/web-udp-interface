<template>
  <div class="cl-content">
    <q-scroll-area class="claimbody">
    <claim-header/>
      <q-list no-border>
        <claim-row v-for="iClaim in claimList" :key="iClaim['id']" :claimRec="iClaim"/>
      </q-list>
      <q-fixed-position corner="bottom-right" :offset="[18, 18]" class="z-absolute">
        <q-btn
          color="deep-orange-12"
          round
          v-back-to-top.animate="{offset: 500, duration: 200}"
          class="animate-pop"
        >
          <q-icon name="keyboard_arrow_up" />
        </q-btn>
      </q-fixed-position>
    </q-scroll-area>
    <div class="claimfooter text-center">Пагінатор</div>
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import {QScrollArea, QList, QFixedPosition, QBtn, QIcon, BackToTop} from 'quasar'

  export default {
    data () {
      return {}
    },
    components: {
      ClaimHeader,
      QScrollArea,
      ClaimRow,
      QList,
      QFixedPosition,
      QBtn,
      QIcon
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
    },
    directives: {
      BackToTop
    }

  }
</script>

<style>
  .claimbody {
    height: calc(100vh - 110px);
  }
  .claimfooter {
    height: 50px;
    width: 100%;
    bottom: 0;
    left: 0;
    position: relative;
  }
  .cl-content {
    padding: 10px 10px 0 10px;
  }
</style>

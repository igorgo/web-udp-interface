<template>
  <div class="cl-content">
    <q-scroll-area ref="scroll" class="claimbody">
      <claim-header/>
      <q-list no-border>
        <claim-row v-for="iClaim in claimList" :key="iClaim['id']" :claimRec="iClaim"/>
      </q-list>
      <q-fixed-position corner="bottom-right" :offset="[12, 68]" class="z-absolute">
        <q-btn
          color="deep-orange-12"
          round
          class="animate-pop"
          v-back-to-top.animate="{offset: 500, duration: 200}"
        >
          <q-icon name="keyboard_arrow_up" />
        </q-btn>
      </q-fixed-position>
    </q-scroll-area>
    <claim-paginator class="claimfooter text-center"></claim-paginator>
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import ClaimPaginator from './ClaimPaginator.vue'
  import {QScrollArea, QList, QFixedPosition, QBtn, QIcon, BackToTop} from 'quasar'
  import {claimsRequest} from '../../routines'

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
      QIcon,
      ClaimPaginator
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
      claimsRequest(
        this.$socket,
        this.$store.getters.currentCondition,
        this.$store.getters.claimSort,
        this.$store.getters.claimSortDesc,
        this.$store.getters.claimListPage,
        this.$store.getters.claimListLimit,
        null
      )
    },
    methods: {
      newPortionHandler () {
        this.$refs.scroll.setScrollPosition(0)
      }
    },
    created () {
      this.$q.events.$on('new-portion', this.newPortionHandler)
    },
    beforeDestroy () {
      this.$q.events.$off('new-portion', this.newPortionHandler)
    },
    directives: {
      BackToTop
    }

  }
</script>

<style>
  .claimbody {
    height: calc(100vh - 116px);
  }

  .claimfooter {
    height: 56px;
    width: 100%;
    bottom: 0;
    left: 0;
    position: relative;
  }

  .cl-content {
    padding: 10px 10px 0 10px;
  }
</style>

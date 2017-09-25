<template>
  <div class="cl-content">
    <q-scroll-area ref="scroll" class="claimbody">
      <claim-header/>
      <q-list no-border highlight>
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
    <q-fixed-position corner="bottom-right" :offset="[12, 8]">
      <q-btn round color="primary" @click="addClaim">
        <q-icon name="add" />
      </q-btn>
    </q-fixed-position>
    <!--q-inner-loading :visible="!claimsLoaded">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading-->
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import ClaimPaginator from './ClaimPaginator.vue'
  import { QScrollArea, QList, QFixedPosition, QBtn, QIcon, BackToTop } from 'quasar'
  import { claimsRequest } from '../../routines'
  import { mapGetters, mapState } from 'vuex'

  export default {
    components: { ClaimHeader, QScrollArea, ClaimRow, QList, QFixedPosition, QBtn, QIcon, ClaimPaginator },
    computed: {
      releasesLoaded$$$ () {
        return this.$store.getters.releasesLoaded
      },
      ...mapState({
        currentCondition: state => state.claims.currentCondition,
        currentClaimLimit: state => state.claims.currentClaimLimit,
        claimList: state => state.claims.claimList
      }),
      ...mapGetters([
      ])
    },
    mounted: function () {
      claimsRequest(
        this.$socket,
        this.$store.state.claims.currentCondition,
        this.$store.state.claims.currentClaimSort,
        this.$store.getters.claimSortDesc,
        this.$store.state.claims.currentClaimPage,
        this.$store.state.claims.currentClaimLimit,
        null
      )
    },
    methods: {
      newPortionHandler () {
        this.$refs.scroll.setScrollPosition(0)
      },
      addClaim () {
        // todo: open form for add new claim
        alert('todo: open form for add new claim')
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

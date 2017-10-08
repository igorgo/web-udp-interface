<!--suppress ALL -->
<template>
  <div class="content">
    <q-scroll-area ref="scroll" class="claim-body">
      <claim-header/>
      <q-list ref="list" no-border>
        <claim-row v-for="(item, index) in claimList" :key="item['id']" :claimRec="item" :claimIdx="index"/>
      </q-list>
      <q-fixed-position corner="bottom-right" :offset="[12, 68]" class="z-absolute">
        <q-btn
          color="deep-orange-12"
          round
          class="animate-pop"
          v-back-to-top.animate="{offset: 100, duration: 200}"
        >
          <q-icon name="keyboard_arrow_up" />
        </q-btn>
      </q-fixed-position>
    </q-scroll-area>
    <claim-paginator class="claim-footer text-center"></claim-paginator>
    <q-fixed-position corner="bottom-right" :offset="[12, 8]">
      <q-btn round color="primary" @click="addClaim">
        <q-icon name="add" />
      </q-btn>
    </q-fixed-position>
    <af-load-cover :progress="progress"/>
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import ClaimPaginator from './ClaimPaginator.vue'
  import { QScrollArea, QList, QFixedPosition, QBtn, QIcon, BackToTop } from 'quasar-framework'
  import { AfLoadCover } from '../base'
  import { mapGetters, mapState } from 'vuex'
  import {mapEvent} from '../../routines'

  export default {
    components: { ClaimHeader, QScrollArea, ClaimRow, QList, QFixedPosition, QBtn, QIcon, ClaimPaginator, AfLoadCover },
    computed: {
      ...mapState({
        currentCondition: state => state.claims.currentCondition,
        currentClaimLimit: state => state.claims.currentClaimLimit,
        claimList: state => state.claims.claimList,
        progress: state => state.claims.getClaimsInProgress,
        claimRecordIndexActive: state => state.claims.claimRecordIndexActive
      }),
      ...mapGetters([
      ])
    },
    mounted: function () {
      void this.$store.dispatch('sendClaimsRequest', {socket: this.$socket})
    },
    methods: {
      newPortionHandler () {
        this.$refs['scroll'].setScrollPosition(0)
      },
      scrollToRecord ({pos}) {
        const activeCard = this.$refs['list'].children[pos]
        let offset = activeCard ? activeCard.offsetTop : 0
        offset -= Math.floor(this.$refs['scroll'].$el.clientHeight / 2)
        offset += Math.floor(activeCard.clientHeight / 2)
        this.$refs['scroll'].setScrollPosition(offset)
      },
      addClaim () {
        // todo: open form for add new claim
        this.$router.push('/claim/new')
      },
      __onKeyArrowDown () {
        void this.$store.dispatch('claimsListScroll', 1)
      },
      __onKeyArrowUp () {
        void this.$store.dispatch('claimsListScroll', -1)
      },
      __onKeyEnter  () {
        void this.$store.dispatch('getClaimRecord', { socket: this.$socket, idx: this.claimRecordIndexActive })
        this.$router.push('/claim/view')
      }
    },
    data () {
      return {
        eventMapper: {
          'key:arrow:down': this.__onKeyArrowDown,
          'key:enter': this.__onKeyEnter,
          'key:insert': this.addClaim,
          'key:arrow:up': this.__onKeyArrowUp,
          'claims:new-portion': this.newPortionHandler,
          'claims:list:scroll:to': this.scrollToRecord
        }
      }
    },
    created () {
      mapEvent(this, true)
    },
    beforeDestroy () {
      mapEvent(this, false)
    },
    directives: {
      BackToTop
    }

  }
</script>

<style>
  .claim-body {
    height: calc(100vh - 116px);
  }
  .claim-footer {
    height: 56px;
    width: 100%;
    bottom: 0;
    left: 0;
    position: relative;
  }
</style>

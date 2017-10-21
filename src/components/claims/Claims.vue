<!--suppress ALL -->
<template>
  <div class="content relative-position" v-touch-pan.horizontal.nomouse="onPanning">
    <q-scroll-area ref="scroll" class="claim-body">
      <claim-header ref="navigator"/>
      <q-list ref="list" no-border>
        <claim-row v-for="(item, index) in claimList" :key="item['id']" :claimRec="item" :claimIdx="index"/>
      </q-list>
      <q-fixed-position corner="bottom-right" :offset="[12, 68]" class="z-absolute">
        <q-btn
          color="secondary"
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
    <claim-new
      ref="formNew"
      @close="onNewClose"
      @complete="onNewComplete"
    />
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import ClaimPaginator from './ClaimPaginator.vue'
  import { QScrollArea, QList, QFixedPosition, QBtn, QIcon, BackToTop, TouchPan, scroll } from 'quasar-framework'
  import { AfLoadCover } from '../base'
  import { mapState } from 'vuex'
  import {ClaimNew} from './actions'
  import {mapEvent} from '../../routines'

  export default {
    components: {
      ClaimHeader,
      QScrollArea,
      ClaimRow,
      QList,
      QFixedPosition,
      QBtn,
      QIcon,
      ClaimPaginator,
      AfLoadCover,
      ClaimNew
    },
    computed: {
      ...mapState({
        currentCondition: state => state.claims.currentCondition,
        currentClaimLimit: state => state.claims.currentClaimLimit,
        claimList: state => state.claims.claimList,
        progress: state => state.actionInProgress,
        claimRecordIndexActive: state => state.claims.claimRecordIndexActive,
        claimListPages: state => state.claims.claimListPages,
        currentClaimPage: state => state.claims.currentClaimPage
      })
    },
    mounted: function () {
      void this.$store.dispatch('sendClaimsRequest', {socket: this.$socket})
    },
    methods: {
      newPortionHandler () {
        const target = scroll.getScrollTarget(this.$refs['navigator'].$el)
        if (target) {
          scroll.setScrollPosition(target, 0)
        }
      },
      scrollToRecord ({pos}) {
        const target = scroll.getScrollTarget(this.$refs['navigator'].$el)
        if (target) {
          const activeCard = this.$refs['list'].children[pos]
          let offset = activeCard ? activeCard.offsetTop : 0
          offset -= Math.floor(this.$refs['scroll'].$el.clientHeight / 2)
          offset += Math.floor(activeCard.clientHeight / 2)
          scroll.setScrollPosition(target, offset)
        }
      },
      addClaim () {
        mapEvent(this, false)
        this.$refs.formNew.open()
      },
      onNewClose () {
        mapEvent(this, true)
      },
      onNewComplete () {
        void this.$store.dispatch('sendClaimsRequest', {socket: this.$socket})
      },
      __onKeyArrowDown () {
        if (!this.progress && this.claimRecordIndexActive < this.claimList.length - 1) {
          void this.$store.dispatch('claimsListScroll', 1)
        }
      },
      __onKeyArrowUp () {
        if (!this.progress && this.claimRecordIndexActive > 0) {
          void this.$store.dispatch('claimsListScroll', -1)
        }
      },
      __onKeyEnter () {
        if (this.progress) return
        void this.$store.dispatch('getClaimRecord', { socket: this.$socket, idx: this.claimRecordIndexActive })
        this.$router.push('/claim/view')
      },
      __onPrevPage () {
        if ((!this.progress) && (this.currentClaimPage > 1)) {
          void this.$store.dispatch('setCurrentClaimPage', {value: this.currentClaimPage - 1, socket: this.$socket})
        }
      },
      __onNextPage () {
        if ((!this.progress) && (this.currentClaimPage < this.claimListPages)) {
          void this.$store.dispatch('setCurrentClaimPage', {value: this.currentClaimPage + 1, socket: this.$socket})
        }
      },
      onPanning (obj) {
        if (obj.isFinal) {
          if (obj.direction === 'left') this.__onNextPage()
          else this.__onPrevPage()
        }
      }
    },
    data () {
      return {
        eventMapper: {
          'key:arrow:down': this.__onKeyArrowDown,
          'key:enter': this.__onKeyEnter,
          'key:insert': this.addClaim,
          'key:arrow:up': this.__onKeyArrowUp,
          'key:arrow:left:ctrl': this.__onPrevPage,
          'key:arrow:right:ctrl': this.__onNextPage,
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
      BackToTop,
      TouchPan
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

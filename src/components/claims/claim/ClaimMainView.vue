<template>
  <div v-touch-pan.horizontal.nomouse="onPanning" :class="{'af-selectable' : isNotTouch}">
    <claim-view-navigator ref="nav"/>
    <claim-card/>
    <hr/>
    <claim-view-files/>
    <hr/>
    <claim-view-history/>
    <q-fixed-position corner="bottom-right" :offset="[12, 68]" class="z-absolute">
      <q-btn
        color="deep-orange-12"
        round
        icon="keyboard_arrow_up"
        class="animate-pop"
        v-back-to-top.animate="{offset: 100, duration: 200}"
      />
    </q-fixed-position>
    <af-load-cover :progress="loadProgress"/>
  </div>
</template>

<script>
  import {AfUnderConsruct, AfLoadCover} from '../../base'
  import ClaimCard from './ClaimCard.vue'
  import ClaimViewNavigator from './ClaimViewNavigator.vue'
  import ClaimViewFiles from './ClaimViewFiles.vue'
  import ClaimViewHistory from './ClaimViewHistory.vue'
  import {mapState, mapGetters} from 'vuex'
  import { mapEvent } from '../../../routines'
  import {TouchPan, QFixedPosition, QBtn, BackToTop} from 'quasar-framework'

  export default {
    components: {
      AfUnderConsruct,
      ClaimCard,
      ClaimViewNavigator,
      ClaimViewFiles,
      ClaimViewHistory,
      AfLoadCover,
      QFixedPosition,
      QBtn
    },
    computed: {
      ...mapState({
        loadProgress: state => state.claims.getClaimsInProgress,
        isFirstRecord: state => state.claims.isFirstRecord,
        isLastRecord: state => state.claims.isLastRecord
      }),
      ...mapGetters([
        'isNotTouch'
      ])
    },
    directives: {
      TouchPan,
      BackToTop
    },
    methods: {
      __onPrevClaim () {
        if ((!this.progress) && (!this.isFirstRecord)) this.$refs.nav.claimStepRecord(-1)
      },
      __onNextClaim () {
        if ((!this.progress) && (!this.isLastRecord)) this.$refs.nav.claimStepRecord(1)
      },
      onPanning (obj) {
        if (obj.isFinal && !this.loadProgress) {
          if (obj.direction === 'left') this.__onNextClaim()
          else this.__onPrevClaim()
        }
      },
      __backToList () {
        this.$refs.nav.goBackToList()
      }
    },
    data () {
      return {
        eventMapper: {
          'key:arrow:left:ctrl': this.__onPrevClaim,
          'key:arrow:right:ctrl': this.__onNextClaim,
          'key:backspace': this.__backToList
        }
      }
    },
    created () {
      mapEvent(this, true)
    },
    beforeDestroy () {
      mapEvent(this, false)
    }
  }
</script>

<style lang="stylus">
</style>

<template>
  <div v-touch-pan.horizontal.nomouse="onPanning" :class="{'af-selectable' : isNotTouch}">
    <claim-view-navigator/>
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
  import { AfUnderConsruct, AfLoadCover } from '../../base'
  import ClaimCard from './ClaimCard.vue'
  import ClaimViewNavigator from './ClaimViewNavigator.vue'
  import ClaimViewFiles from './ClaimViewFiles.vue'
  import ClaimViewHistory from './ClaimViewHistory.vue'
  import { mapState, mapGetters } from 'vuex'
  import { TouchPan, QFixedPosition, QBtn, BackToTop } from 'quasar-framework'

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
        loadProgress: state => state.claims.getClaimsInProgress
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
      onPanning (obj) {
        if (obj.isFinal) {
          this.$store.dispatch('claimStepRecord', {socket: this.$socket, step: (obj.direction === 'left') ? 1 : -1})
        }
      }
    }
  }
</script>

<style lang="stylus">
</style>

<template>
  <div v-touch-pan.horizontal.nomouse="onPanning" :class="{'af-selectable' : isNotTouch}">
    <af-under-consruct
      title="Перегляд рекламації"
      back-route="/claims"
      back-text="До списку"
    />
    <claim-view-navigator/>
    <claim-card/>
    <hr/>
    <claim-view-files/>
    <hr/>
    <claim-view-history/>
    <af-load-cover :progress="loadProgress"/>
  </div>
</template>

<script>
  import { AfUnderConsruct, AfLoadCover } from '../../base'
  import ClaimCard from './ClaimCard.vue'
  import ClaimViewNavigator from './ClaimViewNavigator.vue'
  import ClaimViewFiles from './ClaimViewFiles.vue'
  import ClaimViewHistory from './ClaimViewHistory.vue'
  import { mapState } from 'vuex'
  import { TouchPan } from 'quasar-framework'

  export default {
    components: {
      AfUnderConsruct,
      ClaimCard,
      ClaimViewNavigator,
      ClaimViewFiles,
      ClaimViewHistory,
      AfLoadCover
    },
    computed: {
      ...mapState({
        loadProgress: state => state.claims.getClaimsInProgress
      }),
      isNotTouch () {
        return !this.$q.platform.has.touch
      }
    },
    directives: {
      TouchPan
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
  .af-selectable
    -webkit-user-select text
    -moz-user-select text
    -ms-user-select text
    user-select text
</style>

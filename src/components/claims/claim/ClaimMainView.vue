<template>
  <div>
    <af-under-consruct
      title="Перегляд рекламації"
      back-route="/claims"
      back-text="До списку"
    />
    <claim-view-navigator/>
    <claim-card/>
    <hr/>
    <claim-view-documents/>
    <hr/>
    <claim-view-history/>
    <af-load-cover :progress="loadProgress"/>
  </div>
</template>

<script>
  import { AfUnderConsruct, AfLoadCover } from '../../base'
  import ClaimCard from './ClaimCard.vue'
  import ClaimViewNavigator from './ClaimViewNavigator.vue'
  import ClaimViewDocuments from './ClaimViewDocuments.vue'
  import ClaimViewHistory from './ClaimViewHistory.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      AfUnderConsruct,
      ClaimCard,
      ClaimViewNavigator,
      ClaimViewDocuments,
      ClaimViewHistory,
      AfLoadCover
    },
    computed: {
      ...mapState({
        loadProgress: state => state.claims.getClaimsInProgress
      })
    }
  }
</script>

<style lang="stylus">
</style>

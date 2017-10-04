<template>
  <div>
    <af-under-consruct
      title="Перегляд рекламації"
      back-route="/claims"
      back-text="До списку"
    />
    <claim-card></claim-card>
  </div>
</template>

<script>
  import AfUnderConsruct from '../../base/AfUnderConsruct.vue'
  import ClaimCard from './ClaimCard.vue'

  export default {
    components: { AfUnderConsruct, ClaimCard }
  }
</script>

<style lang="stylus">
</style>

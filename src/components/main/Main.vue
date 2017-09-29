<template>
  <div class="content">
    <h5>Поточні релізи</h5>
    <div class="row">
    <release-card class="col-md col-sm-12" :rtype="'stable'"></release-card>
    <release-card class="col-md col-sm-12" :rtype="'beta'"></release-card>
    </div>
  </div>
</template>

<script>
import ReleaseCard from './ReleaseCard.vue'
export default {
  components: {
    ReleaseCard
  },
  created () {
    if (!this.$store.state.main.releasesLoaded) {
      this.$socket.emit('get_cur_releases')
    }
  }
}
</script>

<style>
</style>

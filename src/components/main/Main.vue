<template>
  <div class="content">
    <h5>Поточні релізи</h5>
    <release-card :rtype="'stable'"></release-card>
    <release-card :rtype="'beta'"></release-card>
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
  .content {
    margin: 10px auto 0 15px;
  }
  h5 {
    color: #ff6e40;
  }
</style>

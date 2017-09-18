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
  data () {
    return {
    }
  },
  components: {
    ReleaseCard
  },
  computed: {
    curReleases () {
      return this.$store.getters.curReleases
    },
    releasesLoaded () {
      return this.$store.getters.releasesLoaded
    }
  },
  created () {
    if (!this.$store.getters.releasesLoaded) {
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

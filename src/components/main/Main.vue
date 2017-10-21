<template>
  <div class="content">
    <h5>Поточні релізи</h5>
    <div class="row relative-position">
    <release-card class="col-md col-sm-12" :rtype="'stable'"></release-card>
    <release-card class="col-md col-sm-12" :rtype="'beta'"></release-card>
    <af-load-cover :progress="isActionInProgress"/>
    </div>
  </div>
</template>

<script>
import ReleaseCard from './ReleaseCard.vue'
import {AfLoadCover} from '../base'
import {mapGetters} from 'vuex'
export default {
  components: {
    ReleaseCard,
    AfLoadCover
  },
  mounted () {
    this.$store.dispatch('getCurReleases', {socket: this.$socket})
  },
  computed: {
    ...mapGetters([
      'isActionInProgress'
    ])
  }
}
</script>

<style>
</style>

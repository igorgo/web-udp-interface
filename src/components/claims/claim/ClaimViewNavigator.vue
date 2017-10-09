<template>
  <div class="content">
    <div class="row justify-around">
      <div class="col text-center">
        <q-btn small color="primary" icon="arrow back" class="claim-nav-title" :disabled="isFirstRecord"
               @click="claimStepRecord(-1)"><span>Попередня</span></q-btn>
      </div>
      <div class="col text-center" id="claim-nav-back">
        <q-btn small color="primary" icon="arrow upward" icon-right="arrow upward" class="claim-nav-title"
               @click="goBackToList">
          <span>До списку</span>
        </q-btn>
      </div>
      <div class="col text-center">
        <q-btn small color="primary" icon-right="arrow forward" class="claim-nav-title" :disabled="isLastRecord"
               @click="claimStepRecord(1)"><span>Наступна</span></q-btn>
      </div>
    </div>
    <hr/>
  </div>
</template>

<script>
  import {QBtn} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    name: 'claim-view-navigator',
    props: [],
    data () {
      return {}
    },
    components: {
      QBtn
    },
    methods: {
      ...mapActions([]),
      claimStepRecord (step) {
        this.$store.dispatch('claimStepRecord', { socket: this.$socket, step })
      },
      goBackToList () {
        void this.$store.dispatch('claimsSetDoNotUpdate', true)
        this.$router.back()
      }
    },
    computed: {
      ...mapState({
        isFirstRecord: state => state.claims.isFirstRecord,
        isLastRecord: state => state.claims.isLastRecord
      }),
      ...mapGetters([])
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  #claim-nav-back
    margin 0 10px

  @media (max-width: 520px)
    .claim-nav-title > .q-btn-inner > span
      display none

    .claim-nav-title > .q-btn-inner > .on-left
    .claim-nav-title > .q-btn-inner > .on-right
      margin 0

    #claim-nav-back > .claim-nav-title > .q-btn-inner > .on-right
      display none
</style>

<template>
  <div class="cl-content">
    <q-scroll-area ref="scroll" class="claim-body">
      <claim-header/>
      <q-list no-border highlight>
        <claim-row v-for="iClaim in claimList" :key="iClaim['id']" :claimRec="iClaim"/>
      </q-list>
      <q-fixed-position corner="bottom-right" :offset="[12, 68]" class="z-absolute">
        <q-btn
          color="deep-orange-12"
          round
          class="animate-pop"
          v-back-to-top.animate="{offset: 500, duration: 200}"
        >
          <q-icon name="keyboard_arrow_up" />
        </q-btn>
      </q-fixed-position>
    </q-scroll-area>
    <claim-paginator class="claim-footer text-center"></claim-paginator>
    <q-fixed-position corner="bottom-right" :offset="[12, 8]">
      <q-btn round color="primary" @click="addClaim">
        <q-icon name="add" />
      </q-btn>
    </q-fixed-position>
    <af-load-cover :progress="progress"/>
  </div>
</template>

<script>
  import ClaimHeader from './ClaimsHeader.vue'
  import ClaimRow from './ClaimRow.vue'
  import ClaimPaginator from './ClaimPaginator.vue'
  import { QScrollArea, QList, QFixedPosition, QBtn, QIcon, BackToTop } from 'quasar-framework'
  import { AfLoadCover } from '../base'
  import { mapGetters, mapState } from 'vuex'

  export default {
    components: { ClaimHeader, QScrollArea, ClaimRow, QList, QFixedPosition, QBtn, QIcon, ClaimPaginator, AfLoadCover },
    computed: {
      ...mapState({
        currentCondition: state => state.claims.currentCondition,
        currentClaimLimit: state => state.claims.currentClaimLimit,
        claimList: state => state.claims.claimList,
        progress: state => state.claims.getClaimsInProgress
      }),
      ...mapGetters([
      ])
    },
    mounted: function () {
      void this.$store.dispatch('sendClaimsRequest', {socket: this.$socket})
    },
    methods: {
      newPortionHandler () {
        this.$refs['scroll'].setScrollPosition(0)
      },
      addClaim () {
        // todo: open form for add new claim
        // alert('todo: open form for add new claim')
        this.$router.push('/claim/new')
      }
    },
    created () {
      this.$q.events.$on('new-portion', this.newPortionHandler)
    },
    beforeDestroy () {
      this.$q.events.$off('new-portion', this.newPortionHandler)
    },
    directives: {
      BackToTop
    }

  }
</script>

<style>
  .claim-body {
    height: calc(100vh - 116px);
  }
  .claim-footer {
    height: 56px;
    width: 100%;
    bottom: 0;
    left: 0;
    position: relative;
  }
  .cl-content {
    padding: 10px 10px 0 10px;
  }
</style>

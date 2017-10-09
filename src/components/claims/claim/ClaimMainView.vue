<template>
  <div v-touch-pan.horizontal.nomouse="onPanning" :class="{'af-selectable' : isNotTouch}">
    <claim-view-navigator ref="nav"/>
    <q-scroll-area ref="scroll" class="claim-view-body">
      <claim-card ref="card"/>
      <claim-view-files/>
      <claim-view-history/>
      <q-fixed-position corner="bottom-right" :offset="[12, 18]" class="z-absolute">
        <q-btn
          color="secondary"
          round
          icon="keyboard_arrow_up"
          class="animate-pop"
          v-back-to-top.animate="{offset: 100, duration: 200}"
        />
      </q-fixed-position>
    </q-scroll-area>
    <q-fixed-position corner="top-right" :offset="[10, 5]" class="z-absolute" v-show="!loadProgress && !actionProgress">
      <q-btn
        color="white"
        round
        small
        flat
        icon="settings"
        class="animate-pop"
        @click="showActions"
      />
    </q-fixed-position>
    <af-load-cover :progress="loadProgress"/>
  </div>
</template>

<script>
  import {AfUnderConsruct, AfLoadCover} from '../../base'
  import ClaimCard from './ClaimCard.vue'
  import ClaimViewNavigator from './ClaimViewNavigator.vue'
  import ClaimViewFiles from './ClaimViewFiles.vue'
  import ClaimViewHistory from './ClaimViewHistory.vue'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {mapEvent} from '../../../routines'
  import {TouchPan, QFixedPosition, QBtn, BackToTop, ActionSheet, QScrollArea, scroll} from 'quasar-framework'

  export default {
    components: {
      AfUnderConsruct,
      ClaimCard,
      ClaimViewNavigator,
      ClaimViewFiles,
      ClaimViewHistory,
      AfLoadCover,
      QFixedPosition,
      QBtn,
      QScrollArea
    },
    computed: {
      ...mapState({
        loadProgress: state => state.claims.getClaimsInProgress,
        actionProgress: state => state.claims.actionInProgress,
        isFirstRecord: state => state.claims.isFirstRecord,
        isLastRecord: state => state.claims.isLastRecord
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
      ...mapActions([
        'claimSetActionProgress'
      ]),
      __onPrevClaim () {
        if ((!this.progress) && (!this.isFirstRecord)) this.$refs.nav.claimStepRecord(-1)
      },
      __onNextClaim () {
        if ((!this.progress) && (!this.isLastRecord)) this.$refs.nav.claimStepRecord(1)
      },
      onPanning (obj) {
        if (obj.isFinal && !this.loadProgress) {
          if (obj.direction === 'left') this.__onNextClaim()
          else this.__onPrevClaim()
        }
      },
      scrollDown () {
        this.__scroll(true)
      },
      scrollUp () {
        this.__scroll(false)
      },
      __scroll (down) {
        const target = scroll.getScrollTarget(this.$refs['card'].$el)
        const cPos = scroll.getScrollPosition(target)
        scroll.setScrollPosition(target, cPos + (down ? 50 : -50))
      },
      __backToList () {
        this.$refs.nav.goBackToList()
      },
      __onAction (action) {
        switch (action) {
          case 'edit':
            console.log('виправити')
            break
          case 'status':
            console.log('змінити статус')
            break
          case 'assign':
            console.log('змінити виконавця')
            break
          case 'return':
            console.log('повернути попередній статус')
            break
          case 'comment':
            console.log('прокоментувати')
            break
          case 'annul':
            console.log('анулювати')
            break
          case 'prioritize':
            console.log('встановити пріоритет')
            break
          case 'attach':
            console.log('додати файл')
            break
        }
        // !!!! убрать потом
        this.claimSetActionProgress(false)
      },
      showActions () {
        this.claimSetActionProgress(true)
        ActionSheet.create({
          title: 'Виберіть дію',
          actions: [
            {
              label: 'змінити статус',
              icon: 'assignment turned in',
              handler: () => {
                this.__onAction('status')
              }
            },
            {
              label: 'змінити виконавця',
              icon: 'assignment ind',
              handler: () => {
                this.__onAction('assign')
              }
            },
            {
              label: 'повернути попередній статус',
              icon: 'assignment return',
              handler: () => {
                this.__onAction('return')
              }
            },
            {
              label: 'прокоментувати',
              icon: 'speaker notes',
              handler: () => {
                this.__onAction('comment')
              }
            },
            {
              label: 'додати файл',
              icon: 'attach file',
              handler: () => {
                this.__onAction('attach')
              }
            },
            {
              label: 'виправити',
              icon: 'mode edit',
              handler: () => {
                this.__onAction('edit')
              }
            },
            {
              label: 'змінити пріоритет',
              icon: 'swap vert',
              handler: () => {
                this.__onAction('prioritize')
              }
            },
            {
              label: 'анулювати',
              icon: 'block',
              handler: () => {
                this.__onAction('annul')
              }
            }
          ],
          dismiss: {
            label: 'Скасування',
            handler: () => {
              this.claimSetActionProgress(false)
            }
          }
        })
      }
    },
    data () {
      return {
        eventMapper: {
          'key:arrow:left:ctrl': this.__onPrevClaim,
          'key:arrow:right:ctrl': this.__onNextClaim,
          'key:arrow:up': this.scrollUp,
          'key:arrow:down': this.scrollDown,
          'key:backspace': this.__backToList
        }
      }
    },
    created () {
      mapEvent(this, true)
    },
    beforeDestroy () {
      mapEvent(this, false)
    }
  }
</script>

<style lang="stylus">
  .claim-view-body
    height calc(100vh - 116px)

</style>

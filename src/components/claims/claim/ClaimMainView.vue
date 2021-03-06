<template>
  <div v-touch-pan.horizontal.nomouse="onPanning">
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
    <q-fixed-position corner="top-right" :offset="[10, 5]" class="z-absolute"
                      v-show="(!isActionInProgress) && actionsMask">
      <q-btn
        color="white"
        round
        small
        flat
        icon="more vert"
      >
        <q-popover ref="popover">
          <q-list link>
            <q-item v-for="item in availActions" :key="item.code" @click="onAction(item.code)">
              <q-item-side :icon="item.icon"/>
              <q-item-main :label="item.label"/>
            </q-item>
          </q-list>
        </q-popover>
      </q-btn>
    </q-fixed-position>
    <claim-attach ref="formAttach"/>
    <claim-edit ref="formEdit"/>
    <claim-set-status ref="formStatus"/>
    <claim-return ref="formReturn"/>
    <claim-send ref="formSend"/>
    <claim-note-edit ref="formNote"/>
    <claim-prioritize ref="formPrioritize"/>
    <claim-help ref="formHelp"/>
    <af-load-cover :progress="isActionInProgress"/>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {
    ClaimAttach,
    ClaimEdit,
    ClaimSetStatus,
    ClaimReturn,
    ClaimSend,
    ClaimNoteEdit,
    ClaimPrioritize,
    ClaimHelp
  } from '../actions'
  import {
    ClaimCard,
    ClaimViewNavigator,
    ClaimViewFiles,
    ClaimViewHistory
  } from './index'
  import {
    AfUnderConsruct,
    AfLoadCover,
    AfConfirmDialog,
    AfEventsMapper
  } from '../../base'
  import {
    TouchPan, QFixedPosition, QBtn, BackToTop, QScrollArea,
    scroll, QPopover, QList, QItemSide, QItemMain, QItem
  } from 'quasar-framework'
  import {
    MSG_CLAIM_DELETE_CONFIRM,
    MSG_CLAIM_ANNUL_CONFIRM,
    FORM_EDIT_MODES,
    FORM_CLAIM_HELP_MODE
  } from '../../../constants'
  import {
    AE_CLAIMS_REC_DELETED,
    AE_CLAIMS_REC_ANNULED,
    AE_CLAIMS_NOTE_EDIT_CLICK
  } from '../../../app-events'

  export default {
    components: {
      AfUnderConsruct,
      AfLoadCover,
      ClaimCard,
      ClaimViewNavigator,
      ClaimViewFiles,
      ClaimViewHistory,
      ClaimAttach,
      ClaimEdit,
      ClaimSetStatus,
      ClaimReturn,
      ClaimSend,
      ClaimNoteEdit,
      ClaimPrioritize,
      ClaimHelp,
      QFixedPosition,
      QBtn,
      QScrollArea,
      QPopover,
      QList,
      QItemSide,
      QItemMain,
      QItem
    },
    computed: {
      ...mapState({
        actionsMask: state => state.claims.claimActionsMask
      }),
      ...mapGetters([
        'isNotTouch',
        'isActionInProgress',
        'isFirstRecord',
        'isLastRecord',
        'isActionAvail'
      ]),
      availActions () {
        let result = []
        this.isActionAvail('status') && result.push({
          code: 'status',
          label: 'змінити статус',
          icon: 'assignment turned in'
        })
        this.isActionAvail('return') && result.push({
          code: 'return',
          label: 'повернути попередній статус',
          icon: 'assignment return'
        })
        this.isActionAvail('comment') && result.push({
          code: 'comment',
          label: 'коментувати',
          icon: 'speaker notes'
        })
        this.isActionAvail('assign') && result.push({
          code: 'assign',
          label: 'змінити виконавця',
          icon: 'assignment ind'
        })
        this.isActionAvail('attach') && result.push({
          code: 'attach',
          label: 'додати файл(и)',
          icon: 'attach file'
        })
        this.isActionAvail('prioritize') && result.push({
          code: 'prioritize',
          label: 'змінити пріоритет',
          icon: 'swap vert'
        })
        this.isActionAvail('edit') && result.push({
          code: 'edit',
          label: 'виправити',
          icon: 'mode edit'
        })
        this.isActionAvail('annul') && result.push({
          code: 'annul',
          label: 'анулювати',
          icon: 'block'
        })
        this.isActionAvail('delete') && result.push({
          code: 'delete',
          label: 'видалити',
          icon: 'delete'
        })
        this.isActionAvail('setHelpNeed') && result.push({
          code: 'setHelpNeed',
          label: 'вказати необхідність довідки',
          icon: 'help'
        })
        this.isActionAvail('setHelpStatus') && result.push({
          code: 'setHelpStatus',
          label: 'вказати статус довідки',
          icon: 'live help'
        })
        return result
      }
    },
    directives: {
      TouchPan,
      BackToTop
    },
    methods: {
      onPrevClaim () {
        if ((!this.progress) && (!this.isFirstRecord)) this.__stepRec(-1)
      },
      onNextClaim () {
        if ((!this.progress) && (!this.isLastRecord)) this.__stepRec(1)
      },
      __stepRec (step) {
        this.$refs.nav.claimStepRecord(step)
      },
      onPanning (obj) {
        if (obj.isFinal && !this.isActionInProgress) {
          if (obj.direction === 'left') this.onNextClaim()
          else this.onPrevClaim()
        }
      },
      scrollDown () {
        this.__scroll(true)
      },
      scrollUp () {
        this.__scroll(false)
      },
      goBackToList (doNotUppdate = false) {
        void this.$store.dispatch('claimsSetDoNotUpdate', doNotUppdate)
        this.$router.back()
      },
      __scroll (down) {
        const target = scroll.getScrollTarget(this.$refs['card'].$el)
        const cPos = scroll.getScrollPosition(target)
        scroll.setScrollPosition(target, cPos + (down ? 50 : -50))
      },
      backToList () {
        this.goBackToList(true)
      },
      __deleteClaim () {
        this.$store.dispatch('doClaimDelete', {socket: this.$socket})
        this.$q.events.$once(AE_CLAIMS_REC_DELETED, () => {
          this.goBackToList()
        })
      },
      __annulClaim () {
        this.$store.dispatch('doClaimAnnull', {socket: this.$socket})
        this.$q.events.$once(AE_CLAIMS_REC_ANNULED, () => {
          this.goBackToList()
        })
      },
      noteEdit (id) {
        this.$refs.formNote.open({mode: FORM_EDIT_MODES.EDIT, id})
      },
      onAction (action) {
        switch (action) {
          case 'edit':
            this.$refs.formEdit.open()
            break
          case 'status':
            this.$refs.formStatus.open()
            break
          case 'assign':
            this.$refs.formSend.open()
            break
          case 'return':
            this.$refs.formReturn.open()
            break
          case 'comment':
            this.$refs.formNote.open({mode: FORM_EDIT_MODES.NEW})
            break
          case 'annul':
            AfConfirmDialog.confirm(MSG_CLAIM_ANNUL_CONFIRM, this.__annulClaim)
            break
          case 'prioritize':
            this.$refs.formPrioritize.open()
            break
          case 'attach':
            this.$refs.formAttach.open()
            break
          case 'delete':
            AfConfirmDialog.confirm(MSG_CLAIM_DELETE_CONFIRM, this.__deleteClaim)
            break
          case 'setHelpNeed':
            this.$refs.formHelp.open(FORM_CLAIM_HELP_MODE.NEED)
            break
          case 'setHelpStatus':
            this.$refs.formHelp.open(FORM_CLAIM_HELP_MODE.STATUS)
            break
        }
        this.$refs.popover.close()
      }
    },
    data () {
      return {
        eventsMap: {
          'key:arrow:left:ctrl': this.onPrevClaim,
          'key:arrow:right:ctrl': this.onNextClaim,
          'key:arrow:up': this.scrollUp,
          'key:arrow:down': this.scrollDown,
          'key:backspace': this.backToList,
          [AE_CLAIMS_NOTE_EDIT_CLICK]: this.noteEdit
        }
      }
    },
    mixins: [AfEventsMapper]
  }
</script>

<style lang="stylus">
  .claim-view-body
    height calc(100vh - 116px)
</style>

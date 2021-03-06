<!--suppress JSUnusedGlobalSymbols -->
<template>
  <q-item multiline class="no-padding cursor-pointer" :class="{'claim-list-active': claimIdx === activeIndex, 'af-selectable' : isNotTouch}">
    <q-card class="claim-list-card text-black" :class="cardClass" color="grey-1">
      <q-card-main @click="onClaimClick(claimIdx)" style="padding: 10px">
        <div class="row justify-start cl-title" style="margin-bottom: 10px">
          <div class="col-sm-11 col-xs-9">{{clTitle}}</div>
          <div class="col-sm-1 col-xs-3">
            <q-chip :color="clPriorColor">!{{claimRec.priority}}</q-chip>
            <q-icon v-if="claimRec.hasDocs" name="attach file"></q-icon>
          </div>
        </div>
        <div class="claim-row-c">
          <div class="fl-3-6-12">№&nbsp;<span class="gray-token">{{claimRec.numb}}</span></div>
          <div class="fl-3-6-12">від&nbsp;<span class="gray-token">{{regDate}}</span></div>
          <div class="fl-3-6-12">Автор&nbsp;<span class="gray-token">{{claimRec.author}}</span></div>
          <div class="fl-3-6-12">
            <!--q-chip :color="clStatusColor" small :icon="clStatusIcon" class="text-center">
              {{claimRec.status}}<br/>{{changeDate}}
            </q-chip-->
            <q-chip :color="clStatusColor" small class="text-center">
              {{claimRec.status}} ({{changeDate}})
            </q-chip>
          </div>
        </div>
        <div class="claim-row text-left">
          <p class="ellipsis-3-lines text-faded light-paragraph">{{claimRec.description}}</p>
        </div>
        <div v-if="claimRec.executor || claimRec.hasBuildTo">
          <div class="claim-row-c">
            <div
              class="col-sm-6 col-xs-12"
              v-if="claimRec.hasBuildTo || claimRec.hasReleaseTo"
            >
              {{isClosed}}&nbsp;
              <span class="token bg-teal-14">{{claimRec.closedInBuild}}</span>
            </div>
            <div class="col-sm-6 col-xs-12" style="margin-bottom: 5px" v-if="claimRec.executor">
              <div v-if="claimRec.executor">Виконавець&nbsp;<span class="token bg-teal-14">{{claimRec.executor}}</span></div>
            </div>
          </div>
        </div>
      </q-card-main>
    </q-card>
  </q-item>
</template>

<script>
  import {QItem, QCard, QCardTitle, QIcon, QCardMain, QChip, QCardSeparator} from 'quasar-framework'
  import {formatDate} from '../../routines'
  import { mapGetters } from 'vuex'

  export default {
    components: { QItem, QCard, QCardTitle, QIcon, QCardMain, QChip, QCardSeparator },
    computed: {
      ...mapGetters([
        'isNotTouch'
      ]),
      cardClass () {
        return 'claim-list-card-t' + this.$props.claimRec.claimType
      },
      activeIndex () {
        return this.$store.state.claims.claimRecordIndexActive
      },
      regDate () {
        return formatDate(this.$props['claimRec'].regDate)
      },
      isClosed () {
        if (this.$props.claimRec.hasBuildTo) return 'Виконано в збірці'
        else return 'Буде виконано в релізі'
      },
      changeDate () {
        return formatDate(this.$props.claimRec.changeDate)
      },
      clTitle () {
        if (this.$props.claimRec.unit) return this.$props.claimRec.unit.replace(/;/g, ', ')
        return 'Рекламація'
      },
      clcolor () {
        switch (this.$props.claimRec.claimType) {
          case 1:
            return 'text-positive'
          case 2:
            return 'text-warning'
          case 3:
            return 'text-negative'
        }
      },
      clBcolor () {
        switch (this.$props.claimRec.claimType) {
          case 1:
            return 'green-1'
          case 2:
            return 'yellow-1'
          case 3:
            return 'red-1'
        }
      },
      clStatusColor () {
        switch (this.$props.claimRec.typicalStatus) {
          case 0:
            return 'light'
          case 1:
            return 'warning'
          case 2:
            return 'info'
          case 3:
            return 'positive'
          case 4:
            return 'negative'
        }
      },
      clStatusIcon () {
        switch (this.$props.claimRec.typicalStatus) {
          case 0:
            return ''
          case 1:
            return 'fa-hourglass-half'
          case 2:
            return 'fa-gears'
          case 3:
            return 'fa-times-circle-o'
          case 4:
            return 'fa-times-circle-o'
        }
      },
      clPriorColor () {
        const p = this.$props.claimRec.priority
        if (p === 5) {
          return 'tertiary'
        }
        else if (p < 5) {
          return 'light-blue-' + (5 + (p - 1))
        }
        else if (p > 5) {
          return 'red-' + p
        }
      }
    },
    props: ['claimRec', 'claimIdx'],
    name: 'claim-row',
    methods: {
      onClaimClick (idx) {
        void this.$store.dispatch('getClaimRecord', { socket: this.$socket, idx })
        this.$router.push('/claim/view')
      }
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  @import '~quasar-framework/dist/quasar.mat.styl'

  .fl-3-6-12
    @extends .col-xl-2
    @extends .col-sm-6
    @extends .col-xs-12
    margin-bottom 5px

  .gray-token
    @extends .token
    @extends .bg-blue-grey

  .claim-row
    @extends .row
    margin-bottom 5px

  .claim-row p
    margin-bottom 0
    line-height 1.2em

  .claim-row-c
    @extends .claim-row
    @extends .justify-start
    @extends .items-center

  .cl-title
    font-size 1.2rem

  .claim-list-card
    width 100%
    border-left-style solid
    border-left-width 16px
    margin 5px
    font-size .8em

  .claim-list-card-t1
    border-left-color $green-8

  .claim-list-card-t2
    border-left-color $yellow-6

  .claim-list-card-t3
    border-left-color $red-6

  .claim-list-active
    background-color $afinasql

</style>


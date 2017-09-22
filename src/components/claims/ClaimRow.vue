<template>
  <q-item multiline class="no-padding">
    <q-card class="full-width text-black" :color="clBcolor">
      <q-card-main>
        <div class="row justify-start cl-title" style="margin-bottom: 10px">
          <div class="col-sm-11 col-xs-10">{{clTitle}}</div>
          <div class="col-sm-1 col-xs-2">
            <!--q-icon :name="clicon" :class="clcolor"></q-icon-->
            <q-chip :color="clPriorColor" class="text-primary-dark">!{{claimRec.priority}}</q-chip>
            <q-icon v-if="claimRec.hasDocs" name="attach file"></q-icon>
          </div>
        </div>
        <div class="claim-row-c">
          <div class="fl-3-6-12">№&nbsp;<span class="gray-token">{{claimRec.numb}}</span></div>
          <div class="fl-3-6-12">від&nbsp;<span class="gray-token">{{regDate}}</span></div>
          <div class="fl-3-6-12">Автор&nbsp;<span class="gray-token">{{claimRec.author}}</span></div>
          <div class="fl-3-6-12">
            <q-chip :color="clStatusColor" small :icon="clStatusIcon" class="text-center">
              {{claimRec.status}}<br/>{{changeDate}}
            </q-chip>
          </div>
        </div>
        <q-card-separator style="margin-top: 10px"/>
        <div class="claim-row group text-left">
          <p class="ellipsis-3-lines text-faded light-paragraph">{{claimRec.description}}</p>
        </div>
      <!--/q-card-main-->
      <div v-if="claimRec.executor || claimRec.hasBuildTo">
        <!--q-card-main-->
          <div class="claim-row-c">
            <div class="col-sm-6 col-xs-12" v-if="claimRec.executor">
              Виконавець&nbsp;<span class="token bg-teal-14">{{claimRec.executor}}</span>
            </div>
            <div
              class="col-sm-6 col-xs-12"
              v-if="claimRec.hasBuildTo || claimRec.hasReleaseTo"
            >
              {{isClosed}}&nbsp;
              <span class="token bg-teal-14">{{claimRec.closedInBuild}}</span>
            </div>
          </div>
      </div>
      </q-card-main>
    </q-card>
  </q-item>
</template>

<script>
  import {
    QItem, QCard, QCardTitle, QIcon, QCardMain, QChip,
    QCardSeparator
  } from 'quasar'
  import {formatDateTime} from '../../routines'

  export default {
    data () {
      return {}
    },
    components: {
      QItem,
      QCard,
      QCardTitle,
      QIcon,
      QCardMain,
      QChip,
      QCardSeparator
    },
    computed: {
      clicon () {
        switch (this.$props.claimRec.claimType) {
          case 1:
            return 'build'
          case 2:
            return 'warning'
          case 3:
            return 'fa-bug'
        }
      },
      regDate () {
        return formatDateTime(this.$props.claimRec.regDate)
      },
      isClosed () {
        if (this.$props.claimRec.hasBuildTo) return 'Виконано в збірці'
        else return 'Буде виконано в релізі'
      },
      changeDate () {
        return formatDateTime(this.$props.claimRec.changeDate)
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
    props: ['claimRec'],
    name: 'claim-row'
  }
</script>

<style lang="styl">
  @import '~variables'
  @import '~quasar-framework/dist/quasar.mat.styl'

  .fl-3-6-12
    @extends .col-xl-3
    @extends .col-sm-6
    @extends .col-xs-12
  .gray-token
    @extends .token
    @extends .bg-blue-grey
  .claim-row
    @extends .row
    @extends .sm-gutter
  .claim-row-c
    @extends .claim-row
    @extends .justify-around
    @extends .items-center
  .cl-title
    font-size: 1.2rem
</style>


<template>
  <q-item>
    <q-card class="full-width text-black" :color="clBcolor">
      <q-card-main>
        <div>
          <big class="row justify-start">
            <div class="col-sm-1 col-xs-2">
              <q-icon :name="clicon" :class="clcolor"></q-icon>
            </div>
            <div class="col-sm-11 col-xs-10">{{clTitle}}</div>
          </big>
        </div>
      </q-card-main>
      <q-card-separator/>
      <q-card-main>
        <div class="row items-center justify-around sm-gutter">
          <div class="col-xl-3 col-sm-6 col-xs-12">№ <span class="token bg-blue-grey">{{claimRec.numb}}</span></div>
          <div class="col-xl-3 col-sm-6 col-xs-12">від <span class="token bg-blue-grey">{{regDate}}</span></div>
          <div class="col-xl-3 col-sm-6 col-xs-12">Автор <span class="token bg-blue-grey">{{claimRec.author}}</span></div>
          <div class="col-xl-3 col-sm-6 col-xs-12">
            <q-chip :color="clStatusColor" small :icon="clStatusIcon" class="text-center">
              {{claimRec.status}}<br/>{{changeDate}}
            </q-chip>
          </div>
        </div>
        <q-card-separator style="margin-top: 10px"/>
        <div class="row">
          <p class="ellipsis-3-lines text-faded light-paragraph">{{claimRec.description}}</p>
        </div>
      </q-card-main>
      <div v-if="claimRec.executor || claimRec.hasBuildTo">
        <q-card-separator style="margin-bottom: 10px"/>
        <q-card-main class="row justify-around sm-gutter">
          <span class="col-sm-6 col-xs-12" v-if="claimRec.executor">Виконавець <span class="token bg-teal-14">{{claimRec.executor}}</span></span>
          <span class="col-sm-6 col-xs-12" v-if="claimRec.hasBuildTo || claimRec.hasReleaseTo">{{isClosed}} <span
            class="token bg-teal-14">{{claimRec.closedInBuild}}</span></span>
        </q-card-main>
      </div>
    </q-card>
  </q-item>
</template>

<script>
  import {
    QItem, QCard, QCardTitle, QIcon, QCardMain, QChip,
    QCardSeparator
  } from 'quasar'
  import {formatDateTime} from '../../store/routines'

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
        if (this.$props.claimRec.hasBuildTo) return 'Виконано в збірці '
        else return 'Буде виконано в релізі '
      },
      changeDate () {
        return formatDateTime(this.$props.claimRec.changeDate)
      },
      clTitle () {
        return this.$props.claimRec.unit.replace(/;/g, ', ')
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
      }
    },
    props: ['claimRec'],
    name: 'claim-row'
  }
</script>

<style>
</style>

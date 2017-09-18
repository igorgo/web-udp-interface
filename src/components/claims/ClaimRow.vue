<template>
  <q-item>
    <div>
      <div class="row">
        <div class="col-1"><big>
          <q-icon :name="clicon" :class="clcolor"></q-icon>
        </big>
        </div>
        <div class="col-11">{{clTitle}}</div>
      </div>
      <div class="row">
        <div class="strong col-lg-3 col-xs-4">№ <span class="token bg-blue-grey">{{claimRec.numb}}</span></div>
        <div class="col-lg-5 col-xs-8">від <span class="token bg-blue-grey">{{regDate}}</span></div>
        <div class="col-lg-4 col-xs-8">Автор <span class="token bg-blue-grey">{{claimRec.author}}</span></div>
        <div class="col-12">
          <q-chip :color="clStatusColor" small :icon="clStatusIcon" class="text-center float-right">
            {{claimRec.status}}<br/>{{changeDate}}
          </q-chip>
        </div>
      </div>
      <div class="row">
        <p class="ellipsis-2-lines text-faded light-paragraph">{{claimRec.description}}</p>
      </div>
      <div class="row" v-if="claimRec.executor || claimRec.hasBuildTo">
        <q-card-separator/>
        <span v-if="claimRec.executor">Виконавець <span class="token bg-teal-14">{{claimRec.executor}}</span></span>
        <span v-if="claimRec.hasBuildTo || claimRec.hasReleaseTo">{{isClosed}} <span
          class="token bg-teal-14">{{claimRec.closedInBuild}}</span></span>
      </div>
    </div>
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

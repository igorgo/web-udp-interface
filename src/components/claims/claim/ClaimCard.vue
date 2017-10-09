<!--suppress JSUnusedGlobalSymbols -->
<template>
    <div v-if="record.id">
      <q-card  :color="clBcolor">
        <q-card-main class="row no-padding">
       <!--   <q-chip :icon="clIconSet" square color="secondary">{{record.claimType}} № {{`${record.claimPrefix}-${record.claimNumber}`}} </q-chip>-->
          <af-comp-table v-bind:items="[{label: 'Тип події' , text: record.claimType},
            {label: 'Подія №', text: record.claimPrefix+'-'+record.claimNumber},
      {label: 'Пріоритет', text: record.priority},
      {label: 'Стан', text: record.claimState}
      ]"/>
          <af-comp-table v-bind:items="[{label: 'Зареєстровано', text: registeredAt},
      {label: 'Стан змінено', text: changedAt},
      {label: 'Відпрацювати до', text: execTill},
      {label: 'Стан хелпу', text: record.helpSign}
      ]"/>,
          <af-comp-table v-bind:items="[{label: 'Автор', text: record.registeredByAgent},
      {label: 'Виконавець', text: record.executor},
      {label: 'Реліз виявлення', text: record.buildFrom},
      {label: 'Реліз виконання', text: record.buildTo}]"/>
        </q-card-main>
        <div><span class="af-simple-label">Модуль</span><span>{{record.app}}</span></div>
        <div><span class="af-simple-label">Розділ</span><span>{{record.unit}}</span></div>
        <div><span  v-if="record.action" class="af-simple-label">Дія</span><span>{{record.action}}</span></div>
        <div><pre class="af-history-comment">{{record.content}}</pre></div>
      </q-card>
    </div>
</template>

<script>
  // import {} from 'quasar-framework'
  import { QCard, QChip, QCardTitle, QCardMain, QItem, QItemSide, QItemMain, QItemTile, QList } from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {formatDateTime} from '../../../routines'
  import AfTextWithLabel from '../../base/AfTextWithLabel.vue'
  import AfCompTable from '../../base/AfCompTable.vue'

  export default {
    props: [],
    data () {
      return {}
    },
    components: {
      AfCompTable, AfTextWithLabel, QCard, QCardMain, QChip, QCardTitle, QItem, QItemSide, QItemMain, QItemTile, QList},
    methods: {
      ...mapActions([])
    },
    computed: {
      ...mapState({
        record: state => state.claims.claimRecord
      }),
      ...mapGetters([]),
      registeredAt () {
        return formatDateTime(this.record.registeredAt)
      },
      changedAt () {
        return formatDateTime(this.record.changedAt)
      },
      execTill () {
        return formatDateTime(this.record.execTill)
      },
      // to test only, rewrite after testing
      clIconSet () {
        switch (this.record.claimType) {
          case 'ДОРАБОТКА':
            return 'add alert'
          case 'ЗАМЕЧАНИЕ':
            return 'warning'
          case 'ОШИБКА':
            return 'error'
        }
      }
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
    .af-row
      display: flex
      flex-flow: row wrap
      justify-content: flex-start
    .af-simple-label
     color: $primary
     margin: 1px
     padding: 5px 5px 5px 3px
     width: 50px
</style>

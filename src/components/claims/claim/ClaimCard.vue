<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div v-if="record.id">
    <q-card flat>
      <q-card-main class="row">
        <!--   <q-chip :icon="clIconSet" square color="secondary">{{record.claimType}} № {{`${record.claimPrefix}-${record.claimNumber}`}} </q-chip>-->
        <af-comp-table v-for="(tab, index) in compTables" :key="'tab'+index" :items="tab" text-width="150px" class="col-12 col-sm-6 col-xl-4"/>
      </q-card-main>
      <div><span class="af-simple-label">Модуль</span><span>{{record.app}}</span></div>
      <div><span class="af-simple-label">Розділ</span><span>{{record.unit}}</span></div>
      <div><span v-if="record.action" class="af-simple-label">Дія</span><span>{{record.action}}</span></div>
      <div>
        <pre class="af-history-comment"><small>{{record.content}}</small></pre>
      </div>
    </q-card>
  </div>
</template>

<script>
  // import {} from 'quasar-framework'
  import {QCard, QChip, QCardTitle, QCardMain, QItem, QItemSide, QItemMain, QItemTile, QList} from 'quasar-framework'
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
      AfCompTable, AfTextWithLabel, QCard, QCardMain, QChip, QCardTitle, QItem, QItemSide, QItemMain, QItemTile, QList
    },
    methods: {
      ...mapActions([])
    },
    computed: {
      ...mapState({
        record: state => state.claims.claimRecord,
        compTables () {
          return [
            [
              { label: 'Тип події', text: this.record.claimType },
              { label: 'Подія №', text: this.record.claimPrefix + '-' + this.record.claimNumber },
              { label: 'Пріоритет', text: this.record.priority },
              { label: 'Стан', text: this.record.claimState }
            ],
            [
              { label: 'Зареєстровано', text: formatDateTime(this.record.registeredAt) },
              { label: 'Стан змінено', text: formatDateTime(this.record.changedAt) },
              { label: 'Відпрацювати до', text: formatDateTime(this.record.execTill) },
              { label: 'Стан хелпу', text: this.record.helpSign }
            ],
            [
              { label: 'Автор', text: this.record.registeredByAgent },
              { label: 'Виконавець', text: this.record.executor },
              { label: 'Реліз виявлення', text: this.record.buildFrom },
              { label: 'Реліз виконання', text: this.record.buildTo }
            ]
          ]
        }
      }),
      ...mapGetters([]),
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

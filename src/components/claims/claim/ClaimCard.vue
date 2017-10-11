<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div v-if="record.id">
    <q-card flat>
      <div></div>
      <div class="row" ref="fields">
        <af-field-value-list
          v-for="(tab, index) in compTables"
          :key="'tab'+index"
          :items="tab"
          valueBg="primary"
          labelBg="yellow-1"
          valueFg="white"
          labelAlign="right"
          valueAlign="left"
          class="col-12 col-sm-6 col-xl-4"
          :valueWidth="[6,5,5,6,6]"
        />
      </div>
      <q-card-main class="row">
        <af-comp-table v-for="(tab, index) in compTables" :key="'tab'+index" :items="tab"
                       class="col-12 col-sm-6 col-xl-4"/>
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
  import {AfCompTable, AfFieldValueList} from '../../base'

  export default {
    props: [],
    data () {
      return {}
    },
    components: {
      AfCompTable,
      QCard,
      QCardMain,
      QChip,
      QCardTitle,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      QList,
      AfFieldValueList
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
      ...mapGetters([
      ]),
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
    resizeFields () {

    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    updated () {
      const values = this.$refs.fields.querySelectorAll('.af-f-v-list-val')
      const labels = this.$refs.fields.querySelectorAll('.af-f-v-list-lab')
      console.log(labels)
      console.log(values)
      let maxValWidth = 0
      for (let i = 0; i < values.length; i++) {
        if (values[i].clientWidth > maxValWidth) maxValWidth = values[i].clientWidth
      }
      console.log(maxValWidth)
      const labelWidth = this.$refs.fields.querySelector('.af-f-v-list-row').clientWidth - maxValWidth
      console.log(labelWidth)
      for (let i = 0; i < values.length; i++) {
        values[i].style.width = maxValWidth + 'px'
      }
      for (let i = 0; i < labels.length; i++) {
        labels[i].style.width = labelWidth - 4 + 'px'
      }
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

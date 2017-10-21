<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div v-if="record.id" style="padding: 0 10px">
      <div class="row justify-around" ref="fields">
        <af-field-value-list
          v-for="(tab, index) in compTables"
          :key="'tab'+index"
          :items="tab"
          valueBg="primary"
          labelBg="yellow-1"
          valueFg="white"
          labelAlign="right"
          valueAlign="left"
          border
          class="col-12 col-sm-6 col-xl-4"
        />
      </div>
    <div style="margin-top: 10px"><span class="af-simple-label">Модуль</span><span>{{record.app}}</span></div>
    <div><span class="af-simple-label">Розділ</span><span>{{record.unit}}</span></div>
    <div><span v-if="record.action" class="af-simple-label">Дія</span><span>{{record.action}}</span></div>
    <div>
      <pre class="af-history-comment" :class="{'af-selectable' : isNotTouch}"><small>{{record.content}}</small></pre>
    </div>

  </div>
</template>

<script>
  // import {} from 'quasar-framework'
  import {mapState, mapGetters} from 'vuex'
  import {formatDateTime} from '../../../routines'
  import {HELP_STATUS} from '../../../constants'
  import {AfFieldValueList} from '../../base'

  export default {
    components: {
      AfFieldValueList
    },
    computed: {
      ...mapState({
        record: state => state.claims.claimRecord,
        compTables () {
          return [
            [
              { label: 'Тип події', value: this.record.claimType },
              { label: 'Подія №', value: this.record.claimPrefix + '-' + this.record.claimNumber },
              { label: 'Пріоритет', value: this.record.priority },
              { label: 'Стан', value: this.record.claimState }
            ],
            [
              { label: 'Зареєстровано', value: formatDateTime(this.record.registeredAt) },
              { label: 'Стан змінено', value: formatDateTime(this.record.changedAt) },
              { label: 'Відпрацювати до', value: formatDateTime(this.record.execTill) },
              { label: 'Стан хелпу', value: HELP_STATUS[this.record.helpSign] }
            ],
            [
              { label: 'Автор', value: this.record.registeredByAgent },
              { label: 'Виконавець', value: this.record.executor },
              { label: 'Реліз виявлення', value: this.record.buildFrom },
              { label: 'Реліз виконання', value: this.record.buildTo }
            ]
          ]
        }
      }),
      ...mapGetters([
        'isNotTouch'
      ])
    },
    updated () {
      const values = this.$refs.fields.querySelectorAll('.af-f-v-list-val')
      let maxValWidth = 0
      for (let i = 0; i < values.length; i++) {
        const w = values[i].children[0].clientWidth
        if (w > maxValWidth) maxValWidth = w
      }
      for (let i = 0; i < values.length; i++) {
        values[i].style.width = maxValWidth + 8 + 'px'
      }
    }
  }
</script>

<style lang="stylus">
  @import '~variables'

  .af-simple-label
    color: $primary
    margin: 1px
    padding: 5px 5px 5px 3px
    width: 50px

</style>

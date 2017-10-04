<!--suppress JSUnusedGlobalSymbols -->
<template>
    <div v-if="record.id">
      <table class="q-table responsive">
        <thead>
        <tr>
          <th>Тип</th>
          <th>Номер</th>
          <th>Зареєстровано</th>
          <th>Автор</th>
          <th>Стан</th>
          <th>Стан змінено</th>
          <th>Пріоритет</th>
          <th>Виконавець</th>
          <th>Відпрацюати до</th>
          <th>Реліз виявлення</th>
          <th>Реліз виконання</th>
          <th>Розділ</th>
          <th>Застосунок</th>
          <th>Дія в розділі</th>
          <th>Стан хелпу</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td data-th="Тип">{{record.claimType}}</td>
          <td data-th="Номер">{{`${record.claimPrefix}-${record.claimNumber}`}}</td>
          <td data-th="Зареєстровано">{{registeredAt}}</td>
          <td data-th="Автор">{{record.registeredByAgent}}</td>
          <td data-th="Стан">{{record.claimState}}</td>
          <td data-th="Стан змінено">{{changedAt}}</td>
          <td data-th="Пріоритет">{{record.priority}}</td>
          <td data-th="Виконавець">{{record.executor}}</td>
          <td data-th="Відпрацюати до">{{execTill}}</td>
          <td data-th="Реліз виявлення">{{record.buildFrom}}</td>
          <td data-th="Реліз виконання">{{record.buildTo}}</td>
          <td data-th="Розділ">{{record.unit}}</td>
          <td data-th="Застосунок">{{record.app}}</td>
          <td data-th="Дія в розділі">{{record.action}}</td>
          <td data-th="Стан хелпу">{{record.helpSign}}</td>
        </tr>
        </tbody>
      </table>
      <div>{{record.content}}</div>
    </div>
</template>

<script>
  // import {} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {formatDateTime} from '../../../routines'

  export default {
    props: [],
    data () {
      return {}
    },
    components: {},
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
</style>

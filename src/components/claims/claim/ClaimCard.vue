<!--suppress JSUnusedGlobalSymbols -->
<template>
    <div v-if="record.id">
      <q-card class="row">
        <q-card-main>
         <q-item class="col-1" display="inline-flex">
          <q-item-main width="15%">
            <q-item-tile width="15%">
           <q-chip :icon="clIconSet" square small color="primary">{{record.claimType}}</q-chip>
            </q-item-tile>
            <q-item-tile width="15%"><q-chip square small color="secondary">
              № {{`${record.claimPrefix}-${record.claimNumber}`}}
            </q-chip></q-item-tile>
            <q-item-tile width="15%">
              <q-chip icon="swap vertical circle" small color="primary">{{record.priority}}</q-chip>
            </q-item-tile>
          </q-item-main>
         </q-item>
          <q-item class="col-2" width="15%" display="inline-flex">
            <q-item-main>
          <q-item-tile>
            Зареєстровано&nbsp; <span>{{registeredAt}}</span>
          </q-item-tile>
          <q-item-tile>
            Стан змінено&nbsp; <span>{{changedAt}}</span>
          </q-item-tile>
          <q-item-tile>
            Відпрацювати до&nbsp; <span>{{execTill}}</span>
          </q-item-tile>
            </q-item-main>
          </q-item>
          <q-item class="col-3" width="15%" display="inline-flex">
            <q-item-main>
              <q-item-tile>
                Автор&nbsp; <span>{{record.registeredByAgent}}</span>
              </q-item-tile>
              <q-item-tile>
                Виконавець&nbsp; <span>{{record.executor}}</span>
              </q-item-tile>
            </q-item-main>
          </q-item>
          <q-item class="col-4" width="15%" display="inline-flex">
            <q-item-main>
              <q-item-tile>
                Реліз виявлення&nbsp; <span>{{record.buildFrom}}</span>
              </q-item-tile>
              <q-item-tile>
                Реліз виконання&nbsp; <span>{{record.buildTo}}</span>
              </q-item-tile>
            </q-item-main>
          </q-item>
          <div>
          <span align="left" width="50%" float="left">{{record.app}}</span>
          <span align="right" width="50%">{{record.unit}}</span>
          </div>
          <div>{{record.content}}</div>
        </q-card-main>
      </q-card>>



      <table class="q-table responsive">
        <thead>
        <tr>
          <th>Стан</th>
          <th>Дія в розділі</th>
          <th>Стан хелпу</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td data-th="Стан">{{record.claimState}}</td>
          <td data-th="Дія в розділі">{{record.action}}</td>
          <td data-th="Стан хелпу">{{record.helpSign}}</td>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
  // import {} from 'quasar-framework'
  import { QCard, QChip, QCardTitle, QCardMain, QItem, QItemSide, QItemMain, QItemTile } from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {formatDateTime} from '../../../routines'

  export default {
    props: [],
    data () {
      return {}
    },
    components: {QCard, QCardMain, QChip, QCardTitle, QItem, QItemSide, QItemMain, QItemTile},
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
</style>

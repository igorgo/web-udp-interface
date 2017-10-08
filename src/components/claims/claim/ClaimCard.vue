<!--suppress JSUnusedGlobalSymbols -->
<template>
    <div v-if="record.id">
      <q-card  :color="clBcolor">
        <q-card-title class="no-padding">
          <q-chip :icon="clIconSet" square color="secondary">{{record.claimType}} № {{`${record.claimPrefix}-${record.claimNumber}`}} </q-chip>
          <q-chip square color="primary">Пріоритет:{{record.priority}}</q-chip>
          <q-chip square color="primary">{{record.claimState}}</q-chip>
          <q-chip square color="primary">Стан хелпу {{record.helpSign}}</q-chip>
          <q-chip square color="primary">Модуль {{record.app}}</q-chip>
        </q-card-title>
        <q-card-main class="row no-padding">
          <q-item class="col-3">
            <q-item-main>
              <af-text-with-label
                caption="Зареєстровано"
                v-bind:value="registeredAt"
              />
              <af-text-with-label
                caption="Стан змінено"
                v-bind:value="changedAt"
              />
              <af-text-with-label
                caption="Відпрацювати до"
                v-bind:value="execTill"
              />
              <af-text-with-label
                caption="Автор"
                v-bind:value="record.registeredByAgent"
              />
              <af-text-with-label
                caption="Виконавець"
                v-bind:value="record.executor"
              />
              <af-text-with-label
                caption="Реліз виявлення"
                v-bind:value="record.buildFrom"
              />
              <af-text-with-label
                caption="Реліз виконання"
                v-bind:value="record.buildTo"
              />
            </q-item-main>
          </q-item>
          <q-item class="col-9 col-md-auto">
            <q-item-main>
            <q-item-tile><span v-if="record.unit">Розділ:</span>{{record.unit}}</q-item-tile>
            <q-item-tile><span v-if="record.action">Дія:</span>{{record.action}}</q-item-tile>
              <q-item-tile>  <pre class="af-history-comment">{{record.content}}</pre> </q-item-tile>
            </q-item-main>
          </q-item>

        </q-card-main>
      </q-card>
    </div>
</template>

<script>
  // import {} from 'quasar-framework'
  import { QCard, QChip, QCardTitle, QCardMain, QItem, QItemSide, QItemMain, QItemTile } from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {formatDateTime} from '../../../routines'
  import AfTextWithLabel from '../../base/AfTextWithLabel.vue'

  export default {
    props: [],
    data () {
      return {}
    },
    components: {
      AfTextWithLabel, QCard, QCardMain, QChip, QCardTitle, QItem, QItemSide, QItemMain, QItemTile},
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

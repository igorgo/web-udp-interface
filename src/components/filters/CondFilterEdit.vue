<template>
  <div class="row justify-center">
    <af-form
      title="Фільтр"
      color="amber-9"
      :titleActions="tActions"
      :bottomActions="bActions"
      :subtitle="filter.name"
      style="max-width: 800px;"
      class="col"
    >
      <af-field-set caption="Реквізити">
        <q-input
          :value="filter.claimNumb"
          @input="updateFilter('claimNumb', $event)"
          float-label="Номер рекламації"
        />
      </af-field-set>
      <af-field-set caption="Система">
        <q-input
          :value="filter.claimUnit"
          @input="updateFilter('claimUnit', $event)"
          float-label="Розділ"
        />
        <q-input
          :value="filter.claimApp"
          @input="updateFilter('claimApp', $event)"
          float-label="Застосунок"
        />
      </af-field-set>
      <af-field-set caption="Реліз">
        <q-input
          :value="filter.claimVersion"
          @input="updateFilter('claimVersion', $event)"
          float-label="Версія"
        />
        <q-input
          :value="filter.claimRelease"
          @input="updateFilter('claimRelease', $event)"
          float-label="Реліз"
        />
        <q-input
          :value="filter.claimBuild"
          @input="updateFilter('claimBuild', $event)"
          float-label="Збірка"
        />
      </af-field-set>
      <af-field-set caption="Власне">
        <q-checkbox
          :value="!!filter.imExecutor"
          @input="updateFilter('imExecutor', $event)"
          label="Я - виконавець"
        />
        <q-checkbox
          :value="!!filter.imExecutor"
          @input="updateFilter('imInitiator', $event)"
          label="Я - автор"
        />
      </af-field-set>
      <af-field-set caption="Зміст">
        <q-input
          :value="filter.claimContent"
          @input="updateFilter('claimContent', $event)"
        />
      </af-field-set>
    </af-form>
    <af-load-cover :mutex="mutex"/>
  </div>
</template>

<script>
  import {AfForm, AfFieldSet, AfLoadCover} from '../base'
  import {QCardTitle, QField, QInput, QCheckbox} from 'quasar'
  import {mapState} from 'vuex'
  import {CLAIM_CONDITION_MODIFY} from '../../store/mutation-types'

  export default {
    components: {
      AfFieldSet,
      AfForm,
      QCardTitle,
      AfLoadCover,
      QField,
      QInput,
      QCheckbox
    },
    data () {
      return {
        tActions: [
          {
            icon: 'save',
            action: 'saveFilter',
            handler: this.saveFilter
          },
          {
            icon: 'fa-eraser',
            action: 'clearForm',
            handler: this.clearForm
          }
        ],
        bActions: [
          {
            caption: 'OK',
            action: 'ok',
            handler: this.saveFilter,
            color: 'primary'
          },
          {
            caption: 'Скасування',
            action: 'cancel',
            handler: this.cancel,
            color: 'negative'
          }
        ]
      }
    },
    methods: {
      saveFilter () {
        alert('saveFilter')
      },
      clearForm () {
        alert('clearForm')
      },
      cancel () {
        this.$router.back()
      },
      updateFilter (key, value) {
        this.$store.commit(CLAIM_CONDITION_MODIFY, {key, value})
      }
    },
    computed: {
      ...mapState({
        mutex: state => state.filters.get_filter_mutex,
        filter: state => state.filters.currentFilter
      })
    }
  }
</script>

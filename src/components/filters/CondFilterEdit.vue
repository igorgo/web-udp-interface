<template>
  <div class="row justify-center">
    <af-form
      title="Фільтр"
      color="amber-9"
      :titleActions="tActions"
      :bottomActions="bActions"
      :subtitle="currentFilter.name"
      style="max-width: 800px;"
      class="col"
    >
      <af-field-set caption="Реквізити">
        <q-input
          :value="currentFilter.claimNumb"
          @input="updateFilter('claimNumb', $event)"
          float-label="Номер рекламації"
        />
      </af-field-set>
      <af-field-set caption="Система">
        <q-input
          :value="currentFilter.claimUnit"
          @input="updateFilter('claimUnit', $event)"
          float-label="Розділ"
        >
          <q-autocomplete
            :staticData="unitsAutoComplete"
            :filter="inclFilter"
          />
        </q-input>
        <q-input
          :value="currentFilter.claimApp"
          @input="updateFilter('claimApp', $event)"
          float-label="Застосунок"
        >
          <q-autocomplete
            :staticData="appsAutoComplete"
            :filter="inclFilter"
          />
        </q-input>
      </af-field-set>
      <af-field-set caption="Реліз">
        <q-select
          float-label="Версія"
          :value="currentFilter.claimVersion"
          :options="versionSelectList"
          multiple
          @change="updateFilter('claimVersion', $event)"
        />
        <q-input
          :value="currentFilter.claimRelease"
          @input="updateFilter('claimRelease', $event)"
          float-label="Реліз"
        />
        <q-input
          :value="currentFilter.claimBuild"
          @input="updateFilter('claimBuild', $event)"
          float-label="Збірка"
        />
      </af-field-set>
      <af-field-set caption="Власне">
        <q-checkbox
          :value="currentFilter.imExecutor"
          @input="updateFilter('imExecutor', $event)"
          label="Я - виконавець"
        />
        <q-checkbox
          :value="currentFilter.imInitiator"
          @input="updateFilter('imInitiator', $event)"
          label="Я - автор"
        />
      </af-field-set>
      <af-field-set caption="Зміст">
        <q-input
          :value="currentFilter.claimContent"
          @input="updateFilter('claimContent', $event)"
        />
      </af-field-set>
    </af-form>
    <af-load-cover :progress="progress"/>
  </div>
</template>

<script>
  import { AfForm, AfFieldSet, AfLoadCover } from '../base'
  import { QCardTitle, QField, QInput, QCheckbox, QAutocomplete, QSelect } from 'quasar'
  import { mapState, mapGetters } from 'vuex'
  import { CLAIM_CONDITION_MODIFY } from '../../store/mutation-types'
  import { inclFilter } from '../../routines'

  export default {
    components: {
      AfFieldSet,
      AfForm,
      QCardTitle,
      AfLoadCover,
      QField,
      QInput,
      QCheckbox,
      QAutocomplete,
      QSelect
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
      },
      inclFilter
    },
    computed: {
      ...mapState({
        progress: state => state.filters.get_filter_progress
      }),
      ...mapGetters([
        'unitsAutoComplete',
        'appsAutoComplete',
        'versionSelectList',
        'currentFilter'
      ])
    }
  }
</script>

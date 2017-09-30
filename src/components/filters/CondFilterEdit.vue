<template>
  <div class="row justify-center">
    <af-form
      title="Фільтр"
      color="amber-9"
      :titleActions="tActions"
      :bottomActions="bActions"
      :subtitle="currentFilterEdit.name"
      style="max-width: 800px;"
      class="col"
    >
      <af-field-set caption="Реквізити">
        <q-input
          :value="currentFilterEdit.claimNumb"
          @input="updateFilter('claimNumb', $event)"
          float-label="Номер рекламації"
        />
      </af-field-set>
      <af-field-set caption="Система">
        <q-input
          :value="currentFilterEdit.claimUnit"
          @input="updateFilter('claimUnit', $event)"
          float-label="Розділ"
        >
          <q-autocomplete
            :staticData="unitsAutoComplete"
            :filter="inclFilter"
          />
        </q-input>
        <q-input
          :value="currentFilterEdit.claimApp"
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
          v-model="currentFilterEdit.claimVersion"
          :options="versionSelectList"
          multiple
          @change="updateFilter('claimVersion', $event)"
        />
        <q-select
          float-label="Реліз"
          :value="currentFilterEdit.claimRelease.value"
          :options="releaseSelectList"
          multiple
          :disable="currentFilterEdit.claimRelease.disable"
          @change="updateFilter('claimRelease', $event)"
        />
        <q-select
          float-label="Збірка"
          :value="currentFilterEdit.claimBuild.value"
          :options="buildsSelectList"
          multiple
          :disable="currentFilterEdit.claimBuild.disable"
          @change="updateFilter('claimBuild', $event)"
        />
      </af-field-set>
      <af-field-set caption="Власне">
        <q-checkbox
          :value="currentFilterEdit.imExecutor"
          @input="updateFilter('imExecutor', $event)"
          label="Я - виконавець"
        />
        <q-checkbox
          :value="currentFilterEdit.imInitiator"
          @input="updateFilter('imInitiator', $event)"
          label="Я - автор"
        />
      </af-field-set>
      <af-field-set caption="Зміст">
        <q-input
          :value="currentFilterEdit.claimContent"
          @input="updateFilter('claimContent', $event)"
        />
      </af-field-set>
    </af-form>
    <af-load-cover :progress="progress"/>
  </div>
</template>

<script>
  import {AfForm, AfFieldSet, AfLoadCover} from '../base'
  import {QCardTitle, QField, QInput, QCheckbox, QAutocomplete, QSelect} from 'quasar'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {inclFilter} from '../../routines'

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
      cancel () {
        this.$router.back()
      },
      updateFilter (key, value) {
        void this.$store.dispatch('modifyFilterField', { key, value })
      },
      inclFilter,
      ...mapActions([
        'clearFilterForm'
      ])
    },
    computed: {
      ...mapState({
        progress: state => state.filters.getFilterInProgress,
        invokedByClaims: state => state.filters.invokedByClaims
      }),
      ...mapGetters([
        'unitsAutoComplete',
        'appsAutoComplete',
        'versionSelectList',
        'releaseSelectList',
        'buildsSelectList',
        'currentFilterEdit'
      ]),
      tActions () {
        let r = []
        if (this.invokedByClaims) {
          r.push({
            icon: 'save',
            action: 'saveFilter',
            handler: this.saveFilter
          })
        }
        r.push({
          icon: 'fa-eraser',
          action: 'clearForm',
          handler: this.clearFilterForm
        })
        return r
      }

    }
  }
</script>

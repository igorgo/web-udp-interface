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
      <q-btn
        icon="edit"
        small
        round
        flat
        slot="after-subtitle"
        @click="editName(true)"
      />
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
    <q-modal ref="nameEditModal" minimized :content-css="{padding: '10px'}">
      <h6>Найменуваня фільтра</h6>
      <q-input
        ref="nameEditInput"
        v-model="filterName"
      />
      <q-btn flat color="positive" @click="setFilterName" :disable="!nameEditModalValidator">OK</q-btn>
      <q-btn flat color="negative" @click="$refs['nameEditModal'].close()">Скасування</q-btn>
    </q-modal>
  </div>
</template>

<script>
  import {AfForm, AfFieldSet, AfLoadCover} from '../base'
  import {QCardTitle, QField, QInput, QCheckbox, QAutocomplete, QSelect, QBtn, QModal, Dialog} from 'quasar-framework'
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
      QSelect,
      QBtn,
      QModal
    },
    data () {
      return {
        filterName: '',
        justSave: true,
        eventMapper: {
          'filter:saved': this.onFilterSaved,
          'filter:deleted': this.onFilterDeleted
        }
      }
    },
    methods: {
      apply () {
        this.finishEdit()
      },
      saveApply () {
        this.editName(false)
      },
      onFilterSaved () {
        if (this.invokedByClaims) {
          void this.$store.dispatch('setCurrentCondition', {
            socket: null,
            value: this.currentFilterEdit.name ? this.currentFilterEdit.rn : null
          })
        }
        this.$router.back()
      },
      save () {
        if (this.currentFilterEdit.name) {
          this.finishEdit()
        }
        else {
          this.editName(false)
        }
      },
      cancel () {
        this.$router.back()
      },
      updateFilter (key, value) {
        void this.$store.dispatch('modifyFilterField', { key, value })
      },
      setFilterName () {
        this.updateFilter('name', this.filterName)
        this.$refs['nameEditModal'].close()
        !this.justSave && this.finishEdit(this.invokedByClaims ? null : this.currentFilterEdit.rn)
      },
      finishEdit () {
        void this.$store.dispatch('saveConditionFilter', {socket: this.$socket})
      },
      inclFilter,
      ...mapActions([
        'clearFilterForm'
      ]),
      editName (justSave) {
        this.filterName = this.currentFilterEdit.name
        this.justSave = justSave
        this.$refs['nameEditModal'].open()
      },
      onFilterDeleted () {
        this.$router.back()
      },
      doDelete () {
        void this.$store.dispatch('deleteConditionFilter', {socket: this.$socket})
      },
      deleteFilter () {
        Dialog.create({
          title: 'Видалити',
          message: `Ви дійсно бажаєте видалити фільтр «${this.currentFilterEdit.name}»?`,
          buttons: [
            {
              label: 'Так',
              color: 'positive',
              flat: true,
              handler: this.doDelete
            },
            {
              label: 'Ні',
              color: 'negative',
              flat: true
            }
          ]
        })
      }
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
      bActions () {
        let r = []
        if (this.invokedByClaims) {
          r.push({
            caption: 'Застосувати',
            action: 'apply',
            handler: this.apply,
            color: 'primary'
          }, {
            caption: 'Зберегти та застосувати',
            action: 'saveApply',
            handler: this.saveApply,
            color: 'primary'
          })
        }
        else {
          r.push({
            caption: 'Зберегти',
            action: 'save',
            handler: this.save,
            color: 'primary'
          })
        }
        r.push({
          caption: 'Скасування',
          action: 'cancel',
          handler: this.cancel,
          color: 'negative'
        })
        return r
      },
      tActions () {
        let r = []
        if (!this.invokedByClaims) {
          r.push({
            icon: 'delete',
            action: 'deleteFilter',
            handler: this.deleteFilter
          })
        }
        r.push({
          icon: 'fa-eraser',
          action: 'clearForm',
          handler: this.clearFilterForm
        })
        return r
      },
      nameEditModalValidator () {
        return this.filterName && this.filterName.trim().length > 0
      }
    },
    created () {
      for (let i in this.eventMapper) {
        if (this.eventMapper.hasOwnProperty(i)) this.$q.events.$on(i, this.eventMapper[i])
      }
    },
    beforeDestroy () {
      for (let i in this.eventMapper) {
        if (this.eventMapper.hasOwnProperty(i)) this.$q.events.$off(i, this.eventMapper[i])
      }
    }
  }
</script>

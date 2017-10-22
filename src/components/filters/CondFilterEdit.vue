<template>
  <div class="row justify-center relative-position">
    <af-form
      title="Фільтр"
      :subtitle="currentFilterEdit.name"
      style="max-width: 800px;"
      class="col"
      :scrollable="812"
      on-layout
    >
      <q-btn
        icon="edit"
        small
        round
        flat
        slot="after-subtitle"
        @click="editName(true)"
      />
      <div>
        <af-field-set class="hidden"></af-field-set>
        <af-field-set caption="Реквізити">
          <af-input
            :value="currentFilterEdit.claimNumb"
            @input="updateFilter('claimNumb', $event)"
            label="Номер рекламації"
          />
        </af-field-set>
        <af-field-set caption="Система">
          <af-autocomplete
            :value="currentFilterEdit.claimUnit"
            @input="updateFilter('claimUnit', $event)"
            label="Розділ"
            :staticData="unitsAutoComplete"
            :filter="inclFilter"
          />
          <af-autocomplete
            :value="currentFilterEdit.claimApp"
            @input="updateFilter('claimApp', $event)"
            label="Застосунок"
            :staticData="appsAutoComplete"
            :filter="inclFilter"
          />
        </af-field-set>
        <af-field-set caption="Реліз">
          <af-multi-select
            label="Версія"
            v-model="currentFilterEdit.claimVersion"
            :options="versionSelectList"
            @change="updateFilter('claimVersion', $event)"
          />
          <af-multi-select
            label="Реліз"
            :value="currentFilterEdit.claimRelease.value"
            :options="releaseSelectList"
            :disable="currentFilterEdit.claimRelease.disable"
            @change="updateFilter('claimRelease', $event)"
          />
          <af-multi-select
            label="Збірка"
            :value="currentFilterEdit.claimBuild.value"
            :options="buildsSelectList"
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
          <af-input
            :value="currentFilterEdit.claimContent"
            @input="updateFilter('claimContent', $event)"
          />
        </af-field-set>
      </div>
      <q-btn
        v-if="invokedByClaims"
        flat
        color="primary"
        @click="finishEdit"
        slot="bottom-buttons"
      >Застосувати
      </q-btn>
      <q-btn
        v-if="invokedByClaims"
        flat
        color="primary"
        @click="saveApply"
        slot="bottom-buttons"
      >Зберегти та застосувати
      </q-btn>
      <q-btn
        v-if="!invokedByClaims"
        flat
        color="primary"
        @click="save"
        slot="bottom-buttons"
      >Зберегти
      </q-btn>
      <q-btn
        flat
        color="negative"
        @click="cancel"
        slot="bottom-buttons"
      >Скасування
      </q-btn>
      <q-btn
        v-if="currentFilterEdit.rn"
        small
        round
        flat
        slot="titleActions"
        :icon="'delete'"
        @click="deleteFilter"
        class="float-right"
      />
      <q-btn
        small
        round
        flat
        slot="titleActions"
        :icon="'fa-eraser'"
        @click="clearFilterForm"
        class="float-right"
      />
    </af-form>
    <af-load-cover :progress="isActionInProgress"/>
    <q-modal ref="nameEditModal" minimized :content-css="{padding: '10px'}">
      <h6>Найменуваня фільтра</h6>
      <af-input
        ref="nameEditInput"
        v-model="filterName"
      />
      <q-btn flat color="positive" @click="setFilterName" :disable="!nameEditModalValidator">OK</q-btn>
      <q-btn flat color="negative" @click="$refs['nameEditModal'].close()">Скасування</q-btn>
    </q-modal>
  </div>
</template>

<script>
  import {AfForm, AfFieldSet, AfLoadCover, AfInput, AfAutocomplete, AfMultiSelect} from '../base'
  import {QCardTitle, QCheckbox, QBtn, QInput, QModal, Dialog} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {inclFilter} from '../../routines'

  export default {
    components: {
      AfFieldSet,
      AfForm,
      QCardTitle,
      AfLoadCover,
      QCheckbox,
      QBtn,
      QModal,
      QInput,
      AfInput,
      AfAutocomplete,
      AfMultiSelect
    },
    data () {
      return {
        filterName: '',
        justSave: true,
        eventsMap: {
          'filter:saved': this.onFilterSaved,
          'filter:deleted': this.onFilterDeleted
        }
      }
    },
    methods: {
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
        void this.$store.dispatch('conditionSetDoNotUpdate', true)
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
        void this.$store.dispatch('saveConditionFilter', { socket: this.$socket })
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
        void this.$store.dispatch('deleteConditionFilter', { socket: this.$socket })
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
        invokedByClaims: state => state.filters.invokedByClaims
      }),
      ...mapGetters([
        'unitsAutoComplete',
        'appsAutoComplete',
        'versionSelectList',
        'releaseSelectList',
        'buildsSelectList',
        'currentFilterEdit',
        'isActionInProgress'
      ]),
      nameEditModalValidator () {
        return this.filterName && this.filterName.trim().length > 0
      }
    },
    created () {
      for (let i in this.eventsMap) {
        if (this.eventsMap.hasOwnProperty(i)) this.$q.events.$on(i, this.eventsMap[i])
      }
    },
    beforeDestroy () {
      for (let i in this.eventsMap) {
        if (this.eventsMap.hasOwnProperty(i)) this.$q.events.$off(i, this.eventsMap[i])
      }
    }
  }
</script>

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
          <af-multi-select
            label="Тип"
            v-model="currentFilterEdit.claimType"
            :options="typeOptions"
            @change="updateFilter('claimType', $event)"
          />
          <af-multi-select
            label="Поточний стан"
            v-model="currentFilterEdit.claimStatus"
            :options="statusesSelect"
            @change="updateFilter('claimStatus', $event)"
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
        <af-field-set caption="Персони">
          <div class="row items-center">
            <div class="col-sm-9 col-12">
              <af-select
                label="Виконавець"
                :value="currentFilterEdit.claimExecutor"
                @input="updateFilter('claimExecutor', $event)"
                :options="personSelect"
                clearable
              />
            </div>
            <div class="col-sm-3 col-12">
              <q-checkbox
                :value="currentFilterEdit.imExecutor"
                @input="updateFilter('imExecutor', $event)"
                label="Я - виконавець"
                class="on-right"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-sm-9 col-12">
              <af-select
                label="Автор"
                :value="currentFilterEdit.claimAuthor"
                @input="updateFilter('claimAuthor', $event)"
                :options="personSelect"
                clearable
              />
            </div>
            <div class="col-sm-3 col-12">
              <q-checkbox
                :value="currentFilterEdit.imInitiator"
                @input="updateFilter('imInitiator', $event)"
                label="Я - автор"
                class="on-right"
              />
            </div>
          </div>
        </af-field-set>
        <af-field-set caption="Зміст/Коментар">
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
  import {AfForm, AfFieldSet, AfLoadCover, AfInput, AfAutocomplete, AfMultiSelect, AfSelect} from '../base'
  import {QCardTitle, QCheckbox, QBtn, QInput, QModal, Dialog} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {inclFilter} from '../../routines'
  import {CLAIM_TYPE_OPTIONS} from '../../constants'
  import {
    AE_COND_CLAIMS_SAVED,
    AE_COND_CLAIMS_DELETED
  } from '../../app-events'

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
      AfMultiSelect,
      AfSelect
    },
    data () {
      return {
        filterName: '',
        justSave: true,
        eventsMap: {
          [AE_COND_CLAIMS_SAVED]: this.onFilterSaved,
          [AE_COND_CLAIMS_DELETED]: this.onFilterDeleted
        },
        typeOptions: CLAIM_TYPE_OPTIONS
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
        'isActionInProgress',
        'statusesSelect',
        'personSelect'
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

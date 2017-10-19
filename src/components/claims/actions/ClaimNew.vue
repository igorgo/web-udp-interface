<template>
  <af-modal-form ref="form"
                 title="Додавання рекламації"
                 :valid="__validate()"
                 :okHandle="__onOkClick"
                 @close="__close"
  >
    <div></div>
    <af-field-set caption="Параметри">
      <div class="row">
        <div class="col-xs-6 col-sm-3">
          <q-option-group
            type="radio"
            v-model="recType"
            :options="recTypes"
          />
        </div>
        <div class="col-xs-6 col-sm-9 row items-center xs-gutter">
          <div class="col-sm-8">
            <af-input
              type="number"
              :min="1"
              :max="10"
              label="Пріоритет"
              v-model="recPriority"
              required
            />
          </div>
          <div class="col-sm-4 float-right">
            <q-checkbox
              v-model="recSendToProgr"
              label="На розгляд"
            />
          </div>
        </div>
      </div>
      <div>
        <af-select
          label="Ініціатор"
          v-model="recAuthor"
          :options="initiatorSelect"
        />
      </div>
      <div>
        <af-autocomplete
          v-model="recUnit"
          label="Розділ"
          :staticData="unitsAutoComplete"
          :filter="inclFilter"
          @change="onUnitChange"
        />
      </div>
      <div>
        <af-select
          label="Застосунок"
          v-model="recApps"
          :options="appsByUnits"
          multiple
          :disable="appsDisabled"
        />
      </div>
      <div>
        <af-select
          label="Дія в розділі"
          v-model="recFuncs"
          :options="funcsByUnits"
          multiple
          :disable="funcsDisabled"
        />
      </div>
    </af-field-set>
    <af-field-set caption="Реліз, що використовується">
      <div>
        <af-select
          ref="versFrom"
          label="Версія"
          v-model="recVersion"
          :options="versionSelectList"
        />
      </div>
      <!--af-multi-select
        label="Реліз"
        :value="currentFilterEdit.claimRelease.value"
        :options="releaseSelectList"
        :disable="currentFilterEdit.claimRelease.disable"
        @change="updateFilter('claimRelease', $event)"
      /-->
      <!--af-multi-select
        label="Збірка"
        :value="currentFilterEdit.claimBuild.value"
        :options="buildsSelectList"
        :disable="currentFilterEdit.claimBuild.disable"
        @change="updateFilter('claimBuild', $event)"
      /-->
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {AfModalForm, AfFieldSet, AfInput, AfSelect, AfAutocomplete} from '../../base'
  import {QOptionGroup, QCheckbox} from 'quasar-framework'
  import {CLAIM_TYPE_OPTIONS} from '../../../constants'
  import {mapGetters} from 'vuex'
  import {inclFilter} from '../../../routines'

  export default {
    data () {
      return {
        isOpen: false,
        recType: 'ДОРАБОТКА',
        recTypes: CLAIM_TYPE_OPTIONS,
        recPriority: 5,
        recSendToProgr: false,
        recAuthor: -1,
        recUnit: '',
        recApps: [],
        recFuncs: [],
        recVersion: ''
      }
    },
    props: {},
    computed: {
      ...mapGetters([
        'initiatorSelect',
        'unitsAutoComplete',
        'appsByUnits',
        'funcsByUnits',
        'versionSelectList'
      ]),
      appsDisabled () {
        return this.recUnit && (this.appsByUnits.length === 0)
      },
      funcsDisabled () {
        return this.recUnit && (this.funcsByUnits.length === 0)
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      QOptionGroup,
      AfSelect,
      AfInput,
      QCheckbox,
      AfAutocomplete
    },
    methods: {
      __validate () {
        return true
      },
      __onOkClick () {
        console.log('__onOkClick')
        this.close()
      },
      open () {
        console.log(this.$store.state.main.curReleases['stable'].version)
        this.$refs.form.open()
        this.recVersion = this.$store.state.main.curReleases['stable'].version
        this.$emit('open')
      },
      close () {
        this.$refs.form.close()
      },
      __close () {
        this.$emit('close')
      },
      onUnitChange () {
        this.recApps = []
        this.recFuncs = []
        void this.$store.dispatch('getAppsByUnits', {socket: this.$socket, units: this.recUnit})
      },
      inclFilter
    }
  }
</script>

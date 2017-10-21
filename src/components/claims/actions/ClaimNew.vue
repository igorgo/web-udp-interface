<template>
  <af-modal-form ref="form"
                 title="Додавання рекламації"
                 :valid="__validate()"
                 :okHandle="__onOkClick"
                 @close="__close"
                 :scrollable="800"
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
        <div class="col-xs-6 col-sm-9 row items-center xs-gutter" v-if="isPmo">
          <div class="col-sm-8">
            <af-input
              ref="prior"
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
      <div v-if="isPmo">
        <af-select
          label="Ініціатор"
          v-model="recAuthor"
          :options="initiatorSelect"
          clearable
        />
      </div>
      <div>
        <af-autocomplete
          ref="unit"
          v-model="recUnit"
          label="Розділ"
          :staticData="unitsAutoComplete"
          :filter="inclFilter"
          @change="onUnitChange"
          required
        />
      </div>
      <div>
        <af-select
          ref="app"
          label="Застосунок"
          v-model="recApps"
          :options="appsByUnits"
          multiple
          :disabled="appsDisabled"
          required
          clearable
        />
      </div>
      <div>
        <af-select
          label="Дія в розділі"
          v-model="recFuncs"
          :options="funcsByUnits"
          multiple
          :disabled="funcsDisabled"
          clearable
        />
      </div>
    </af-field-set>
    <af-field-set caption="Реліз, що використовується">
      <div class="row xs-gutter no-vert-gutter">
        <div class="col-12 col-sm-4">
          <af-select
            ref="relFrom"
            label="Реліз"
            v-model="recRelease"
            :options="activeReleasesForSelect"
            required
            clearable
            @change="onRelChange"
          />
        </div>
        <div class="col-12 col-sm-8">
          <af-select
            ref="bldFrom"
            label="Збірка"
            v-model="recBuild"
            :options="buildSelectList"
            required
            clearable
            :disabled="!recRelease"
          />
        </div>
      </div>
    </af-field-set>
    <af-field-set caption="Реліз виконання" v-if="isPmo">
      <div class="row xs-gutter no-vert-gutter">
        <div class="col">
          <af-select
            ref="relTo"
            label="Реліз"
            v-model="recReleaseTo"
            :options="activeReleasesForSelect"
            :required="recSendToProgr"
            clearable
          />
        </div>
      </div>
    </af-field-set>
    <af-field-set caption="Зміст">
      <af-input
        ref="cont"
        type="textarea"
        :min-rows="5"
        v-model="recContent"
        fixed-font
        required
      />
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {AfModalForm, AfFieldSet, AfInput, AfSelect, AfAutocomplete} from '../../base'
  import {QOptionGroup, QCheckbox} from 'quasar-framework'
  import {CLAIM_TYPE_OPTIONS} from '../../../constants'
  import {mapGetters} from 'vuex'
  import {inclFilter, mapEvent} from '../../../routines'

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
        recRelease: '',
        recBuild: '',
        recReleaseTo: '',
        recContent: '',
        eventMapper: {
          'claims:inserted': this.__onClaimInserted
        }
      }
    },
    props: {},
    computed: {
      ...mapGetters([
        'initiatorSelect',
        'unitsAutoComplete',
        'appsByUnits',
        'funcsByUnits',
        'activeReleasesForSelect'
      ]),
      isPmo () {
        return this.$store.state.auth.isPmo
      },
      appsDisabled () {
        return this.recUnit && (this.appsByUnits.length === 0)
      },
      funcsDisabled () {
        return this.recUnit && (this.funcsByUnits.length === 0)
      },
      buildSelectList () {
        return this.$store.getters.activeBuildsForSelect(this.recRelease)
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
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.unit.__valid &&
          this.$refs.app.__valid &&
          this.$refs.relFrom.__valid &&
          this.$refs.bldFrom.__valid &&
          this.$refs.cont.__valid &&
          (!this.$refs.prior || this.$refs.prior.__valid) &&
          (!this.$refs.relTo || this.$refs.relTo.__valid)
      },
      __onOkClick () {
        void this.$store.dispatch('doClaimInsert', {
          socket: this.$socket,
          cType: this.recType,
          cPriority: this.recPriority,
          cSend: this.recSendToProgr ? 1 : 0,
          cInit: this.recAuthor >= 0 ? this.$store.state.staticDicts.allPersons[this.recAuthor].code : null,
          cApp: this.recApps.join(';'),
          cUnit: this.recUnit,
          cFunc: this.recFuncs.join(';'),
          cContent: this.recContent,
          cRelFrom: this.recRelease,
          cBldFrom: this.recBuild,
          cRelTo: this.recReleaseTo
        })
      },
      open () {
        this.$refs.form.open()
        this.$refs.relFrom.__change(this.$store.state.main.curReleases['stable'].releaseName)
      },
      close () {
        this.$refs.form.close()
      },
      __onClaimInserted () {
        this.$emit('complete')
        this.close()
      },
      __close () {
        this.$emit('close')
      },
      onUnitChange () {
        this.recApps = []
        this.recFuncs = []
        void this.$store.dispatch('getAppsByUnits', { socket: this.$socket, units: this.recUnit })
      },
      onRelChange (val) {
        this.recBuild = ''
      },
      inclFilter
    },
    created () {
      mapEvent(this, true)
    },
    beforeDestroy () {
      mapEvent(this, false)
    }
  }
</script>

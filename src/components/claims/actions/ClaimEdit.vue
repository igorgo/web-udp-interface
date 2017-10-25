<template>
  <af-modal-form ref="form"
                 title="Виправлення рекламації"
                 :valid="validate()"
                 :okHandle="onOkClick"
                 :scrollable="720"
  >
    <div></div>
    <af-field-set caption="Параметри">
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
          :disable="appsDisabled"
          required
          clearable
        />
      </div>
      <div>
        <af-select
          ref="func"
          label="Дія в розділі"
          v-model="recFuncs"
          :options="funcsByUnits"
          multiple
          :disable="funcsDisabled"
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
            :disable="!recRelease"
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
            :required="hasHistory"
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
        :disable="hasHistory"
      />
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {AfModalForm, AfFieldSet, AfInput, AfSelect, AfAutocomplete, AfMfMixin} from '../../base'
  import {mapGetters} from 'vuex'
  import {inclFilter} from '../../../routines'
  import {AE_CLAIMS_REC_UPDATED} from '../../../app-events'

  export default {
    data () {
      return {
        isOpen: false,
        recUnit: '',
        recApps: [],
        recFuncs: [],
        recRelease: '',
        recBuild: '',
        recReleaseTo: '',
        recContent: ''
      }
    },
    mixins: [AfMfMixin],
    computed: {
      ...mapGetters([
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
      },
      hasHistory () {
        return this.$store.state.claims.claimHistory.length > 0
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      AfSelect,
      AfInput,
      AfAutocomplete
    },
    methods: {
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.unit.isValid &&
          this.$refs.app.isValid &&
          this.$refs.relFrom.isValid &&
          this.$refs.bldFrom.isValid &&
          this.$refs.cont.isValid &&
          (!this.$refs.relTo || this.$refs.relTo.isValid)
      },
      onOkClick () {
        this.$q.events.$once(AE_CLAIMS_REC_UPDATED, this.__onClaimUpdated)
        void this.$store.dispatch('doClaimUpdate', {
          socket: this.$socket,
          cId: this.$store.state.claims.claimRecord.id,
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
        const r = this.$store.state.claims.claimRecord
        this.recUnit = r.unit
        this.recApps = r.app ? r.app.split(';') : []
        this.recFuncs = r.action ? r.action.split(';') : []
        this.recRelease = r.relFrom
        this.recBuild = r.buildFrom
        this.recReleaseTo = r.relTo
        this.recContent = r.content
        this.$refs.form.open()
      },
      __onClaimUpdated () {
        this.$store.dispatch('getClaimRecord', { socket: this.$socket, idx: null })
        this.$refs.form.close()
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
    }
  }
</script>

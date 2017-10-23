<template>
  <af-modal-form ref="form"
                 :title="formTitle"
                 :valid="validate()"
                 :okHandle="onOkClick"
                 :scrollable="formMaxHeight"
  >
    <af-field-set class="hidden"/>
    <af-field-set caption="Новий статус">
      <div class="row">
        <af-select
          class="col"
          ref="status"
          label="Статус"
          v-model="cStatus"
          :options="statusesOptions"
          :disable="statusesIsEmpty"
          required
          @change="onStatusChanged"
        />
      </div>
      <div class="row">
        <af-select
          v-show="!executorsIsEmpty"
          class="col"
          ref="executor"
          label="Виконавець"
          v-model="cSend"
          :options="executors"
          :required="needExecutors"
        />
      </div>
    </af-field-set>
    <af-field-set v-if="needRelease" caption="Реліз виконання">
      <div class="row xs-gutter no-vert-gutter">
        <div class="col-12">
          <af-select
            ref="relTo"
            label="Реліз"
            v-model="cRelTo"
            :options="activeReleasesForSelect"
            :required="needRelease"
          />
        </div>
        <div class="col-12">
          <af-select
            v-show="needBuild"
            ref="bldTo"
            label="Збірка"
            v-model="cBldTo"
            :options="buildSelectList"
            :required="needBuild"
            :disable="!cRelTo"
          />
        </div>
        <div v-show="!needBuild" class="col-12">
          <af-input
            ref="priority"
            type="number"
            :min="1"
            :max="10"
            label="Пріоритет"
            v-model="cPriority"
            required
          />
        </div>
      </div>
    </af-field-set>
    <af-field-set caption="Коментар">
      <af-select
        ref="noteHeader"
        label="Тип"
        v-model="cNoteHeader"
        :options="headers"
        required
      />
      <af-input
        ref="note"
        type="textarea"
        :min-rows="5"
        v-model="cNote"
        fixed-font
      />
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {} from 'quasar-framework'
  import {mapState, mapGetters} from 'vuex'
  import {AfEventsMapper, AfModalForm, AfMfMixin, AfFieldSet, AfSelect, AfInput} from '../../base'
  import {NOTES_HEADER_OPTIONS, DEFAULT_HEADER, DEFAULT_HEADER_INST} from '../../../constants'

  export default {
    mixins: [AfMfMixin, AfEventsMapper],
    data () {
      return {
        eventsMap: {
          'app:nextpoints:got': this.setStatusOptions,
          'app:nextexecs:got': this.setExecsOptions,
          'app:clame:status:done': this.onActionComplete
        },
        formTitle: 'Зміна статусу',
        formMaxHeight: 600,
        cStatus: null,
        cSend: null,
        cRelTo: null,
        cBldTo: null,
        cPriority: null,
        statuses: {},
        statusesOptions: [],
        executors: [],
        cNote: null,
        cNoteHeader: null,
        headers: NOTES_HEADER_OPTIONS,
        needExecutors: true,
        needRelease: false,
        needBuild: false
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      AfSelect,
      AfInput
    },
    methods: {
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.status.isValid &&
          (this.$refs.executor ? this.$refs.executor.isValid : true) &&
          (this.$refs.relTo ? this.$refs.relTo.isValid : true) &&
          (this.$refs.bldTo ? this.$refs.bldTo.isValid : true) &&
          (this.$refs.priority ? this.$refs.priority.isValid : true) &&
          this.$refs.noteHeader.isValid &&
          this.$refs.note.isValid
      },
      onOkClick () {
        void this.$store.dispatch('doClaimStatus', {
          socket: this.$socket,
          cStatus: this.statuses[this.cStatus].statCode,
          cSendTo: this.cSend,
          cNoteHeader: this.cNoteHeader,
          cNote: this.cNote,
          cPriority: this.cPriority,
          cRelTo: this.cRelTo,
          cBldTo: this.cBldTo
        })
      },
      open () {
        // init field values
        this.$refs.form.open()
        this.cRelTo = this.claimRec.relTo
        this.statuses = {}
        this.statusesOptions = []
        this.executors = []
        this.needExecutors = true
        this.cStatus = null
        this.needRelease = false
        this.needBuild = false
        this.cSend = null
        this.cBldTo = this.claimRec.buildTo
        this.cPriority = this.claimRec.priority
        this.cNote = null
        this.cNoteHeader = DEFAULT_HEADER
        void this.$store.dispatch('claimGetNextPoints', { socket: this.$socket })
        this.$refs.relTo && this.$refs.relTo.$on('change', this.onRelChange)
      },
      setStatusOptions (points) {
        this.statusesOptions = points.map(p => ({label: p.statCode, value: p.statId}))
        points.forEach(p => { this.statuses[p.statId] = {statCode: p.statCode, statType: p.statType} })
      },
      setExecsOptions (options) {
        this.executors = options
        this.needExecutors = options.length > 0
      },
      onStatusChanged (val) {
        this.needRelease = this.statuses[val].statType > 0
        this.needBuild = this.statuses[val].statType === 2
        this.cNoteHeader = this.needBuild ? DEFAULT_HEADER_INST : DEFAULT_HEADER
        this.cSend = null
        this.executors = []
        this.needExecutors = true
        this.cRelTo = this.claimRec.relTo
        this.cBldTo = this.claimRec.buildTo
        this.cPriority = this.claimRec.priority
        void this.$store.dispatch('claimGetNextExecs', { socket: this.$socket, pointId: val })
      },
      onRelChange () {
        this.cBldTo = ''
      },
      onActionComplete () {
        this.$store.dispatch('getClaimRecord', { socket: this.$socket, idx: null })
        this.$refs.form.close()
      }
    },
    computed: {
      ...mapState({
        claimRec: state => state.claims.claimRecord
      }),
      ...mapGetters([
        'activeReleasesForSelect'
      ]),
      statusesIsEmpty () {
        return this.statusesOptions.length === 0
      },
      executorsIsEmpty () {
        return this.executors.length === 0
      },
      buildSelectList () {
        return this.$store.getters.activeBuildsForSelect(this.cRelTo)
      }
    }
  }
</script>

<style lang="stylus">
</style>

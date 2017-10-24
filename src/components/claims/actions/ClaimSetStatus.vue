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
    <claim-note-field-set
      ref="comment"
      v-model="noteObj"
    />
  </af-modal-form>
</template>

<script>
  import {} from 'quasar-framework'
  import {mapState, mapGetters} from 'vuex'
  import {AfModalForm, AfMfMixin, AfFieldSet, AfSelect, AfInput} from '../../base'
  import ClaimNoteFieldSet from './ClaimNoteFieldSet.vue'
  import {DEFAULT_HEADER, DEFAULT_HEADER_INST} from '../../../constants'

  export default {
    mixins: [AfMfMixin],
    data () {
      return {
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
        noteObj: {
          note: null,
          header: null
        },
        needExecutors: true,
        needRelease: false,
        needBuild: false
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      AfSelect,
      AfInput,
      ClaimNoteFieldSet
    },
    methods: {
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.status.isValid &&
          (this.$refs.executor ? this.$refs.executor.isValid : true) &&
          (this.$refs.relTo ? this.$refs.relTo.isValid : true) &&
          (this.$refs.bldTo ? this.$refs.bldTo.isValid : true) &&
          (this.$refs.priority ? this.$refs.priority.isValid : true) &&
          this.$refs.comment.$refs.noteHeader.isValid &&
          this.$refs.comment.$refs.note.isValid
      },
      onOkClick () {
        this.$q.events.$once('app:clame:status:done', this.onActionComplete)
        void this.$store.dispatch('doClaimStatus', {
          socket: this.$socket,
          cStatus: this.statuses[this.cStatus].statCode,
          cSendTo: this.cSend,
          cNoteHeader: this.noteObj.header,
          cNote: this.noteObj.note,
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
        this.noteObj.note = null
        this.noteObj.header = DEFAULT_HEADER
        this.$q.events.$once('app:nextpoints:got', this.setStatusOptions)
        void this.$store.dispatch('claimGetNextPoints', { socket: this.$socket })
        this.$refs.relTo && this.$refs.relTo.$on('change', this.onRelChange)
      },
      setStatusOptions (points) {
        this.statusesOptions = points.map(p => ({ label: p.statCode, value: p.statId }))
        points.forEach(p => {
          this.statuses[p.statId] = { statCode: p.statCode, statType: p.statType }
        })
      },
      setExecsOptions (options) {
        this.executors = options
        this.needExecutors = options.length > 0
      },
      onStatusChanged (val) {
        this.needRelease = this.statuses[val].statType > 0
        this.needBuild = this.statuses[val].statType === 2
        this.noteObj.header = this.needBuild ? DEFAULT_HEADER_INST : DEFAULT_HEADER
        this.cSend = null
        this.executors = []
        this.needExecutors = true
        this.cRelTo = this.claimRec.relTo
        this.cBldTo = this.claimRec.buildTo
        this.cPriority = this.claimRec.priority
        this.$q.events.$once('app:nextexecs:got', this.setExecsOptions)
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

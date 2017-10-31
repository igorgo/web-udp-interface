<template>
  <af-modal-form ref="form"
                 :title="formTitle"
                 :valid="validate()"
                 :okHandle="onOkClick"
                 :scrollable="formMaxHeight"
                 :maximized="false"
                 :minimized="true"
  >
    <af-field-set caption="Пріоритет">
      <div class="row">
        <div class="col">
          <af-input
            ref="priority"
            type="number"
            :min="1"
            :max="10"
            v-model="priority"
            required
          />
        </div>
      </div>
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {AfModalForm, AfMfMixin, AfFieldSet, AfInput} from '../../base'
  import {AE_PROGRESS_SET} from '../../../app-events'
  import {sockOk, SE_CLAIMS_PRIRITIZE} from '../../../socket-events'

  export default {
    name: '',
    mixins: [AfMfMixin],
    props: [],
    data () {
      return {
        formTitle: 'Змінити пріоритет',
        formMaxHeight: 300, // change this,
        priority: 5,
        id: null
      }
    },
    components: {
      AfModalForm,
      AfFieldSet,
      AfInput
    },
    methods: {
      ...mapActions([
      ]),
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        return this.$refs.priority.isValid
      },
      onOkClick () {
        this.$q.events.$emit(AE_PROGRESS_SET)
        this.$q.events.$once(sockOk(SE_CLAIMS_PRIRITIZE), this.__complete)
        this.$socket.emit(SE_CLAIMS_PRIRITIZE, {
          sessionID: this.sessionID,
          id: this.id,
          priority: this.priority
        })
      },
      __complete () {
        this.$store.dispatch('getClaimRecord', {socket: this.$socket, idx: null})
        this.$refs.form.close()
      },
      open () {
        this.priority = this.claimRecord.priority
        this.id = this.claimRecord.id
        this.$refs.form.open()
      }
    },
    computed: {
      ...mapGetters([
        'sessionID',
        'claimRecord'
      ])
    }
  }
</script>

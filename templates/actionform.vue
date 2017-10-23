<template>
  <af-modal-form ref="form"
                 :title="formTitle"
                 :valid="validate()"
                 :okHandle="onOkClick"
                 :scrollable="formMaxHeight"
  >
    <af-field-set caption="">
      <div class="row">

      </div>
    </af-field-set>
  </af-modal-form>
</template>

<script>
  import {} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {AfEventsMapper, AfModalForm, AfMfMixin, AfFieldSet} from '../src/components/base' // change relative path

  export default {
    name: '',
    mixins: [AfEventsMapper, AfMfMixin],
    props: [],
    data () {
      return {
        formTitle: 'ChangeTitle',
        formMaxHeight: 600, // change this
        eventsMap: {
          // 'event': this.method
        }
      }
    },
    components: {
      AfModalForm,
      AfFieldSet
    },
    methods: {
      ...mapActions([
      ]),
      validate () {
        if (Object.keys(this.$refs).length === 0) return false
        // return this.$refs.ref.isValid &&
      },
      onOkClick () {
        // void this.$store.dispatch('', {})
      },
      open () {
        // init field values
        this.$refs.form.open()
      }
    },
    computed: {
      ...mapState({
        // name: state => state.module.name
      }),
      ...mapGetters([
      ])
    }
  }
</script>

<style lang="stylus">
</style>

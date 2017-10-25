<template>
  <div class="content-hist">
    <div v-for="item in historyView">
      <div class="af-hist-subrow">
        <div class="af-hist-circle">
          <div class="af-hist-day-2">
            {{item.day}}
          </div>
        </div>
      </div>
      <div v-for="content in item.content" class="af-hist-subrow">
        <div class="row" style="padding: 5px 0">
          <div class="col-12 col-sm-4 col-xl-3">
            <span class="af-hist-status" v-if="content.newStatus">{{content.newStatus}}</span>
          </div>
          <div class="col-12 col-sm-8 col-xl-9" v-if="content.newExecutor">
            Виконавець: <span class="af-hist-executor">{{content.newExecutor}}</span>
          </div>
        </div>
        <div v-if="content.comment">
          <q-btn small round flat class="float-right" icon="mode edit" v-if="content.noteId" @click="editNote(content.noteId);"/>
          <pre class="af-history-comment" :class="{'af-selectable' : isNotTouch}"><small>{{content.comment}}</small></pre>
        </div>
        <div>
          <p class="text-italic text-grey">{{content.who}}, {{content.time}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<!--q-btn small round flat class="float-right" icon="mode edit" v-if="content.noteId"/-->

<script>
  import {QBtn} from 'quasar-framework'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    name: '',
    props: [],
    data () {
      return {}
    },
    components: { QBtn },
    methods: {
      ...mapActions([]),
      editNote (id) {
        console.log(id)
      }
    },
    computed: {
      ...mapState({
        history: state => state.claims.claimHistory
      }),
      ...mapGetters([
        'historyView',
        'isNotTouch'
      ])
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  $hist-bord-color = $grey-4
  .content-hist
    padding 10px 20px 0 20px

  .af-hist-subrow
    border-left 3px solid $hist-bord-color
    padding 5px 10px
    border-bottom 1px dashed $hist-bord-color

  .af-hist-subrow:first-child
    padding 15px 10px 0 10px
    padding-left 0
    border-bottom none

  .af-hist-circle
    width 20px
    height 20px
    border-radius 20px
    -moz-border-radius 20px
    -webkit-border-radius 20px
    border 3px solid $hist-bord-color
    margin-left -11px
    background-color $afina
    display inline-block

  .af-hist-day-2
    margin-left 25px
    width 250px
    padding-top -10px
    display inline-block

  .af-hist-status
    background-color $afinasql
    color $white
    font-size 10px
    text-transform uppercase
    padding 2px 5px

  .af-hist-executor
    color $afinasql
    font-weight 400

  .af-history-comment
    border-left 3px solid $afinasql
    padding 10px
    background-color $light
</style>

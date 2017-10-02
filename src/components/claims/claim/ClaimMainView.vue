<template>
  <div class="text-center">
    <q-btn style="margin-top: 10px" color="primary"  icon="arrow back" v-go-back=" '/claims' ">До списку</q-btn>
    <h1>Перегляд рекламації</h1>
    <p>В процессі розробки…</p>
  </div>
</template>

<script>
  import {QBtn, GoBack} from 'quasar-framework'
  export default {
    components: {QBtn},
    directives: {GoBack},
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="stylus">
</style>

<template>
  <div class="text-center">
    <q-btn style="margin-top: 10px" color="primary"  icon="arrow back" v-go-back="backRoute">{{backText ? backText : 'Повернутися'}}</q-btn>
    <h1>{{title}}</h1>
    <p>В процессі розробки…</p>
  </div>
</template>

<script>
  import {QBtn, GoBack} from 'quasar-framework'

  export default {
    props: {
      backRoute: String,
      title: String,
      backText: String
    },
    components: {QBtn},
    directives: {GoBack},
    computed: {
      backTo () {
        return ` '${this.backRoute}' `
      }
    }
  }
</script>

<template>
  <q-inner-loading :visible="progress">
    <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
  </q-inner-loading>
</template>

<script>
  import {QInnerLoading, QSpinnerGears} from 'quasar'

  export default {
    name: 'af-load-cover',
    components: { QInnerLoading, QSpinnerGears },
    props: {
      progress: Boolean
    }
  }
</script>

<template>
  <af-form
    title="Фільтр"
    color="amber-8"
    :titleActions="tActions"
    :bottomActions="bActions"
  >
    <af-field-set caption="Поля">
      asdasd
    </af-field-set>
    <af-field-set caption="Поля2">
      asdasd
    </af-field-set>
    <af-field-set caption="Поля3">
      asdasd
    </af-field-set>
  </af-form>
</template>

<script>
  import { AfForm, AfFieldSet } from '../base'
  import {QCardTitle} from 'quasar'

  export default {
    components: {
      AfFieldSet,
      AfForm,
      QCardTitle
    },
    data () {
      return {
        tActions: [
          {
            icon: 'save',
            action: 'saveFilter',
            handler: this.saveFilter
          },
          {
            icon: 'fa-eraser',
            action: 'clearForm',
            handler: this.clearForm
          }
        ],
        bActions: [
          {
            caption: 'OK',
            action: 'ok',
            handler: this.saveFilter,
            color: 'primary'
          },
          {
            caption: 'Скасування',
            action: 'cancel',
            handler: this.clearForm,
            color: 'negative'
          }
        ]
      }
    },
    methods: {
      saveFilter () {
        alert('saveFilter')
      },
      clearForm () {
        alert('clearForm')
      }
    }

  }
</script>

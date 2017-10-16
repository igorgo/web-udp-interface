'use strict'

import {QDialogSelect, Dialog} from 'quasar-framework'
import {cloneObject} from '../../routines'

export default {
  name: 'af-dialog-select',
  extends: QDialogSelect,
  methods: {
    pick () {
      if (this.disable) {
        return
      }
      this.dialog = Dialog.create({
        title: 'Вибір',
        onDismiss: () => {
          this.dialog = null
        },
        form: {
          select: {
            type: this.type,
            model: cloneObject(this.value),
            color: this.color,
            items: this.options
          }
        },
        buttons: [
          {
            label: 'Всі',
            color: 'blue-10',
            classes: ['af-msd-btn'],
            handler: data => {
              const v = this.$options.propsData.options.map(i => i.value)
              this.$emit('input', v)
              this.$emit('change', v)
            }
          },
          {
            label: 'Нічого',
            color: 'blue-10',
            classes: ['af-msd-btn'],
            handler: data => {
              this.$emit('input', [])
              this.$emit('change', [])
            }
          },
          {
            label: 'OK',
            color: 'primary',
            handler: data => {
              if (JSON.stringify(this.value) !== JSON.stringify(data.select)) {
                this.$emit('input', data.select)
                this.$emit('change', data.select)
              }
            }
          },
          {
            label: 'Скасування',
            color: 'negative',
            classes: ['af-msd-btn']
          }
        ]
      })
    }
  }
}

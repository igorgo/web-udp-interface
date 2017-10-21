'use strict'

import {Dialog} from 'quasar-framework'

const confirm = (message, handler) => {
  Dialog.create({
    message: `<div class="af-conf-message">${message}</div>`,
    buttons: [
      {
        label: 'Так',
        handler
      },
      {
        label: 'Ні',
        color: 'negative'
      }
    ]
  })
}

export default {
  confirm
}

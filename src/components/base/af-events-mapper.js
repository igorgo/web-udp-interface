'use strict'

import {mapEvents} from '../../routines'
export default {
  created () {
    mapEvents(this, true)
  },
  beforeDestroy () {
    mapEvents(this, false)
  }
}

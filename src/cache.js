/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */

import {SessionStorage as storage} from 'quasar'
import * as _ from 'lodash'

export default {

  get: (path, defaultValue = null) => {
    if (path.isArray) {
      if (storage.has(path[0])) {
        let val = storage.get.item(path[0])
        if (path.length > 1) {
          return _.get(val, path.slice(1), defaultValue)
        }
        else {
          return val
        }
      }
      else {
        return defaultValue
      }
    }
    else {
      if (storage.has(path)) {
        return storage.get.item(path)
      }
      else {
        return defaultValue
      }
    }
  },
  set: (path, value) => {
    if (path.isArray) {
      let val
      if (path.length > 1) {
        if (storage.has(path[0])) val = storage.get.item(path[0])
        else val = {}
        _.set(val, path.slice(1), value)
      }
      else {
        val = value
      }
      storage.set(path[0], val)
    }
    else {
      storage.set(path, value)
    }
  }
}

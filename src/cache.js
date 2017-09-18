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
      if (path.length > 0 && storage.has(path[0])) {
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
    else if (_.isString(path)) {
      if (storage.has(path)) {
        return storage.get.item(path)
      }
      else {
        return defaultValue
      }
    }
    else {
      return defaultValue
    }
  },
  set: (path, value) => {
    if (path.isArray) {
      if (path.length > 1) {
        let val
        if (storage.has(path[0])) val = storage.get.item(path[0])
        else val = {}
        _.set(val, path.slice(1), value)
        storage.set(path[0], val)
      }
      else if (path.length === 1) {
        storage.set(path[0], value)
      }
    }
    else if (_.isString(path)) {
      storage.set(path, value)
    }
  },
  has: path => {
    if (path.isArray) {
      if (path.length > 1) {
        return storage.has(path[0])
      }
      else if (path.length === 1) {
        return storage.has(path[0]) && _.has(storage.get.item(path[0]), path.slice(1))
      }
      else {
        return false
      }
    }
    else if (_.isString(path)) {
      return storage.has(path)
    }
    else {
      return false
    }
  },
  unset: path => {
    if (path.isArray) {
      if (path.length > 1) {
        if (storage.has(path[0])) {
          let val = storage.get.item(path[0])
          _.unset(val, path.slice(1))
          storage.set(path[0], val)
        }
      }
      else if (path.length === 1) {
        storage.remove(path[0])
      }
    }
    else if (_.isString(path)) {
      storage.remove(path)
    }
  },
  clear: () => {
    storage.clear()
  }
}

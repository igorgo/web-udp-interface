'use strict'

import { SOCKET_ALL_UNITNAMES_LOADED, SOCKET_ALL_APPNAMES_LOADED } from '../mutation-types'
import cache from '../../cache'

function array2AutoComplete (arr) {
  return {
    field: 'value',
    list: arr.map(
      i => {
        return {
          value: i,
          label: i
        }
      }
    )
  }
}

const state = {
  unitsNames: cache.get('unitsNames', []),
  appsNames: cache.get('appsNames', [])
}

const mutations = {
  [SOCKET_ALL_UNITNAMES_LOADED] (state, pl) {
    const unitsNames = pl.map(i => i['UNITNAME'])
    state.unitsNames = unitsNames
    cache.set('unitsNames', unitsNames)
  },
  [SOCKET_ALL_APPNAMES_LOADED] (state, pl) {
    const appsNames = pl.map(i => i['APPNAME'])
    state.appsNames = appsNames
    cache.set('appsNames', appsNames)
  }
}

const getters = {
  unitsAutoComplete: state => array2AutoComplete(state.unitsNames),
  appsAutoComplete: state => array2AutoComplete(state.appsNames)
}

export default {
  state,
  mutations,
  getters
}

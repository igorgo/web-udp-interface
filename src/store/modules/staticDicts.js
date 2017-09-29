'use strict'

import { SOCKET_ALL_UNITNAMES_LOADED, SOCKET_ALL_APPNAMES_LOADED, SOCKET_ALL_BUILDS_LOADED } from '../mutation-types'
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
  appsNames: cache.get('appsNames', []),
  allBuilds: cache.get('allBuilds', [])
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
  },
  [SOCKET_ALL_BUILDS_LOADED] (state, pl) {
    state.allBuilds = pl
    cache.set('allBuilds', pl)
  }
}

const getters = {
  unitsAutoComplete: state => array2AutoComplete(state.unitsNames),
  appsAutoComplete: state => array2AutoComplete(state.appsNames),
  versionSelectList: state => [{label: '', value: ''}].concat(state.allBuilds.map(item => { return {label: item.version, value: item.version} }))
}

export default {
  state,
  mutations,
  getters
}

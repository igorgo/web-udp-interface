'use strict'

import { STATIC_UNITNAMES_LOADED, STATIC_APPNAMES_LOADED, STATIC_BUILDS_LOADED } from '../mutation-types'
import cache from '../../cache'
import * as _ from 'lodash'

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
  [STATIC_UNITNAMES_LOADED] (state, pl) {
    const unitsNames = pl.map(i => i['UNITNAME'])
    state.unitsNames = unitsNames
    cache.set('unitsNames', unitsNames)
  },
  [STATIC_APPNAMES_LOADED] (state, pl) {
    const appsNames = pl.map(i => i['APPNAME'])
    state.appsNames = appsNames
    cache.set('appsNames', appsNames)
  },
  [STATIC_BUILDS_LOADED] (state, pl) {
    state.allBuilds = pl
    cache.set('allBuilds', pl)
  }
}

const getters = {
  unitsAutoComplete: state => array2AutoComplete(state.unitsNames),
  appsAutoComplete: state => array2AutoComplete(state.appsNames),
  // versionSelectList: state => [{label: '', value: ''}].concat(state.allBuilds.map(item => { return {label: item.version, value: item.version} }))
  releasesByVersion: state => ver => {
    const v = _.findIndex(state.allBuilds, item => item['version'] === ver)
    return v !== -1 ? state.allBuilds[v]['releases'] : []
  },
  buildsByVerRel: state => (ver, rel) => {
    const v = _.findIndex(state.allBuilds, item => item['version'] === ver)
    const r = v !== -1 ? _.findIndex(state.allBuilds[v]['releases'], item => item['release'] === rel) : -1
    return r !== -1 ? state.allBuilds[v]['releases'][r]['builds'] : []
  }
}

export default {
  state,
  mutations,
  getters
}

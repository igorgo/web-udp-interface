'use strict'

import {
  STATIC_UNITNAMES_LOADED,
  STATIC_APPNAMES_LOADED,
  STATIC_BUILDS_LOADED,
  ALL_PERSONS_LOADED,
  APPS_BY_UNIT_GOT,
  UNITS_EDIT_CHANGED,
  FUNCS_BY_UNIT_GOT
} from '../mutation-types'
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
  allBuilds: cache.get('allBuilds', []),
  allPersons: cache.get('allPersons', []),
  unitApps: [],
  unitFuncs: []
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
  },
  [ALL_PERSONS_LOADED] (state, pl) {
    state.allPersons = pl
    cache.set('allPersons', pl)
  },
  [APPS_BY_UNIT_GOT] (state, pl) {
    state.unitApps = pl
  },
  [FUNCS_BY_UNIT_GOT] (state, pl) {
    state.unitFuncs = pl
  },
  [UNITS_EDIT_CHANGED] (state) {
    state.unitApps = []
    state.unitFuncs = []
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
  },
  initiatorSelect: state => {
    return [
      {
        label: '',
        value: -1
      },
      ...state.allPersons.map((pers, idx) => ({ label: pers.label, value: idx }))
    ]
  },
  appsByUnits: state => {
    return state.unitApps.map(app => ({label: app.appName, value: app.appName}))
  },
  funcsByUnits: state => {
    return state.unitFuncs.map(app => ({label: app.funcName, value: app.funcName}))
  }
}

const actions = {
  getAppsByUnits ({ commit, getters }, { socket, units }) {
    commit(UNITS_EDIT_CHANGED)
    clearTimeout(this.timerUnitChange)
    this.timerUnitChange = setTimeout(
      () => {
        if (!socket || !units) return
        socket.emit('get_apps_by_unit', { sessionID: getters.sessionID, units })
        if (units.split(';').length > 1) return
        socket.emit('get_funcs_by_unit', { sessionID: getters.sessionID, units })
      },
      1000,
      units
    )
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}

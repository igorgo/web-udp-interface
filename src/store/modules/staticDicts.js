'use strict'

import {
  UNITS_EDIT_CHANGED
} from '../mutation-types'
import cache from '../../cache'
import * as _ from 'lodash'
import {formatDate} from '../../routines'
import {
  mutateSockOk,
  SE_STATDICT_ALL_UNITS,
  SE_STATDICT_ALL_APPS,
  SE_STATDICT_ALL_BUILDS,
  SE_STATDICT_ALL_PERSONS,
  SE_APPS_BY_UNIT,
  SE_UNITFUNCS_BY_UNIT
} from '../../socket-events'
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
  activeBuilds: cache.get('activeBuilds', []),
  allPersons: cache.get('allPersons', []),
  unitApps: [],
  unitFuncs: []
}

const mutations = {
  [mutateSockOk(SE_STATDICT_ALL_UNITS)] (state, {units}) {
    const unitsNames = units.map(i => i['UNITNAME'])
    state.unitsNames = unitsNames
    cache.set('unitsNames', unitsNames)
  },
  [mutateSockOk(SE_STATDICT_ALL_APPS)] (state, pl) {
    const appsNames = pl.map(i => i['APPNAME'])
    state.appsNames = appsNames
    cache.set('appsNames', appsNames)
  },
  [mutateSockOk(SE_STATDICT_ALL_BUILDS)] (state, {builds}) {
    state.allBuilds = builds
    state.activeBuilds = []
    state.allBuilds.forEach(b => {
      if (b.version.startsWith('A')) {
        state.activeBuilds = [...state.activeBuilds, ...b.releases]
      }
    })
    state.activeBuilds.sort((a, b) => {
      if (a.release < b.release) {
        return 1
      }
      if (a.release > b.release) {
        return -1
      }
      return 0
    })
    state.activeBuilds.forEach(r => {
      r.builds = r.builds.sort((a, b) => {
        if (a.build < b.build) {
          return 1
        }
        if (a.build > b.build) {
          return -1
        }
        return 0
      })
    })
    cache.set('activeBuilds', state.activeBuilds)
    cache.set('allBuilds', builds)
  },
  [mutateSockOk(SE_STATDICT_ALL_PERSONS)] (state, {persons}) {
    state.allPersons = persons
    cache.set('allPersons', persons)
  },
  [mutateSockOk(SE_APPS_BY_UNIT)] (state, {apps}) {
    state.unitApps = apps
  },
  [mutateSockOk(SE_UNITFUNCS_BY_UNIT)] (state, {unitfuncs}) {
    state.unitFuncs = unitfuncs
  },
  [UNITS_EDIT_CHANGED] (state) {
    state.unitApps = []
    state.unitFuncs = []
  }
}

const getters = {
  unitsAutoComplete: state => array2AutoComplete(state.unitsNames),
  appsAutoComplete: state => array2AutoComplete(state.appsNames),
  releasesByVersion: state => ver => {
    const v = _.findIndex(state.allBuilds, item => item['version'] === ver)
    return v !== -1 ? state.allBuilds[v]['releases'] : []
  },
  buildsByVerRel: state => (ver, rel) => {
    const v = _.findIndex(state.allBuilds, item => item['version'] === ver)
    const r = v !== -1 ? _.findIndex(state.allBuilds[v]['releases'], item => item['release'] === rel) : -1
    return r !== -1 ? state.allBuilds[v]['releases'][r]['builds'] : []
  },
  initiatorSelect: state => state.allPersons.map((pers, idx) => ({ label: pers.label, value: idx })),
  appsByUnits: state => state.unitApps.map(app => ({label: app.appName, value: app.appName})),
  funcsByUnits: state => state.unitFuncs.map(app => ({label: app.funcName, value: app.funcName})),
  activeReleasesForSelect: state => state.activeBuilds.map(r => ({label: r.release, value: r.release})),
  activeBuildsForSelect: state => (rel) => {
    const i = state.activeBuilds.findIndex(r => rel === r.release)
    if (i === -1) return []
    return state.activeBuilds[i].builds.map(b => ({ label: `${b.build} (${formatDate(b.date)})`, value: b.build }))
  }
}

const actions = {
  getAppsByUnits ({ commit, getters }, { socket, units }) {
    commit(UNITS_EDIT_CHANGED)
    clearTimeout(this.timerUnitChange)
    this.timerUnitChange = setTimeout(
      () => {
        if (!socket || !units) return
        socket.emit(SE_APPS_BY_UNIT, { sessionID: getters.sessionID, units })
        if (units.split(';').length > 1) return
        socket.emit(SE_UNITFUNCS_BY_UNIT, { sessionID: getters.sessionID, units })
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

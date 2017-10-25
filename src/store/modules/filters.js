import {
  FILTER_GET,
  FILTER_MODIFY,
  FILTER_CLEAR,
  FILTER_LIST_SCROLL,
  FILTER_SET_DO_NOT_UPDATE
} from '../mutation-types'
import { Events } from 'quasar-framework'
import _ from 'lodash'
import {
  AE_PROGRESS_SET,
  AE_PROGRESS_RESET,
  AE_COND_CLAIMS_SAVED,
  AE_COND_CLAIMS_DELETED
} from '../../app-events'
import {
  mutateSockOk,
  SE_CONDITIONS_CLAIMS_LIST,
  SE_CONDITIONS_GET_ONE,
  SE_CONDITIONS_SAVE,
  SE_CONDITIONS_DELETE
} from '../../socket-events'

const emptyFilter = {
  claimNumb: '',
  claimVersion: '',
  claimRelease: '',
  claimBuild: '',
  claimUnit: '',
  claimApp: '',
  imInitiator: null,
  imExecutor: null,
  claimContent: ''
}

const state = {
  filters: [],
  currentFilter: {
    rn: null,
    name: '',
    ...emptyFilter
  },
  invokedByClaims: false,
  listIndex: -1,
  doNotUpdate: false
}

const getters = {
  filterOptions: state => {
    const result = []
    result.push({
      label: 'поточний',
      value: null
    })
    state.filters.forEach(f => {
      result.push({
        label: f['SNAME'],
        value: f['RN']
      })
    })
    return result
  },
  currentFilterEdit: state => {
    let cv = {...state.currentFilter}
    const ver = state.currentFilter.claimVersion ? state.currentFilter.claimVersion.split(';') : []
    const rel = state.currentFilter.claimRelease ? state.currentFilter.claimRelease.split(';') : []
    cv.claimVersion = ver
    cv.claimRelease = {
      disable: ver.length !== 1,
      value: rel
    }
    cv.claimBuild = {
      disable: rel.length !== 1,
      value: state.currentFilter.claimBuild ? state.currentFilter.claimBuild.split(';') : []
    }
    cv.imInitiator = !!state.currentFilter.imInitiator
    cv.imExecutor = !!state.currentFilter.imExecutor
    return cv
  },
  versionSelectList: (state, getters, rootState) =>
    rootState.staticDicts.allBuilds.map(item => {
      return { label: item.version, value: item.version }
    }),
  releaseSelectList: (state, getters) =>
    getters.releasesByVersion(state.currentFilter.claimVersion).map(item => {
      return { label: item.release, value: item.release }
    }),
  buildsSelectList: (state, getters) =>
    getters.buildsByVerRel(state.currentFilter.claimVersion, state.currentFilter.claimRelease).map(item => {
      return { label: item.build, value: item.build }
    })
}

const mutations = {
  [mutateSockOk(SE_CONDITIONS_CLAIMS_LIST)] (state, {filters}) {
    state.filters = filters
    if (state.filters.length) {
      if (state.currentFilter.rn) {
        const i = _.findIndex(state.filters, f => f['RN'] === state.currentFilter.rn)
        state.listIndex = (i > -1) ? i : 0
      }
      else state.listIndex = 0
    }
  },
  [FILTER_LIST_SCROLL] (state, i) {
    state.listIndex = i
  },
  [mutateSockOk(SE_CONDITIONS_GET_ONE)] (state, {filter}) {
    state.currentFilter = {
      rn: filter['P_RN'],
      name: filter['P_FILTER_NAME'],
      claimNumb: filter['P_CLAIM_NUMB'],
      claimVersion: filter['P_CLAIM_VERS'],
      claimRelease: filter['P_CLAIM_RELEASE'],
      claimBuild: filter['P_CLAIM_BUILD'],
      claimUnit: filter['P_CLAIM_UNIT'],
      claimApp: filter['P_CLAIM_APP'],
      imInitiator: filter['P_CLAIM_IM_INIT'],
      imExecutor: filter['P_CLAIM_IM_PERF'],
      claimContent: filter['P_CLAIM_CONTENT']
    }
    Events.$emit(AE_PROGRESS_RESET)
  },
  [mutateSockOk(SE_CONDITIONS_SAVE)] (state, {P_OUT_RN}) {
    state.currentFilter.rn = P_OUT_RN
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_COND_CLAIMS_SAVED)
  },
  [mutateSockOk(SE_CONDITIONS_DELETE)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_COND_CLAIMS_DELETED)
  },
  [FILTER_GET] (state, from) {
    state.invokedByClaims = from === 'claims'
  },
  [FILTER_CLEAR] (state, isNew) {
    const rn = isNew ? null : state.currentFilter.rn
    const name = isNew ? '' : state.currentFilter.name
    state.currentFilter = {
      rn,
      name,
      ...emptyFilter
    }
  },
  [FILTER_MODIFY] (state, {key, value}) {
    switch (key) {
      case 'imInitiator':
      case 'imExecutor':
        state.currentFilter[key] = value ? 1 : 0
        break
      case 'claimVersion':
        state.currentFilter.claimVersion = value.join(';')
        if (value.length !== 1) {
          state.currentFilter.claimRelease = ''
          state.currentFilter.claimBuild = ''
        }
        break
      case 'claimRelease':
        state.currentFilter.claimRelease = value.join(';')
        if (value.length !== 1) {
          state.currentFilter.claimBuild = ''
        }
        break
      case 'claimBuild':
        state.currentFilter.claimBuild = value.join(';')
        break
      default:
        state.currentFilter[key] = value
    }
  },
  [FILTER_SET_DO_NOT_UPDATE] (state, value) {
    state.doNotUpdate = value
  }
}
const actions = {
  getConditionFilter ({ commit, getters }, { socket, conditionId, from }) {
    commit(FILTER_GET, from)
    if ((from === 'filters') && (conditionId === null)) {
      commit(FILTER_CLEAR, true)
    }
    else {
      if (!socket) return
      Events.$emit(AE_PROGRESS_SET)
      socket.emit(SE_CONDITIONS_GET_ONE, { sessionID: getters.sessionID, conditionId })
    }
  },
  modifyFilterField ({commit}, {key, value}) {
    commit(FILTER_MODIFY, {key, value})
  },
  clearFilterForm ({commit}) {
    commit(FILTER_CLEAR, false)
  },
  saveConditionFilter ({state, getters}, {socket}) {
    if (!socket) return
    socket.emit(SE_CONDITIONS_SAVE, {sessionID: getters.sessionID, ...state.currentFilter})
  },
  deleteConditionFilter ({state, commit, getters}, {socket}) {
    if ((socket && state.currentFilter.rn)) {
      Events.$emit(AE_PROGRESS_SET)
      socket.emit(SE_CONDITIONS_DELETE, {sessionID: getters.sessionID, rn: state.currentFilter.rn})
    }
  },
  conditionListScroll ({ state, commit }, n) {
    const i = state.listIndex + n
    if ((i >= 0) && (i < state.filters.length)) commit(FILTER_LIST_SCROLL, i)
  },
  conditionListPos ({ commit }, n) {
    commit(FILTER_LIST_SCROLL, n)
  },
  conditionSetDoNotUpdate ({commit}, doNotUpdate) {
    commit(FILTER_SET_DO_NOT_UPDATE, doNotUpdate)
  },
  getConditionsList ({state, commit, getters}, {socket}) {
    if (state.doNotUpdate) {
      commit(FILTER_SET_DO_NOT_UPDATE, false)
    }
    else {
      socket.emit(SE_CONDITIONS_CLAIMS_LIST, {sessionID: getters.sessionID})
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

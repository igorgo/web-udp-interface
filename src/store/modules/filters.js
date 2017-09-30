import {
  CLAIM_CONDITIONS_LIST,
  CLAIM_CONDITION_GOT,
  CLAIM_CONDITION_GET,
  CLAIM_CONDITION_MODIFY,
  CLAIM_CONDITION_CLEAR
} from '../mutation-types'
import * as _ from 'lodash'

const emptyFilter = {
  rn: null,
  name: '',
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
  currentFilter: _.assignIn({}, emptyFilter),
  getFilterInProgress: false,
  invokedByClaims: false
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
    let cv = _.assignIn({}, state.currentFilter)
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
  [CLAIM_CONDITIONS_LIST] (state, result) {
    state.filters = result
  },
  [CLAIM_CONDITION_GOT] (state, result) {
    state.currentFilter = {
      rn: result['P_RN'],
      name: result['P_FILTER_NAME'],
      claimNumb: result['P_CLAIM_NUMB'],
      claimVersion: (result['P_CLAIM_VERS']),
      claimRelease: result['P_CLAIM_RELEASE'],
      claimBuild: result['P_CLAIM_BUILD'],
      claimUnit: result['P_CLAIM_UNIT'],
      claimApp: result['P_CLAIM_APP'],
      imInitiator: result['P_CLAIM_IM_INIT'],
      imExecutor: result['P_CLAIM_IM_PERF'],
      claimContent: result['P_CLAIM_CONTENT']
    }
    state.getFilterInProgress = false
  },
  [CLAIM_CONDITION_GET] (state, from) {
    state.getFilterInProgress = true
    state.invokedByClaims = from === 'claims'
  },
  [CLAIM_CONDITION_CLEAR] (state) {
    _.assignIn(state.currentFilter, emptyFilter)
  },
  [CLAIM_CONDITION_MODIFY] (state, {key, value}) {
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
  }
}
const actions = {
  getConditionFilter ({ commit }, { socket, conditionId, from }) {
    commit(CLAIM_CONDITION_GET, from)
    if (!socket) return
    socket.emit('get_claim_condition', { conditionId })
  },
  modifyFilterField ({commit}, {key, value}) {
    commit(CLAIM_CONDITION_MODIFY, {key, value})
  },
  clearFilterForm ({commit}) {
    commit(CLAIM_CONDITION_CLEAR)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

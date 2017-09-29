import {
  CLAIM_CONDITIONS_LIST,
  CLAIM_CONDITION_GOT,
  CLAIM_CONDITION_GET,
  CLAIM_CONDITION_MODIFY
} from '../mutation-types'
import * as _ from 'lodash'

const state = {
  filters: [],
  currentFilter: {
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
  },
  get_filter_progress: false
}

const getters = {
  filterOptions: state => {
    const result = []
    result.push({
      label: '',
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
  currentFilter: state => {
    let cv = _.assignIn({}, state.currentFilter)
    cv.claimVersion = state.currentFilter.claimVersion ? state.currentFilter.claimVersion.split(';') : []
    cv.imInitiator = !!state.currentFilter.imInitiator
    cv.imExecutor = !!state.currentFilter.imExecutor
    return cv
  }
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
    state.get_filter_progress = false
  },
  [CLAIM_CONDITION_GET] (state) {
    state.get_filter_progress = true
  },
  [CLAIM_CONDITION_MODIFY] (state, pl) {
    if (['imInitiator', 'imExecutor'].includes(pl.key)) state.currentFilter[pl.key] = pl.value ? 1 : 0
    else if (_.includes(['claimVersion'], pl.key)) state.currentFilter[pl.key] = pl.value.join(';')
    else state.currentFilter[pl.key] = pl.value
  }
}
const actions = {
  getConditionFilter (ctx, pl) {
    ctx.commit(CLAIM_CONDITION_GET)
    pl.socket.emit('get_claim_condition', { conditionId: pl.conditionId })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

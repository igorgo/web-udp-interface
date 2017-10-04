import {
  CLAIMS_LIST,
  CLAIMS_FILTER_CHANGE,
  CLAIMS_SORT_CHANGE,
  CLAIMS_PAGE_CHANGE,
  CLAIMS_SORT_ORDER_CHANGE,
  CLAIMS_START_REQUEST,
  CLAIMS_RECORD_GOT,
  CLAIMS_START_RECORD_REQUEST,
  CLAIMS_SET_DO_NOT_UPDATE
} from '../mutation-types'
import cache from '../../cache'
import * as c from '../../constants'
import {Events} from 'quasar-framework'

const state = {
  allClaimsCount: 0,
  claimList: [],
  currentCondition: cache.get(['userData', 'LAST_COND'], null),
  currentClaimLimit: cache.get(['userData', 'LIST_LIMIT'], 25),
  currentClaimPage: cache.get('claimListPage', 1),
  currentClaimSort: cache.get(['userData', 'CLAIM_SORT'], 2),
  claimSortDesc: cache.get(['userData', 'CLAIM_SORT_ORDER'], 1),
  claimListPages: 1,
  getClaimsInProgress: false,
  newAddedClaimId: null,
  claimRecord: { id: null },
  claimRecordIndexActive: null,
  claimRecordIndexRequested: null,
  claimRecordIndexWait: null,
  isFirstRecord: false,
  isLastRecord: false,
  doNotUpdate: false
}

const getters = {
  sortsList: () => c.SORT_OPTIONS.map((item, ind) => {
    return { label: item.label, value: ind }
  }),
  claimSortDesc: state => !!state.claimSortDesc
}

const mutations = {
  [CLAIMS_LIST] (state, result) {
    state.claimList = result.claims
    state.allClaimsCount = result.allCnt
    state.currentClaimLimit = result.limit
    state.currentClaimPage = result.page
    state.claimListPages = Math.floor(state.allClaimsCount / state.currentClaimLimit) + 1
    cache.set('claimListPage', result.page)
    cache.set(['userData', 'LIST_LIMIT'], result.limit)
    if (state.claimRecordIndexWait !== null) {
      Events.$emit('claims:ready:to:step', {idx: state.claimRecordIndexWait})
      state.claimRecordIndexWait = null
    }
    else {
      state.getClaimsInProgress = false
      Events.$emit('claims:new-portion')
    }
  },
  [CLAIMS_FILTER_CHANGE] (state, val) {
    state.currentCondition = val
  },
  [CLAIMS_SORT_ORDER_CHANGE] (state, value) {
    state.claimSortDesc = value ? 1 : 0
  },
  [CLAIMS_PAGE_CHANGE] (state, value) {
    state.currentClaimPage = value
  },
  [CLAIMS_SORT_CHANGE] (state, value) {
    state.currentClaimSort = value
  },
  [CLAIMS_START_REQUEST] (state) {
    state.getClaimsInProgress = true
  },
  [CLAIMS_START_RECORD_REQUEST] (state, { idx, shiftPage = 0 }) {
    state.getClaimsInProgress = true
    state.claimRecordIndexRequested = idx
    if (shiftPage) {
      state.claimRecordIndexWait = idx
      state.currentClaimPage += shiftPage
    }
  },
  [CLAIMS_RECORD_GOT] (state, record) {
    state.claimRecord = record
    state.getClaimsInProgress = false
    state.claimRecordIndexActive = state.claimRecordIndexRequested
    state.claimRecordIndexRequested = null
    state.isFirstRecord = (state.currentClaimPage === 1) && (state.claimRecordIndexActive === 0)
    state.isLastRecord = (state.currentClaimPage === state.claimListPages) &&
      (state.claimRecordIndexActive === (state.claimList.length - 1))
    Events.$emit('claims:record:got')
  },
  [CLAIMS_SET_DO_NOT_UPDATE] (state, value) {
    state.doNotUpdate = value
  }
}

const actions = {
  setCurrentSort ({ commit, dispatch }, { socket, value }) {
    cache.set(['userData', 'CLAIM_SORT'], value)
    commit(CLAIMS_SORT_CHANGE, value)
    if (!socket) return
    dispatch('sendClaimsRequest', {
      socket,
      discardPage: true
    })
    socket.emit('set_user_data_param', {
      param: 'CLAIM_SORT',
      dataType: 'N',
      value
    })
  },
  setCurrentClaimSortOrder ({ commit, dispatch }, { socket, value }) {
    const intVal = value ? 1 : 0
    cache.set(['userData', 'CLAIM_SORT_ORDER'], intVal)
    commit(CLAIMS_SORT_ORDER_CHANGE, intVal)
    if (!socket) return
    dispatch('sendClaimsRequest', {
      socket,
      discardPage: true
    })
    socket.emit('set_user_data_param', {
      param: 'CLAIM_SORT_ORDER',
      dataType: 'N',
      intVal
    })
  },
  setCurrentClaimPage ({ commit, dispatch }, { socket, value }) {
    commit(CLAIMS_PAGE_CHANGE, value)
    if (!socket) return
    dispatch('sendClaimsRequest', { socket })
  },
  setCurrentCondition ({ commit, dispatch }, { socket, value }) {
    cache.set(['userData', 'LAST_COND'], value)
    commit(CLAIMS_FILTER_CHANGE, value)
    if (!socket) return
    dispatch('sendClaimsRequest', {
      socket,
      discardPage: true
    })
    socket.emit('set_user_data_param', {
      param: 'LAST_COND',
      dataType: 'N',
      value
    })
  },
  sendClaimsRequest ({ commit, state }, { socket, discardPage = false }) {
    if (state.doNotUpdate) {
      commit(CLAIMS_SET_DO_NOT_UPDATE, false)
      Events.$emit('claims:list:scroll:to', { pos: state.claimRecordIndexActive })
      return
    }
    let sortStr = ''
    if (state.currentClaimSort > 0) {
      sortStr = c.SORT_OPTIONS[state.currentClaimSort].field
      if (state.claimSortDesc) sortStr += ' DESC'
    }
    commit('CLAIMS_START_REQUEST')
    socket.emit('get_claim_list', {
      conditionId: state.currentCondition,
      sortOrder: sortStr,
      page: discardPage ? 1 : state.currentClaimPage,
      limit: state.currentClaimLimit,
      newClaimId: state.newAddedClaimId
    })
  },
  getClaimRecord ({ commit, state }, { socket, idx }) {
    commit('CLAIMS_START_RECORD_REQUEST', { idx })
    socket.emit('get_claim_record', { id: state.claimList[idx].id })
  },
  claimsSetDoNotUpdate ({ commit }, doNotUpdate) {
    commit(CLAIMS_SET_DO_NOT_UPDATE, doNotUpdate)
  },
  claimStepRecord ({ state, commit, dispatch }, { socket, step }) {
    let needShiftPage = false
    if (step === -1) {
      if (state.isFirstRecord) return
      if (state.claimRecordIndexActive === 0) {
        commit(CLAIMS_START_RECORD_REQUEST, { idx: state.currentClaimLimit - 1, shiftPage: -1 })
        needShiftPage = true
      }
    }
    if (step === 1) {
      if (state.isLastRecord) return
      if (state.claimRecordIndexActive === (state.currentClaimLimit - 1)) {
        commit(CLAIMS_START_RECORD_REQUEST, { idx: 0, shiftPage: 1 })
        needShiftPage = true
      }
    }
    if (needShiftPage) {
      Events.$once('claims:ready:to:step', ({idx}) => {
        dispatch('getClaimRecord', {socket, idx})
      })
      dispatch('sendClaimsRequest', { socket })
    }
    else {
      dispatch('getClaimRecord', { socket, idx: state.state.claimRecordIndexActive + step })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

import {
  CLAIMS_LIST,
  CLAIMS_FILTER_CHANGE,
  CLAIMS_SORT_CHANGE,
  CLAIMS_PAGE_CHANGE,
  CLAIMS_SORT_ORDER_CHANGE,
  CLAIMS_RECORD_GOT,
  CLAIMS_START_RECORD_REQUEST,
  CLAIMS_SET_DO_NOT_UPDATE,
  CLAIMS_HISTORY_GOT,
  CLAIMS_FILES_GOT,
  CLAIMS_LIST_SCROLL,
  CLAIM_AVAIL_ACTIONS_GOT,
  CLAIM_FILE_ATTACHED,
  CLAIM_INSERT_DONE,
  CLAIM_DELETE_DONE,
  CLAIM_UPDATE_DONE
} from '../mutation-types'
import cache from '../../cache'
import {SORT_OPTIONS} from '../../constants'
import {Events} from 'quasar-framework'
import {formatDate, formatOnlyTime, formatDateFull} from '../../routines'

const REQUEST_RECORD = 0b001
const REQUEST_HISTORY = 0b010
const REQUEST_FILES = 0b100
const REQUEST_ALL_FINISH = 0b111

function changeRequestsState (state, status, reset) {
  if (reset) {
    state.recordRequestsState = 0
  }
  else {
    state.recordRequestsState += status
  }
  if (state.recordRequestsState === REQUEST_ALL_FINISH) {
    Events.$emit('progress:reset')
  }
  else {
    Events.$emit('progress:set')
  }
}

const actionsFlags = {
  'edit': 0b00000000001,
  'delete': 0b00000000010,
  'status': 0b00000000100,
  'assign': 0b00000001000,
  'return': 0b00000010000,
  'annul': 0b00000100000,
  'comment': 0b00001000000,
  'attach': 0b00010000000,
  'prioritize': 0b00100000000,
  'setHelpNeed': 0b01000000000,
  'setHelpStatus': 0b10000000000
}

const state = {
  allClaimsCount: 0,
  claimList: [],
  currentCondition: cache.get(['userData', 'LAST_COND'], null),
  currentClaimLimit: cache.get(['userData', 'LIST_LIMIT'], 25),
  currentClaimPage: cache.get('claimListPage', 1),
  currentClaimSort: cache.get(['userData', 'CLAIM_SORT'], 2),
  claimSortDesc: cache.get(['userData', 'CLAIM_SORT_ORDER'], 1),
  claimListPages: 1,
  newAddedClaimId: null,
  claimRecord: { id: null },
  claimHistory: [],
  claimFiles: [],
  claimActionsMask: 0,
  claimRecordIndexActive: null,
  claimRecordIndexRequested: null,
  claimRecordIndexWait: null,
  doNotUpdate: false,
  recordRequestsState: 0
}

const getters = {
  sortsList: () => SORT_OPTIONS.map((item, ind) => {
    return { label: item.label, value: ind }
  }),
  claimSortDesc: state => !!state.claimSortDesc,
  historyView: state => {
    let result = []
    let onDay = null
    let j = -1
    for (let i = state.claimHistory.length - 1; i > -1; i--) {
      const rec = state.claimHistory[i]
      const day = formatDate(rec.date)
      if (day !== onDay) {
        result.push({
          day: formatDateFull(rec.date),
          content: []
        })
        j++
        onDay = day
      }
      let { date, ...restRec } = rec
      result[j].content.push({
        time: formatOnlyTime(date, false),
        ...restRec
      })
    }
    return result
  },
  isFirstRecord: state => (state.currentClaimPage === 1) && (state.claimRecordIndexActive === 0),
  isLastRecord: state => (state.currentClaimPage === state.claimListPages) &&
    (state.claimRecordIndexActive === (state.claimList.length - 1)),
  isActionAvail: state => action => (state.claimActionsMask & actionsFlags[action]) === actionsFlags[action]
}

const mutations = {
  [CLAIMS_LIST] (state, result) {
    state.newAddedClaimId = null
    state.claimList = result.claims
    state.allClaimsCount = result.allCnt
    state.currentClaimLimit = result.limit
    state.currentClaimPage = result.page
    state.claimListPages = Math.floor(state.allClaimsCount / state.currentClaimLimit) + 1
    cache.set('claimListPage', result.page)
    cache.set(['userData', 'LIST_LIMIT'], result.limit)
    Events.$emit('progress:reset')
    if (state.claimRecordIndexWait !== null) {
      Events.$emit('claims:ready:to:step', { idx: state.claimRecordIndexWait })
      state.claimRecordIndexWait = null
    }
    else {
      state.claimRecordIndexActive = state.claimList.length ? 0 : null
      Events.$emit('claims:new-portion')
    }
  },
  [CLAIM_FILE_ATTACHED] (state, pl) {
    Events.$emit('claims:file:attached', pl)
  },
  [CLAIMS_FILTER_CHANGE] (state, val) {
    state.currentCondition = val
    state.currentClaimPage = 1
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
  [CLAIMS_START_RECORD_REQUEST] (state, { idx, shiftPage = 0 }) {
    changeRequestsState(state, null, true)
    state.claimRecordIndexRequested = idx
    if (shiftPage) {
      state.claimRecordIndexWait = idx
      state.currentClaimPage += shiftPage
    }
    state.claimActionsMask = 0
  },
  [CLAIMS_RECORD_GOT] (state, record) {
    state.claimRecord = record
    changeRequestsState(state, REQUEST_RECORD)
    state.claimRecordIndexActive = state.claimRecordIndexRequested
    state.claimRecordIndexRequested = null
    Events.$emit('claims:record:got')
  },
  [CLAIMS_HISTORY_GOT] (state, { history }) {
    state.claimHistory = history
    changeRequestsState(state, REQUEST_HISTORY)
    Events.$emit('claims:history:got')
  },
  [CLAIMS_FILES_GOT] (state, { files }) {
    state.claimFiles = files
    changeRequestsState(state, REQUEST_FILES)
    Events.$emit('claims:files:got')
  },
  [CLAIMS_SET_DO_NOT_UPDATE] (state, value) {
    state.doNotUpdate = value
  },
  [CLAIMS_LIST_SCROLL] (state, value) {
    state.claimRecordIndexActive = value
  },
  [CLAIM_AVAIL_ACTIONS_GOT] (state, { id, actionsMask }) {
    if (state.claimList[state.claimRecordIndexActive].id === id) state.claimActionsMask = actionsMask
  },
  [CLAIM_INSERT_DONE] (state, { id }) {
    Events.$emit('progress:reset')
    state.newAddedClaimId = id
    Events.$emit('claims:inserted')
  },
  [CLAIM_DELETE_DONE] () {
    Events.$emit('progress:reset')
    Events.$emit('app:clame:deleted')
  },
  [CLAIM_UPDATE_DONE] () {
    Events.$emit('progress:reset')
    Events.$emit('app:clame:updated')
  }
}

const actions = {
  setCurrentSort ({ commit, dispatch, getters }, { socket, value }) {
    cache.set(['userData', 'CLAIM_SORT'], value)
    commit(CLAIMS_SORT_CHANGE, value)
    if (!socket) return
    dispatch('sendClaimsRequest', {
      socket,
      discardPage: true
    })
    socket.emit('set_user_data_param', {
      sessionID: getters.sessionID,
      param: 'CLAIM_SORT',
      dataType: 'N',
      value
    })
  },
  setCurrentClaimSortOrder ({ commit, dispatch, getters }, { socket, value }) {
    const intVal = value ? 1 : 0
    cache.set(['userData', 'CLAIM_SORT_ORDER'], intVal)
    commit(CLAIMS_SORT_ORDER_CHANGE, intVal)
    if (!socket) return
    dispatch('sendClaimsRequest', {
      socket,
      discardPage: true
    })
    socket.emit('set_user_data_param', {
      sessionID: getters.sessionID,
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
  setCurrentCondition ({ commit, dispatch, getters }, { socket, value }) {
    cache.set(['userData', 'LAST_COND'], value)
    commit(CLAIMS_FILTER_CHANGE, value)
    if (!socket) return
    dispatch('sendClaimsRequest', {
      socket,
      discardPage: true
    })
    socket.emit('set_user_data_param', {
      sessionID: getters.sessionID,
      param: 'LAST_COND',
      dataType: 'N',
      value
    })
  },
  sendClaimsRequest ({ commit, state, getters }, { socket, discardPage = false }) {
    if (state.doNotUpdate) {
      commit(CLAIMS_SET_DO_NOT_UPDATE, false)
      Events.$emit('claims:list:scroll:to', { pos: state.claimRecordIndexActive })
      return
    }
    let sortStr = ''
    if (state.currentClaimSort > 0) {
      sortStr = SORT_OPTIONS[state.currentClaimSort].field
      if (state.claimSortDesc) sortStr += ' DESC'
    }
    Events.$emit('progress:set')
    socket.emit('get_claim_list', {
      sessionID: getters.sessionID,
      conditionId: state.currentCondition,
      sortOrder: sortStr,
      page: discardPage ? 1 : state.currentClaimPage,
      limit: state.currentClaimLimit,
      newClaimId: state.newAddedClaimId
    })
  },
  getClaimRecord ({ commit, state, getters }, { socket, idx }) {
    if (idx === null) idx = state.claimRecordIndexActive
    commit(CLAIMS_START_RECORD_REQUEST, { idx })
    socket.emit('get_claim_record', { sessionID: getters.sessionID, id: state.claimList[idx].id })
  },
  claimsSetDoNotUpdate ({ commit }, doNotUpdate) {
    commit(CLAIMS_SET_DO_NOT_UPDATE, doNotUpdate)
  },
  claimStepRecord ({ state, commit, dispatch, getters }, { socket, step }) {
    let needShiftPage = false
    if (step === -1) {
      if (getters.isFirstRecord) return
      if (state.claimRecordIndexActive === 0) {
        commit(CLAIMS_START_RECORD_REQUEST, { idx: state.currentClaimLimit - 1, shiftPage: -1 })
        needShiftPage = true
      }
    }
    if (step === 1) {
      if (getters.isLastRecord) return
      if (state.claimRecordIndexActive === (state.currentClaimLimit - 1)) {
        commit(CLAIMS_START_RECORD_REQUEST, { idx: 0, shiftPage: 1 })
        needShiftPage = true
      }
    }
    if (needShiftPage) {
      Events.$once('claims:ready:to:step', ({ idx }) => {
        dispatch('getClaimRecord', { socket, idx })
      })
      dispatch('sendClaimsRequest', { socket })
    }
    else {
      dispatch('getClaimRecord', { socket, idx: state.claimRecordIndexActive + step })
    }
  },
  claimsListScroll ({ state, commit }, n) {
    if (state.claimRecordIndexActive === null) return
    const i = state.claimRecordIndexActive + n
    if ((i >= 0) && (i < state.claimList.length)) commit(CLAIMS_LIST_SCROLL, i)
    Events.$emit('claims:list:scroll:to', { pos: i })
  },
  doClaimInsert ({getters}, { socket, ...rest }) {
    Events.$emit('progress:set')
    socket.emit('do_claim_insert', { sessionID: getters.sessionID, ...rest })
  },
  doClaimUpdate ({getters}, { socket, ...rest }) {
    Events.$emit('progress:set')
    socket.emit('do_claim_update', { sessionID: getters.sessionID, ...rest })
  },
  doClaimDelete ({state, getters}, {socket}) {
    Events.$emit('progress:set')
    socket.emit('do_claim_delete', { sessionID: getters.sessionID, id: state.claimRecord.id })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

import {
  CLAIMS_FILTER_CHANGE,
  CLAIMS_SORT_CHANGE,
  CLAIMS_PAGE_CHANGE,
  CLAIMS_SORT_ORDER_CHANGE,
  CLAIMS_START_RECORD_REQUEST,
  CLAIMS_SET_DO_NOT_UPDATE,
  CLAIMS_LIST_SCROLL
} from '../mutation-types'
import cache from '../../cache'
import {SORT_OPTIONS} from '../../constants'
import {Events} from 'quasar-framework'
import {formatDate, formatOnlyTime, formatDateFull} from '../../routines'
import {
  AE_PROGRESS_SET,
  AE_PROGRESS_RESET,
  AE_CLAIMS_PAGE_SHIFTED,
  AE_CLAIMS_PAGE_LOADED,
  AE_CLAIMS_FILE_UPLOADED,
  AE_CLAIMS_REC_INSERTED,
  AE_CLAIMS_REC_DELETED,
  AE_CLAIMS_REC_UPDATED,
  AE_CLAIMS_REC_ANNULED,
  AE_CLAIMS_REC_NEXTPOINTS_FOUND,
  AE_CLAIMS_REC_NEXTEXECS_FOUND,
  AE_CLAIMS_REC_STATUS_SET,
  AE_CLAIMS_REC_RET_MESSAGE_FOUND,
  AE_CLAIMS_REC_RETURNED,
  AE_CLAIMS_REC_CURREXECS_FOUND,
  AE_CLAIMS_REC_SENT,
  AE_CLAIMS_PAGE_SCROLL_TO_REC
} from '../../app-events'
import {
  mutateSockOk,
  sockOk,
  SE_LINKFILES_FIND,
  SE_LINKFILES_UPLOAD,
  SE_CLAIMS_FIND,
  SE_CLAIMS_FIND_ONE,
  SE_CLAIMS_HISTORY_FIND,
  SE_CLAIMS_NEXTPOINTS_FIND,
  SE_CLAIMS_NEXTEXECS_FIND,
  SE_CLAIMS_AVAIL_ACTIONS_FIND,
  SE_CLAIMS_DELETE,
  SE_CLAIMS_ANNUL,
  SE_CLAIMS_UPDATE,
  SE_CLAIMS_SET_STATUS,
  SE_CLAIMS_INSERT,
  SE_CLAIMS_RETURN,
  SE_CLAIMS_RETURN_MESSAGE,
  SE_CLAIMS_SEND,
  SE_CLAIMS_CURREXECS_FIND,
  SE_USER_DATA_SAVE_PARAM,
  SE_CLAIMS_NOTE_UPDATE,
  SE_CLAIMS_NOTE_INSERT,
  SE_CLAIMS_NOTE_FIND_ONE,
  SE_LINKFILES_DELETE
} from '../../socket-events'

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
    Events.$emit(AE_PROGRESS_RESET)
  }
  else {
    Events.$emit(AE_PROGRESS_SET)
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
  isActionAvail: state => action => (state.claimActionsMask & actionsFlags[action]) === actionsFlags[action],
  claimRecord: state => state.claimRecord
}

const mutations = {
  [mutateSockOk(SE_CLAIMS_FIND)] (state, {claims}) {
    state.newAddedClaimId = null
    state.claimList = claims.claims
    state.allClaimsCount = claims.allCnt
    state.currentClaimLimit = claims.limit
    state.currentClaimPage = claims.page
    state.claimListPages = Math.floor(state.allClaimsCount / state.currentClaimLimit) + 1
    cache.set('claimListPage', claims.page)
    cache.set(['userData', 'LIST_LIMIT'], claims.limit)
    Events.$emit(AE_PROGRESS_RESET)
    if (state.claimRecordIndexWait !== null) {
      Events.$emit(AE_CLAIMS_PAGE_SHIFTED, { idx: state.claimRecordIndexWait })
      state.claimRecordIndexWait = null
    }
    else {
      state.claimRecordIndexActive = state.claimList.length ? 0 : null
      Events.$emit(AE_CLAIMS_PAGE_LOADED)
    }
  },
  [mutateSockOk(SE_LINKFILES_UPLOAD)] (state, pl) {
    Events.$emit(AE_CLAIMS_FILE_UPLOADED, pl)
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
  [mutateSockOk(SE_CLAIMS_FIND_ONE)] (state, {claim}) {
    state.claimRecord = claim
    changeRequestsState(state, REQUEST_RECORD)
    state.claimRecordIndexActive = state.claimRecordIndexRequested
    state.claimRecordIndexRequested = null
  },
  [mutateSockOk(SE_CLAIMS_HISTORY_FIND)] (state, { history }) {
    state.claimHistory = history
    changeRequestsState(state, REQUEST_HISTORY)
  },
  [mutateSockOk(SE_LINKFILES_FIND)] (state, { files }) {
    state.claimFiles = files
    changeRequestsState(state, REQUEST_FILES)
  },
  [CLAIMS_SET_DO_NOT_UPDATE] (state, value) {
    state.doNotUpdate = value
  },
  [CLAIMS_LIST_SCROLL] (state, value) {
    state.claimRecordIndexActive = value
  },
  [mutateSockOk(SE_CLAIMS_AVAIL_ACTIONS_FIND)] (state, { id, actionsMask }) {
    if (state.claimList[state.claimRecordIndexActive].id === id) state.claimActionsMask = actionsMask
  },
  [mutateSockOk(SE_CLAIMS_INSERT)] (state, { id }) {
    Events.$emit(AE_PROGRESS_RESET)
    state.newAddedClaimId = id
    Events.$emit(AE_CLAIMS_REC_INSERTED)
  },
  [mutateSockOk(SE_CLAIMS_DELETE)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_DELETED)
  },
  [mutateSockOk(SE_CLAIMS_UPDATE)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_UPDATED)
  },
  [mutateSockOk(SE_CLAIMS_ANNUL)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_ANNULED)
  },
  [mutateSockOk(SE_CLAIMS_NEXTPOINTS_FIND)] (state, {points}) {
    Events.$emit(AE_CLAIMS_REC_NEXTPOINTS_FOUND, points)
  },
  [mutateSockOk(SE_CLAIMS_NEXTEXECS_FIND)] (state, {executors}) {
    Events.$emit(AE_CLAIMS_REC_NEXTEXECS_FOUND, executors)
  },
  [mutateSockOk(SE_CLAIMS_SET_STATUS)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_STATUS_SET)
  },
  [mutateSockOk(SE_CLAIMS_RETURN_MESSAGE)] (state, {message}) {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_RET_MESSAGE_FOUND, message)
  },
  [mutateSockOk(SE_CLAIMS_RETURN)] (state) {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_RETURNED)
  },
  [mutateSockOk(SE_LINKFILES_DELETE)] (state, {id}) {
    Events.$emit(AE_PROGRESS_RESET)
    state.claimFiles = state.claimFiles.filter(f => f.id !== id)
  },
  [mutateSockOk(SE_CLAIMS_CURREXECS_FIND)] (state, {executors}) {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_CURREXECS_FOUND, executors)
  },
  [mutateSockOk(SE_CLAIMS_SEND)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_CLAIMS_REC_SENT)
  },
  [mutateSockOk(SE_CLAIMS_NOTE_UPDATE)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(sockOk(SE_CLAIMS_NOTE_UPDATE))
  },
  [mutateSockOk(SE_CLAIMS_NOTE_INSERT)] () {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(sockOk(SE_CLAIMS_NOTE_INSERT))
  },
  [mutateSockOk(SE_CLAIMS_NOTE_FIND_ONE)] (state, note) {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(sockOk(SE_CLAIMS_NOTE_FIND_ONE), note)
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
    socket.emit(SE_USER_DATA_SAVE_PARAM, {
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
    socket.emit(SE_USER_DATA_SAVE_PARAM, {
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
    socket.emit(SE_USER_DATA_SAVE_PARAM, {
      sessionID: getters.sessionID,
      param: 'LAST_COND',
      dataType: 'N',
      value
    })
  },
  sendClaimsRequest ({ commit, state, getters }, { socket, discardPage = false }) {
    if (state.doNotUpdate) {
      commit(CLAIMS_SET_DO_NOT_UPDATE, false)
      Events.$emit(AE_CLAIMS_PAGE_SCROLL_TO_REC, { pos: state.claimRecordIndexActive })
      return
    }
    let sortStr = ''
    if (state.currentClaimSort > 0) {
      sortStr = SORT_OPTIONS[state.currentClaimSort].field
      if (state.claimSortDesc) sortStr += ' DESC'
    }
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_FIND, {
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
    socket.emit(SE_CLAIMS_FIND_ONE, { sessionID: getters.sessionID, id: state.claimList[idx].id })
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
      Events.$once(AE_CLAIMS_PAGE_SHIFTED, ({ idx }) => {
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
    Events.$emit(AE_CLAIMS_PAGE_SCROLL_TO_REC, { pos: i })
  },
  doClaimInsert ({getters}, { socket, ...rest }) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_INSERT, { sessionID: getters.sessionID, ...rest })
  },
  doClaimUpdate ({getters}, { socket, ...rest }) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_UPDATE, { sessionID: getters.sessionID, ...rest })
  },
  doClaimStatus ({getters, state}, { socket, ...rest }) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_SET_STATUS, {
      sessionID: getters.sessionID,
      cId: state.claimRecord.id,
      cType: state.claimRecord.claimType,
      ...rest
    })
  },
  doClaimDelete ({state, getters}, {socket}) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_DELETE, { sessionID: getters.sessionID, id: state.claimRecord.id })
  },
  doClaimAnnull ({state, getters}, {socket}) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_ANNUL, { sessionID: getters.sessionID, id: state.claimRecord.id })
  },
  claimGetNextPoints ({state, getters}, {socket}) {
    socket.emit(SE_CLAIMS_NEXTPOINTS_FIND, { sessionID: getters.sessionID, id: state.claimRecord.id })
  },
  claimGetNextExecs ({state, getters}, {socket, pointId}) {
    socket.emit(SE_CLAIMS_NEXTEXECS_FIND, { sessionID: getters.sessionID, id: state.claimRecord.id, pointId })
  },
  claimGetReturnMessage ({state, getters}, {socket}) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_RETURN_MESSAGE, { sessionID: getters.sessionID, id: state.claimRecord.id })
  },
  doClaimReturn ({state, getters}, {socket, cNoteHeader, cNote}) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_RETURN, {sessionID: getters.sessionID, cId: state.claimRecord.id, cNoteHeader, cNote})
  },
  doFileDelete ({getters}, {socket, id}) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_LINKFILES_DELETE, {sessionID: getters.sessionID, id})
  },
  doClaimSend ({state, getters}, {socket, cSendTo, cNoteHeader, cNote}) {
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_CLAIMS_SEND, {
      sessionID: getters.sessionID,
      cId: state.claimRecord.id,
      cType: state.claimRecord.claimType,
      cStatus: state.claimRecord.claimState,
      cSendTo,
      cNoteHeader,
      cNote
    })
  },
  claimGetCurrExecs ({state, getters}, {socket, id}) {
    socket.emit(SE_CLAIMS_CURREXECS_FIND, {sessionID: getters.sessionID, id: state.claimRecord.id})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

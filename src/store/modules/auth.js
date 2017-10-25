import {
  AUTH_CLEAR_ERROR,
  // AUTH_UNAUTHORIZED,
  // AUTH_ERROR,
  // AUTH_AUTHORIZED,
  // AUTH_SESSION_NOT_VALID,
  // AUTH_SESSION_VALIDATED,
  // AUTH_USER_DATA_LOADED,
  APP_SESSION_RESET
} from '../mutation-types'
import { Events } from 'quasar-framework'
import cache from '../../cache'
import {
  mutateSockOk,
  mutateSockErr,
  actionSockOk,
  actionSockErr,
  SE_AUTH_LOGIN,
  SE_AUTH_CHECK,
  SE_AUTH_LOGOFF,
  SE_AUTH_VALIDATE,
  SE_USER_DATA_LOAD
} from '../../socket-events'
import {
  AE_PROGRESS_SET,
  AE_PROGRESS_RESET,
  AE_SESSION_NOT_VALID,
  AE_SESSION_REVALIDATE,
  AE_USERDATA_LOADED
} from '../../app-events'

function parseUserData (data) {
  let result = {}
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    result[row['PARAM_NAME']] = row['STR_VAL'] || row['NUM_VAL'] || row['DAT_VAL']
  }
  return result
}

const state = {
  authError: '',
  authorized: false,
  userFullName: cache.get('userFullName'),
  sessionID: cache.get('sessionID'),
  userData: cache.get('userData'),
  isPmo: false
}

const mutations = {
  [APP_SESSION_RESET] (state) {
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    state.isPmo = false
    cache.clear()
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_SESSION_NOT_VALID)
  },
  [mutateSockErr(SE_AUTH_CHECK)] (state, msg) {
    Events.$emit(AE_PROGRESS_RESET)
    Events.$emit(AE_SESSION_REVALIDATE)
  },
  [mutateSockErr(SE_AUTH_LOGIN)] (state, msg) {
    state.authError = msg.message
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    state.isPmo = false
    cache.unset('sessionID')
    cache.unset('userFullName')
    cache.unset('isPmo')
    Events.$emit(AE_PROGRESS_RESET)
  },
  [mutateSockOk(SE_AUTH_LOGIN)] (state, msg) {
    state.authorized = true
    state.userFullName = msg.userFullName
    state.sessionID = msg.sessionID
    state.isPmo = !!msg.isPmo
    cache.set('sessionID', msg.sessionID)
    cache.set('userFullName', msg.userFullName)
    cache.set('isPmo', !!msg.isPmo)
    Events.$emit(AE_PROGRESS_RESET)
  },
  [mutateSockOk(SE_AUTH_VALIDATE)] (state) {
    state.authorized = true
  },
  [mutateSockOk(SE_USER_DATA_LOAD)] (state, {userData}) {
    state.userData = parseUserData(userData)
    cache.set('userData', state.userData)
    Events.$emit(AE_USERDATA_LOADED)
  },
  [AUTH_CLEAR_ERROR] (state) {
    state.authError = ''
  }
}
const getters = {
  sessionID: state => state.sessionID
}

const actions = {
  socket_userDataLoaded ({ dispatch }) {
    dispatch('setCurrentCondition', {value: cache.get(['userData', 'LAST_COND'], 1)})
  },
  authDoLogin ({commit}, {socket, ...pl}) {
    commit(AUTH_CLEAR_ERROR)
    Events.$emit(AE_PROGRESS_SET)
    socket.emit(SE_AUTH_LOGIN, pl)
  },
  authDoLogoff ({getters}, {socket, router, route = '/main'}) {
    router && router.push(route)
    socket && socket.emit(SE_AUTH_LOGOFF, { sessionID: getters.sessionID })
  },
  validateSession ({state}, {socket}) {
    socket.emit(SE_AUTH_VALIDATE, {sessionID: state.sessionID})
  },
  [actionSockOk(SE_AUTH_LOGOFF)] ({commit}) {
    commit(APP_SESSION_RESET)
  },
  [actionSockErr(SE_AUTH_LOGOFF)] ({commit}) {
    commit(APP_SESSION_RESET)
  },
  [actionSockErr(SE_AUTH_VALIDATE)] ({commit}) {
    commit(APP_SESSION_RESET)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

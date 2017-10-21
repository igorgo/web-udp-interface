import {
  AUTH_CLEAR_ERROR,
  AUTH_UNAUTHORIZED,
  AUTH_ERROR,
  AUTH_AUTHORIZED,
  AUTH_SESSION_NOT_VALID,
  AUTH_SESSION_VALIDATED,
  AUTH_USER_DATA_LOADED
} from '../mutation-types'
import { Events } from 'quasar-framework'
import cache from '../../cache'

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
  [AUTH_UNAUTHORIZED] (state, msg) {
    Events.$emit('app:unauthorized')
  },
  [AUTH_ERROR] (state, msg) {
    state.authError = msg.message
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    state.isPmo = false
    cache.unset('sessionID')
    cache.unset('userFullName')
    cache.unset('isPmo')
  },
  [AUTH_AUTHORIZED] (state, msg) {
    state.authorized = true
    state.userFullName = msg.userFullName
    state.sessionID = msg.sessionID
    state.isPmo = !!msg.isPmo
    cache.set('sessionID', msg.sessionID)
    cache.set('userFullName', msg.userFullName)
    cache.set('isPmo', !!msg.isPmo)
  },
  [AUTH_SESSION_NOT_VALID] (state) {
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    state.isPmo = false
    cache.clear()
    Events.$emit('app:session:not:valid')
  },
  [AUTH_SESSION_VALIDATED] (state) {
    state.authorized = true
  },
  [AUTH_USER_DATA_LOADED] (state, msg) {
    state.userData = parseUserData(msg)
    cache.set('userData', state.userData)
    Events.$emit('app:userdata:loaded')
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
    socket.emit('authenticate', pl)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

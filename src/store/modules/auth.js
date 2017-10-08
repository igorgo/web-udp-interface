/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */

import * as types from '../mutation-types'
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
  userData: cache.get('userData')
}

const mutations = {
  [types.AUTH_UNAUTHORIZED] (state, msg) {
    Events.$emit('app:unauthorized')
  },
  [types.AUTH_ERROR] (state, msg) {
    state.authError = msg.message
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    cache.unset('sessionID')
    cache.unset('userFullName')
  },
  [types.AUTH_AUTHORIZED] (state, msg) {
    state.authorized = true
    state.userFullName = msg.userFullName
    state.sessionID = msg.sessionID
    cache.set('sessionID', msg.sessionID)
    cache.set('userFullName', msg.userFullName)
  },
  [types.AUTH_SESSION_NOT_VALID] (state) {
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    cache.clear()
    Events.$emit('app:session:not:valid')
  },
  [types.AUTH_SESSION_VALIDATED] (state) {
    state.authorized = true
  },
  [types.AUTH_USER_DATA_LOADED] (state, msg) {
    state.userData = parseUserData(msg)
    cache.set('userData', state.userData)
  }
}
const getters = {
  sessionID: state => state.sessionID
}

const actions = {
  socket_userDataLoaded ({ dispatch }) {
    dispatch('setCurrentCondition', {value: cache.get(['userData', 'LAST_COND'], 1)})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

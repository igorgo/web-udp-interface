/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */

import * as types from '../mutation-types'
import { Toast } from 'quasar'
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
  [types.UNAUTHORIZED] (state, msg) {
    state.authError = ''
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    cache.clear()
    if (msg && msg.message) Toast.create.negative(msg.message)
  },
  [types.AUTH_ERROR] (state, msg) {
    state.authError = msg.message
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    cache.unset('sessionID')
    cache.unset('userFullName')
  },
  [types.AUTHORIZED] (state, msg) {
    state.authorized = true
    state.userFullName = msg.userFullName
    state.sessionID = msg.sessionID
    cache.set('sessionID', msg.sessionID)
    cache.set('userFullName', msg.userFullName)
  },
  [types.SESSION_NOT_VALID] (state) {
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
    cache.clear()
  },
  [types.SESSION_VALIDATED] (state) {
    state.authorized = true
  },
  [types.USER_DATA_LOADED] (state, msg) {
    state.userData = parseUserData(msg)
    cache.set('userData', parseUserData(msg))
  }
}
const getters = {
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

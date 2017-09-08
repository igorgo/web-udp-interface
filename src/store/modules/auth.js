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

const storage = SessionStorage
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
    if (msg && msg.message) Toast.create.negative(msg.message)
  },
  [types.AUTH_ERROR] (state, msg) {
    state.authError = msg.message
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
  },
  [types.AUTHORIZED] (state, msg) {
    state.authorized = true
    state.userFullName = msg.userFullName
    state.sessionID = msg.sessionID
  },
  [types.SESSION_NOT_VALID] (state) {
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
  },
  [types.SESSION_VALIDATED] (state) {
    state.authorized = true
  },
  [types.USER_DATA_LOADED] (state, msg) {
    state.userData = parseUserData(msg)
  }
}
const getters = {
  authError: state => state.authError,
  authorized: state => state.authorized,
  sessionID: state => state.sessionID,
  userFullName: state => state.userFullName
}

const actions = {
  socket_authError: (ctx) => {
    ctx.rootState.storage.remove('sessionID')
    ctx.rootState.storage.remove('userFullName')
  },
  socket_authorized: (ctx, msg) => {
    ctx.rootState.storage.set('sessionID', msg.sessionID)
    ctx.rootState.storage.set('userFullName', msg.userFullName)
  },
  socket_unauthorized: (ctx) => {
    ctx.rootState.storage.clear()
  },
  socket_sessionNotValid: (ctx) => {
    ctx.rootState.storage.clear()
  },
  socket_userDataLoaded: (ctx, msg) => {
    ctx.rootState.storage.set('userData', parseUserData(msg))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

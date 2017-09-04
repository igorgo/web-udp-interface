/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */

import * as types from '../mutation-types'
import { SessionStorage } from 'quasar'

const storage = SessionStorage
const state = {
  authError: '',
  authorized: false,
  userFullName: storage.get.item('userFullName'),
  sessionID: storage.get.item('sessionID')
}

const mutations = {
  [types.UNAUTHORIZED] (state, socket) {
    state.authError = ''
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
  },
  [types.AUTH_ERROR] (state, socket) {
    state.authError = socket.message
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
  },
  [types.AUTHORIZED] (state, socket) {
    state.authorized = true
    state.userFullName = socket.userFullName
    state.sessionID = socket.sessionID
  },
  [types.SESSION_NOT_VALID] (state, socket) {
    state.authorized = false
    state.userFullName = ''
    state.sessionID = ''
  },
  [types.SESSION_VALIDATED] (state, socket) {
    state.authorized = true
  }
}
const getters = {
  authError: state => state.authError,
  authorized: state => state.authorized,
  sessionID: state => state.sessionID,
  userFullName: state => state.userFullName
}

const actions = {
  socket_authError: (ctx, msg) => {
    ctx.rootState.storage.remove('sessionID')
    ctx.rootState.storage.remove('userFullName')
  },
  socket_authorized: (ctx, msg) => {
    ctx.rootState.storage.set('sessionID', msg.sessionID)
    ctx.rootState.storage.set('userFullName', msg.userFullName)
  },
  socket_unauthorized: (ctx, msg) => {
    ctx.rootState.storage.clear()
  },
  socket_sessionNotValid: (ctx, msg) => {
    ctx.rootState.storage.clear()
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

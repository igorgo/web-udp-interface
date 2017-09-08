/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */
import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import main from './modules/main'
import filters from './modules/filters'
import claims from './modules/claims'
// import * as types from './mutation-types'
import { Toast } from 'quasar'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const state = {
  connect: false
}
export default new Vuex.Store({
  state,
  modules: {
    auth,
    main,
    filters,
    claims
  },
  actions: {
    socket_oraExecError (ctx, msg) {
      Toast.create.negative(msg.message)
    }
  },
  getters: {
  },
  mutations: {
    SOCKET_CONNECT: (state, status) => {
      state.connect = true
    }
  },
  strict: debug
})

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
// import * as types from './mutation-types'
import { SessionStorage, Toast } from 'quasar'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const state = {
  storage: SessionStorage,
  connect: false,
  emptyStorage: true
}
export default new Vuex.Store({
  state,
  modules: {
    auth,
    main,
    filters
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

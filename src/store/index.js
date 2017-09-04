/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */
import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import main from './modules/main'
// import * as types from './mutation-types'
import { SessionStorage } from 'quasar'

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
    main
  },
  actions: {
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

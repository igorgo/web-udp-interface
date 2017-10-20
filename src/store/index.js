import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import main from './modules/main'
import filters from './modules/filters'
import claims from './modules/claims'
import staticDicts from './modules/staticDicts'
import {Toast, Platform, SessionStorage} from 'quasar-framework'
import {SET_ACTION_PROGRESS, RESET_ACTION_PROGRESS} from './mutation-types'

Vue.use(Vuex)

const state = {
  connect: false,
  actionInProgress: false
}

export default new Vuex.Store({
  state,
  modules: {
    auth,
    main,
    filters,
    claims,
    staticDicts
  },
  actions: {
    socket_oraExecError (ctx, msg) {
      ctx.commit(RESET_ACTION_PROGRESS)
      Toast.create.negative(msg.message)
    },
    rootLogoff ({getters}, {socket, router, route = '/main'}) {
      router && router.push(route)
      socket && socket.emit('logoff', { sessionID: getters.sessionID })
    },
    setActionProgress ({commit}) {
      commit(SET_ACTION_PROGRESS)
    },
    resetActionProgress ({commit}) {
      commit(RESET_ACTION_PROGRESS)
    }
  },
  getters: {
    isNotTouch () {
      return !Platform.has.touch
    },
    isActionInProgress: state => state.actionInProgress
  },
  mutations: {
    SOCKET_CONNECT: (state) => {
      state.connect = true
    },
    [SET_ACTION_PROGRESS] (state) {
      state.actionInProgress = true
    },
    [RESET_ACTION_PROGRESS] (state) {
      state.actionInProgress = false
    }
  },
  strict: true,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => SessionStorage.get.item(key),
        setItem: (key, value) => SessionStorage.set(key, value),
        removeItem: key => SessionStorage.remove(key)
      }
    })
  ]
})

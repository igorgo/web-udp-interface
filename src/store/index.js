import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import main from './modules/main'
import filters from './modules/filters'
import claims from './modules/claims'
import staticDicts from './modules/staticDicts'
import { Toast } from 'quasar-framework'
Vue.use(Vuex)

const state = {
  connect: false
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
      Toast.create.negative(msg.message)
    },
    rootLogoff (ctx, {socket, router, route = '/main'}) {
      router && router.push(route)
      socket && socket.emit('logoff')
    }
  },
  getters: {
  },
  mutations: {
    SOCKET_CONNECT: (state) => {
      state.connect = true
    }
  },
  strict: true
})

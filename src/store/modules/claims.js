import * as mts from '../mutation-types'

const state = {
  claimList: {}
}

const getters = {
  claimList: state => state.claimList
}

const mutations = {
  [mts.CLAIM_LIST] (state, result) {
    state.filters = result
  }
}
const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}

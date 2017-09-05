import * as mts from '../mutation-types'

const state = {
  filters: []
}

const getters = {
  filters: state => state.filters
}

const mutations = {
  [mts.CLAIM_CONDITIONS_LIST] (state, result) {
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

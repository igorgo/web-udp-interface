import * as mts from '../mutation-types'

const state = {
  filters: []
}

const getters = {
  filterOptions: state => state.filters.map(f => {
    return {
      label: f['SNAME'],
      value: f['RN']
    }
  })
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

import * as mts from '../mutation-types'
import cache from '../../cache'

const state = {
  claimListPortion: {
    claims: [],
    allCnt: 0,
    page: 1,
    limit: 25
  },
  currentCondition: cache.get(['userData', 'LAST_COND'], null)
}

const getters = {
  claimList: state => state.claimListPortion.claims,
  claimsCount: state => state.claimListPortion.allCnt,
  claimListPage: state => state.claimListPortion.page,
  claimListLimit: state => state.claimListPortion.limit,
  currentCondition: state => state.currentCondition
}

const mutations = {
  [mts.CLAIM_LIST] (state, result) {
    state.claimListPortion = result
  }
}
const actions = {
  setCurrentCondition (nCond) {
    state.currentCondition = nCond
    cache.set(['userData', 'LAST_COND'], nCond)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

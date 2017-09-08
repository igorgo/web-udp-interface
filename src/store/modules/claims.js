import * as mts from '../mutation-types'
import { SessionStorage } from 'quasar'
import * as _ from 'lodash'

const storage = SessionStorage

function defaultCondition() {
  if (storage.has('userData')) {
    if (_.has(storage.get.item('userData'), 'LAST_COND')) {
      return storage.get.item('userData')['LAST_COND']
    }
  }
  return null
}

const state = {
  claimListPortion: {
    claims: [],
    allCnt: 0,
    page: 1,
    limit: 25
  },
  currentCondition: defaultCondition()
}

const getters = {
  claimList: state => state.claimListPortion.claims,
  claimsCount: state => state.claimListPortion.allCnt,
  claimListPage: state => state.claimListPortion.page,
  claimListLimit: state => state.claimListPortion.limit
}

const mutations = {
  [mts.CLAIM_LIST] (state, result) {
    state.claimListPortion = result
  }
}
const actions = {
  setCurrentCondition
}

export default {
  state,
  getters,
  mutations,
  actions
}

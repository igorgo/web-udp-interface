import * as mts from '../mutation-types'
import cache from '../../cache'
import * as _ from 'lodash'

const state = {
  claimListPortion: {
    claims: [],
    allCnt: 0,
    page: 1,
    limit: 25
  },
  currentCondition: cache.get(['userData', 'LAST_COND'], 1),
  currentClaimLimit: cache.get(['userData', 'LIST_LIMIT'], 25),
  currentClaimPage: cache.get('claimListPage', 1)
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
  },
  [mts.CLAIMS_FILTER_CHANGE] (state, playload) {
    cache.set(['userData', 'LAST_COND'], playload.value)
    state.currentCondition = playload.value
    cache.set('claimListPage', 1)
    if (_.has(playload, 'socket')) {
      playload.socket.emit('get_claim_list', {
        conditionId: playload.value,
        // todo: sortorder
        sortOrder: null,
        page: 1,
        limit: cache.get(['userData', 'LIST_LIMIT'], 25),
        newClaimId: null
      })
    }
  },
  [mts.CLAIMS_LIMIT_CHANGE] (state, pl) {
  }
}
const actions = {
  setCurrentCondition (context, playload) {
    context.commit(mts.CLAIMS_FILTER_CHANGE, playload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

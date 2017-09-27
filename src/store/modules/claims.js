import * as mts from '../mutation-types'
import cache from '../../cache'
import * as _ from 'lodash'
import {claimsRequest} from '../../routines'
import * as c from '../../constants'
import { Events } from 'quasar'

const state = {
  allClaimsCount: 0,
  claimList: [],
  currentCondition: cache.get(['userData', 'LAST_COND'], null),
  currentClaimLimit: cache.get(['userData', 'LIST_LIMIT'], 25),
  currentClaimPage: cache.get('claimListPage', 1),
  currentClaimSort: cache.get(['userData', 'CLAIM_SORT'], 2),
  claimSortDesc: cache.get(['userData', 'CLAIM_SORT_ORDER'], 1)
}

const getters = {
  claimListPages: state => Math.floor(state.allClaimsCount / state.currentClaimLimit) + 1,
  sortsList: () => c.SORT_OPTIONS.map((item, ind) => { return {label: item.label, value: ind} }),
  claimSortDesc: state => !!state.claimSortDesc
}

const mutations = {
  [mts.CLAIM_LIST] (state, result) {
    state.claimList = result.claims
    state.allClaimsCount = result.allCnt
    state.currentClaimLimit = result.limit
    state.currentClaimPage = result.page
    cache.set('claimListPage', result.page)
    cache.set(['userData', 'LIST_LIMIT'], result.limit)
    Events.$emit('new-portion')
  },
  [mts.CLAIMS_FILTER_CHANGE] (state, playload) {
    cache.set(['userData', 'LAST_COND'], playload.value)
    state.currentCondition = playload.value
    if (_.has(playload, 'socket')) {
      claimsRequest(
        playload.socket,
        playload.value,
        state.currentClaimSort,
        state.claimSortDesc,
        1,
        state.currentClaimLimit,
        null
      )
      playload.socket.emit('set_user_data_param', {
        param: 'LAST_COND',
        dataType: 'N',
        value: playload.value
      })
    }
  },
  [mts.CLAIMS_SORT_CHANGE] (state, playload) {
    cache.set(['userData', 'CLAIM_SORT'], playload.value)
    state.currentClaimSort = playload.value
    if (_.has(playload, 'socket')) {
      claimsRequest(
        playload.socket,
        state.currentCondition,
        playload.value,
        state.claimSortDesc,
        1,
        state.currentClaimLimit,
        null
      )
      playload.socket.emit('set_user_data_param', {
        param: 'CLAIM_SORT',
        dataType: 'N',
        value: playload.value
      })
    }
  },
  [mts.CLAIMS_PAGE_CHANGE]  (state, playload) {
    if (_.has(playload, 'socket')) {
      claimsRequest(
        playload.socket,
        state.currentCondition,
        state.currentClaimSort,
        state.claimSortDesc,
        playload.value,
        state.currentClaimLimit,
        null
      )
    }
  },
  [mts.CLAIMS_SORT_ORDER_CHANGE]  (state, playload) {
    const val = playload.value ? 1 : 0
    cache.set(['userData', 'CLAIM_SORT'], val)
    state.claimSortDesc = val
    if (_.has(playload, 'socket')) {
      claimsRequest(
        playload.socket,
        state.currentCondition,
        state.currentClaimSort,
        val,
        1,
        state.currentClaimLimit,
        null
      )
      playload.socket.emit('set_user_data_param', {
        param: 'CLAIM_SORT_ORDER',
        dataType: 'N',
        value: val
      })
    }
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

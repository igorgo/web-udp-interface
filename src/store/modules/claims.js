import * as mts from '../mutation-types'
import cache from '../../cache'
import * as _ from 'lodash'

const sorts = [
  {
    label: '',
    field: ''
  },
  {
    label: 'Дата реєстрації',
    field: 'REG_DATE'
  },
  {
    label: 'Дата зміни',
    field: 'CHANGE_DATE'
  },
  {
    label: 'Виконавець',
    field: 'EXECUTOR'
  },
  {
    label: 'Автор',
    field: 'INITIATOR'
  },
  {
    label: 'Пріоритет',
    field: 'PRIORITY'
  }
]

const state = {
  allClaimsCount: 0,
  claimList: [],
  currentCondition: cache.get(['userData', 'LAST_COND'], 1),
  currentClaimLimit: cache.get(['userData', 'LIST_LIMIT'], 25),
  currentClaimPage: cache.get('claimListPage', 1),
  currentClaimSort: cache.get(['userData', 'CLAIM_SORT'], 0),
  claimSortDesc: cache.get(['userData', 'CLAIM_SORT_ORDER'], 0)
}

const getters = {
  claimsCount: state => state.allClaimsCount,
  claimListPage: state => state.currentClaimPage,
  claimListLimit: state => state.currentClaimLimit,
  currentCondition: state => state.currentCondition,
  allClaimsCount: state => state.allClaimsCount,
  claimList: state => state.claimList,
  sortsList: () => sorts.map((item, ind) => { return {label: item.label, value: ind} }),
  claimSortDesc: state => !!state.claimSortDesc,
  claimSort: state => state.currentClaimSort
}

function claimsRequest (socket, cond, sort, sortOrd, page, limit, newId) {
  let sortStr = ''
  if (sort > 0) {
    sortStr = sorts[sort].field
    if (sortOrd) sortStr += ' DESC'
  }
  socket.emit('get_claim_list', {
    conditionId: cond,
    sortOrder: sortStr,
    page: page,
    limit: limit,
    newClaimId: newId
  })
}

const mutations = {
  [mts.CLAIM_LIST] (state, result) {
    state.claimList = result.claims
    state.claimsCount = result.allCnt
    state.currentClaimLimit = result.limit
    state.currentClaimPage = result.page
    cache.set('claimListPage', result.page)
    cache.set(['userData', 'LIST_LIMIT'], result.limit)
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
  [mts.CLAIMS_SORT_CHANGE]  (state, playload) {
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

/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */
import {date} from 'quasar'
import * as c from './constants'

export const formatDate = str => date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY') : str
export const formatDateTime = str => date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY HH:mm:ss') : str
export const claimsRequest = (socket, cond, sort, sortOrd, page, limit, newId) => {
  let sortStr = ''
  if (sort > 0) {
    sortStr = c.SORT_OPTIONS[sort].field
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

export const inclFilter = (what, { field, list }) => {
  const needle = what.toLowerCase()
  return list.filter(item => item[field].toLowerCase().indexOf(needle) > -1)
}

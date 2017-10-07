/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */
import {date} from 'quasar-framework'

function formatDate (str) {
  return date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY') : str
}

function formatDateTime (str) {
  return date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY HH:mm:ss') : str
}

function inclFilter (what, { field, list }) {
  const needle = what.toLowerCase()
  return list.filter(item => item[field].toLowerCase().indexOf(needle) > -1)
}

function hrFileSize (bites) {
  if (isNaN(bites)) {
    throw new Error('Invalid number')
  }

  let result = []

  const symbol = ['байт', 'Kб', 'Mб', 'Гб']
  let e = Math.floor(Math.log(bites) / Math.log(1024))
  if (e > 3) {
    e = 3
  }
  if (bites === 0) {
    result[0] = 0
    result[1] = symbol[e]
  }
  else {
    const val = bites / Math.pow(2, e * 10)
    result[0] = Number(val.toFixed(e > 0 ? 2 : 0))
    result[1] = symbol[e]
    return result.join(' ')
  }
}

function strNotEmpty (str) {
  return str ? str.trim().length > 0 : false
}

function mapEvent ({eventMapper, $q}, listen) {
  if (!eventMapper) return
  for (let i in eventMapper) {
    if (eventMapper.hasOwnProperty(i)) {
      if (listen) $q.events.$on(i, eventMapper[i])
      else $q.events.$off(i, eventMapper[i])
    }
  }
}

export {
  formatDate,
  formatDateTime,
  inclFilter,
  hrFileSize,
  strNotEmpty,
  mapEvent
}

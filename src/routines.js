import {date} from 'quasar-framework'
import {DAY_NAMES, MONTH_NAMES} from './constants'

export function formatDate (str) {
  return date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY') : str
}

export function formatDateFull (str) {
  return date.isValid(str)
    ? date.formatDate(
      new Date(str),
      'D MMMM YYYY, dddd',
      {dayNames: DAY_NAMES, monthNames: MONTH_NAMES}
    )
    : str
}

export function formatDateTime (str) {
  return date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY HH:mm:ss') : str
}

export function formatOnlyTime (str, sec = true) {
  const fs = sec ? 'HH:mm:ss' : 'HH:mm'
  return date.isValid(str) ? date.formatDate(new Date(str), fs) : str
}

export function inclFilter (what, { field, list }) {
  const tokens = what.split(';')
  const needle = tokens[tokens.length - 1].toLowerCase()
  return needle ? list.filter(item => item[field].toLowerCase().indexOf(needle) > -1) : []
}

/*
export function multiLineToArray (str) {
  return str ? str.replace(/\r\n/g, '\n').split('\n') : []
}
*/

export function hrFileSize (bites) {
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
    result[1] = symbol[0]
  }
  else {
    const val = bites / Math.pow(2, e * 10)
    result[0] = Number(val.toFixed(e > 0 ? 2 : 0))
    result[1] = symbol[e]
  }
  return result.join(' ')
}

export function strNotEmpty (str) {
  return str ? str.trim().length > 0 : false
}

export function mapEvents ({eventsMap, $q}, listen) {
  if (!eventsMap) return
  for (let i in eventsMap) {
    if (eventsMap.hasOwnProperty(i)) {
      if (listen) $q.events.$on(i, eventsMap[i])
      else $q.events.$off(i, eventsMap[i])
    }
  }
}

export function cloneObject (data) {
  return JSON.parse(JSON.stringify(data))
}

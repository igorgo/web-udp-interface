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

export {
  formatDate,
  formatDateTime,
  inclFilter
}

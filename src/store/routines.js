/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */
import {date} from 'quasar'

export const formatDate = str => date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY') : str
export const formatDateTime = str => date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY HH:mm:ss') : str

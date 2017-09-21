/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */

import * as mts from '../mutation-types'
import cache from '../../cache'
import {formatDate} from '../../routines'

function makeCurReleases (cursor) {
  function makeRelease (rownum) {
    return rownum !== -1 ? {
      releaseName: cursor[rownum]['RELNAME'],
      releaseDate: formatDate(cursor[rownum]['RELDATE']),
      lastBuildNumber: cursor[rownum]['BLDNUMB'],
      lastBuildDate: formatDate(cursor[rownum]['DBUILDATE']),
      openedIssues: cursor[rownum]['OPENED'],
      closedIssues: cursor[rownum]['CLOSED']
    } : {
      releaseName: null,
      releaseDate: null,
      lastBuildNumber: null,
      lastBuildDate: null,
      openedIssues: null,
      closedIssues: null
    }
  }

  return {
    beta: makeRelease(cursor.length > 0 ? 0 : -1),
    stable: makeRelease(cursor.length > 1 ? 1 : -1)
  }
}

const state = {
  curReleases: cache.get('curReleases', makeCurReleases([])),
  releasesLoaded: cache.has('curReleases')
}

const getters = {
  curReleases: state => state.curReleases,
  releasesLoaded: (state) => state.releasesLoaded
}

const mutations = {
  [mts.SET_CUR_RELEASES] (state, result) {
    state.curReleases = makeCurReleases(result)
    state.releasesLoaded = true
    cache.set('curReleases', makeCurReleases(result))
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}

/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */

import * as mts from '../mutation-types'
import { SessionStorage } from 'quasar'
import { formatDate } from '../routines'
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

const storage = SessionStorage

const state = {
  curReleases: storage.has('curReleases') ? storage.get.item('curReleases') : makeCurReleases([]),
  releasesLoaded: storage.has('curReleases')
}

const getters = {
  curReleases: state => state.curReleases,
  releasesLoaded: (state) => state.releasesLoaded
}

const mutations = {
  [mts.SET_CUR_RELEASES] (state, result) {
    state.curReleases = makeCurReleases(result)
    state.releasesLoaded = true
  }
}
const actions = {
  socket_setCurReleases: (ctx, msg) => {
    console.log(msg)
    ctx.rootState.storage.set('curReleases', makeCurReleases(msg))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

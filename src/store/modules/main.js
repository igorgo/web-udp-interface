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
      version: cursor[rownum]['VER'],
      releaseNumber: cursor[rownum]['RELNUMB'],
      releaseName: cursor[rownum]['RELNAME'],
      releaseDate: formatDate(cursor[rownum]['RELDATE']),
      lastBuildNumber: cursor[rownum]['BLDNUMB'],
      lastBuildName: cursor[rownum]['BLDNAME'],
      lastBuildDate: formatDate(cursor[rownum]['DBUILDATE'])
    } : {
      version: null,
      releaseNumber: null,
      releaseName: null,
      releaseDate: null,
      lastBuildNumber: null,
      lastBuildName: null,
      lastBuildDate: null
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

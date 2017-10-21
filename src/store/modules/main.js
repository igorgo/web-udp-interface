import {MAIN_SET_CUR_RELEASES, LINKED_FILE_GOT} from '../mutation-types'
import cache from '../../cache'
import {formatDate} from '../../routines'
import fileSaver from 'file-saver'
import {Events} from 'quasar-framework'

function makeCurReleases (cursor) {
  function makeRelease (rownum) {
    return rownum !== -1 ? {
      releaseName: cursor[rownum]['RELNAME'],
      releaseDate: formatDate(cursor[rownum]['RELDATE']),
      lastBuildNumber: cursor[rownum]['BLDNUMB'],
      lastBuildDate: formatDate(cursor[rownum]['DBUILDATE']),
      openedIssues: cursor[rownum]['OPENED'],
      closedIssues: cursor[rownum]['CLOSED'],
      version: cursor[rownum]['version']
    } : {
      releaseName: null,
      releaseDate: null,
      lastBuildNumber: null,
      lastBuildDate: null,
      openedIssues: null,
      closedIssues: null,
      version: null
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
}

const mutations = {
  [MAIN_SET_CUR_RELEASES] (state, result) {
    state.curReleases = makeCurReleases(result)
    state.releasesLoaded = true
    cache.set('curReleases', makeCurReleases(result))
    Events.$emit('progress:reset')
  },
  [LINKED_FILE_GOT] (state, {fileData, fileName, mimeType}) {
    const blob = new Blob([fileData], {type: mimeType})
    fileSaver.saveAs(blob, fileName)
  }
}

const actions = {
  getCurReleases ({state}, {socket}) {
    if (!state.releasesLoaded) {
      Events.$emit('progress:set')
      socket.emit('get_cur_releases')
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

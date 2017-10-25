import cache from '../../cache'
import {formatDate} from '../../routines'
import fileSaver from 'file-saver'
import {Events} from 'quasar-framework'
import {
  AE_PROGRESS_SET,
  AE_PROGRESS_RESET
} from '../../app-events'
import {
  mutateSockOk,
  SE_PUB_CURRENT_RELEASES,
  SE_LINKFILES_DOWNLOAD,
  SE_LINKFILES_UPLOAD
} from '../../socket-events'

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
  [mutateSockOk(SE_PUB_CURRENT_RELEASES)] (state, {releases}) {
    state.curReleases = makeCurReleases(releases)
    state.releasesLoaded = true
    cache.set('curReleases', makeCurReleases(releases))
    Events.$emit(AE_PROGRESS_RESET)
  },
  [mutateSockOk(SE_LINKFILES_DOWNLOAD)] (state, {fileData, fileName, mimeType}) {
    const blob = new Blob([fileData], {type: mimeType})
    fileSaver.saveAs(blob, fileName)
  }
}

const actions = {
  getCurReleases ({state}, {socket}) {
    if (!state.releasesLoaded) {
      Events.$emit(AE_PROGRESS_SET)
      socket.emit(SE_PUB_CURRENT_RELEASES)
    }
  },
  downloadLinkedFile ({getters}, {socket, id}) {
    socket.emit(SE_LINKFILES_DOWNLOAD, { sessionID: getters.sessionID, id })
  },
  uploadLinkedFile ({getters}, {socket, id, filename, content}) {
    socket.emit(SE_LINKFILES_UPLOAD, {sessionID: getters.sessionID, id, filename, content})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

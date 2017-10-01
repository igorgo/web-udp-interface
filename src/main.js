// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
// import { Events } from 'quasar-framework'
import router from './router'
import store from './store'
import VueSocketio from 'vue-socket.io'
import c from './constants'

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueSocketio, c.SERVER_URL, store)

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

import keyMapper from './keyMapper'
Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App')),
    methods: {
      globalKeyListener (event) {
        if (event.metaKey) return
        // event.preventDefault()
        let modifiers = 0
        if (event.ctrlKey) modifiers += 1
        if (event.shiftKey) modifiers += 2
        if (event.altKey) modifiers += 4
        if (!keyMapper.hasOwnProperty(event.keyCode)) return
        if (!keyMapper[event.keyCode].hasOwnProperty(modifiers)) return
        this.$q.events.$emit(keyMapper[event.keyCode][modifiers])
      }
    },
    created () {
      window.addEventListener('keydown', this.globalKeyListener)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.globalKeyListener)
    }
  })
})

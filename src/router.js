import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

const routes = [
  {path: '/rrr', component: load('Hello')},
  {
    path: '/',
    component: load('Index'),
    children: [
      {path: '', component: load('Main')},
      {path: '/login', component: load('Login')},
      {path: '/main', component: load('Main')}
    ]
  },
  /*
  { path: '/',
    component: load('Main'),
    children: [
      {
        path: 'aaa',
        component: load('Hello')
      }
    ]
  },
  */
  // Always leave this last one
  { path: '*', component: load('Error404') } // Not found
]

const Router = new VueRouter({routes})

/*
Router.beforeEach((to, from, next) => {
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  next()
})
*/

export default Router

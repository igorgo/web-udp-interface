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
      {path: '', component: load('main/Main')},
      {path: '/login', component: load('Login')},
      {path: '/filter', component: load('filters/CondFilterEdit')},
      {path: '/filters', component: load('filters/CondFilters')},
      {path: '/claims', component: load('claims/Claims')},
      {path: '/claim/view', component: load('claims/claim/ClaimMainView')},
      // {path: '/claim/new', component: load('claims/claim/ClaimNew')},
      {path: '/main', component: load('main/Main')}
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

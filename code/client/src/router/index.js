import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

import institutionAdmin from './routes/institutionAdmin.js'
import khateebs from './routes/khateebs.js'
import auth from './routes/auth.js'
import user from './routes/user.js'
import sysAdmin from './routes/sysAdmin.js'

import _utils from '@/libraries/globalStateMutators.js'
import helpers from '@/libraries/router/main.js'
import beforeNavHooks from '@/libraries/router/beforeNavigationHooks.js'
import requestQueryHelpers from '@/libraries/requests/queries/main.js'
import notificationHelpers from '@/libraries/notifications/main.js'

import homepage from '@/views/homepage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Not Found',
    component: () => import ('@/views/404.vue')
  },
  {
    path: '/',
    name: "homepage",
    component: homepage
  },
  ...khateebs,
  ...auth,
  ...sysAdmin,
  ...institutionAdmin,
  ...user
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  parseQuery(queryString) {
    return requestQueryHelpers.parse(queryString)
  },
  stringifyQuery(query) {
    const result = requestQueryHelpers.stringify(query)
    return result ? "?" + result : ''
  }
})

// register landing page hook
router.beforeEach((to, _, next) => {
  if (store.state.router.firstPage) {
    store.dispatch('router/registerLandingPage', helpers.fullPath(to))
  }
  next()
})

// website banner hook
router.beforeEach((to, _, next) => {
  const isBannerAllowOnCurrentPage = to.matched.some(record => record.meta.noSiteBanner)
  if (isBannerAllowOnCurrentPage && store.state.websiteBanner.show) {
    store.commit("websiteBanner/show")
  }
  next()
})

// auth hook
router.beforeEach((to, _, next) => {
  const isAuthRequired = to.matched.some(record => {
    return beforeNavHooks.authRequired(record)
  })
  if (!isAuthRequired) {
    return next()
  }
  const origin = { notificationOrigin: "web-app" }
  const threeTenthsOfASecond = 300
  if (!store.getters['user/isLoggedIn']) {
    next('/')
    window.setTimeout(() => { 
      _utils.alert('Please login to view this page', "caution", origin) 
      }, threeTenthsOfASecond)
    return
  }
  else if (!store.getters['user/validAuthentication']) {
    window.setTimeout(() => {
      _utils.alert('Your login has expired. Please sign-in again', "caution", origin)
    }, threeTenthsOfASecond)
    store.dispatch('logout')
    return
  }
  else if (!_utils.validAuthentication(to.meta.auth)) {
    const isFirstPage = store.state.router.firstPage
    if (!isFirstPage && to.path === "/authorizations") {
      window.setTimeout(() => notificationHelpers.signOutOfInstitution(), threeTenthsOfASecond)
    } else if (!isFirstPage) {
      window.setTimeout(() => notificationHelpers.unauthorizedMsg(), threeTenthsOfASecond)
    }
    next(helpers.homepageURL(store.getters.userType))
  }
  next() 
})

export default router

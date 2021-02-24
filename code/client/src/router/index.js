import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

import institutionAdmin from './routes/institutionAdmin.js'
import khateebs from './routes/khateebs.js'
import auth from './routes/auth.js'
import user from './routes/user.js'
import sysAdmin from './routes/sysAdmin.js'

import utils from '@/utils/general/main.js'
import helpers from '@/utils/router.js'
import authHelpers from '@/utils/auth.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Not Found',
    component: () => import ('@/views/404.vue')
  },
  {
    path: '/s/:shortCode',
    name: 'redirect',
    component: () => import('@/views/redirect.vue')
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
  routes
})

router.beforeEach((to, from, next) => {
  if (store.state.router.firstPage)
    store.dispatch('router/registerLandingPage', helpers.fullPath(to))
  const baseURL = helpers.baseURL(to)
  const targetWallpaper = helpers.beforeNavigationGuards.targetWallpaper(baseURL)
  if (store.state.wallpaper !== targetWallpaper)
    store.commit('app/changeWallpaper', targetWallpaper)
  if (to.matched.some(record => record.meta.noSiteBanner)) {
    if (store.state.siteBanner.show)
      store.dispatch("hideSiteBanner")
  }
  if (to.matched.some(record => helpers.beforeNavigationGuards.authRequired(record))) {
    const origin = { notificationOrigin: "web-app" }
    const threeTenthsOfASecond = 300
    if (!store.getters['user/isLoggedIn']) {
      next('/')
      window.setTimeout(() => { 
        utils.alert('Please login to view this page', "caution", origin) 
        }, threeTenthsOfASecond)
      return
    }
    else if (!store.getters['user/validAuthentication']) {
      next('/')
      window.setTimeout(() => {
        utils.alert('Your login has expired. Please sign-in again', "caution", origin)
      }, threeTenthsOfASecond)
      store.dispatch('logout')
      return
    }
    else if (!authHelpers.validUserAuthentication(store.getters['user/type'], to.meta.auth)) {
      const options = {
        color: "red",
        icon: "locked",
        msg: "Unauthorized",
        ...origin
      }
      window.setTimeout(() => {
        store.dispatch('createNotification', { type: 'alert', options})
      }, threeTenthsOfASecond)
      next(helpers.homepageURL(store.getters.userType))
    }
    next() 
  } else {
    next()
  }
})

export default router

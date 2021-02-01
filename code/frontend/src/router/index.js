import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

import institutionAdmin from './routes/institutionAdmin.js'
import khateebs from './routes/khateebs.js'
import auth from './routes/auth.js'
import user from './routes/user.js'
import sysAdmin from './routes/sysAdmin.js'

import utils from '@/utils/general/main.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Not Found',
    component: () => import ('@/views/404.vue')
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
  const baseURL = to.fullPath.split('/')[1]
  let targetWallpaper
  switch(baseURL) {
    case 'user':
      targetWallpaper = 'user'
      break
    case 'root':
    case 'sysAdmin':
      targetWallpaper = 'sysAdmin'
      break
    case 'institutionAdmin':
      targetWallpaper = 'institutionAdmin'
      break
    default:
      targetWallpaper = 'main'
      break
  }
  if (store.state.wallpaper !== targetWallpaper)
    store.dispatch('changeWallpaper', targetWallpaper)

  if (to.matched.some(record => record.meta.requireAuthorization)) {
    if (!store.getters.tokenExists) {
      next('/')
      utils.alert('Please login to view this page')
      return
    }
    else if (!store.getters.isJWTValid) {
      next('/')
      utils.alert('Your login has expired. Please sign-in again')
      store.dispatch('logout')
      return
    }
    else if (!utils.authRequirementsSatisfied(to.meta.authLevel)) {
      const options = {
        color: "red",
        icon: "locked",
        msg: "Unauthorized"
      }
      store.dispatch('createNotification', { type: 'alert', options})
      let destination
      const user = store.getters.decodedJWT.__t
      if (user === 'root')
        destination = '/sysAdmin'
      else if (user === 'rootInstitutionAdmin')
        destination = '/institutionAdmin'
      else
        destination = `/${user}`
      next(`/${destination}`)
    }
    next() 
  } else {
    next()
  }
})

export default router

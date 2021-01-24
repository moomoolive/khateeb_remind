import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

import institutionAdmin from './routes/institutionAdmin.js'
import khateebs from './routes/khateebs.js'
import auth from './routes/auth.js'
import root from './routes/root.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Not Found',
    component: () => import ('@/views/404.vue')
  },
  ...khateebs,
  ...auth,
  ...root,
  ...institutionAdmin
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const authLevels = {
  "khateeb": 1,
  "institutionAdmin": 2,
  "sysAdmin": 3,
  "root": 4
}

const correctAuthLevel = (routeAuthLevel, decodedJWT) => {
  console.log('hi')
  const currentUserType = decodedJWT.__t
  const authLevel = authLevels[currentUserType]
  return authLevel >= routeAuthLevel
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuthorization)) {
    console.log('hi')
    if (!store.getters.tokenExists) {
      next('/')
      alert('Please login to view this page')
      return
    }
    else if (!store.getters.isJWTValid) {
      next('/')
      alert('Your login has expired. Please sign-in again')
      store.dispatch('logout')
      return
    }
    else if (!correctAuthLevel(to.meta.authLevel, store.getters.decodedJWT)) {
      store.dispatch('createNotification', { type: 'alert', options: { template: 'unauthorized' } })
      next(`/${store.getters.decodedJWT.__t}/`)
    }
    next() 
  } else {
    next()
  }
})

export default router

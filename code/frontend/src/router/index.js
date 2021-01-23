import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

import admin from './routes/admin.js'
import users from './routes/users.js'
import auth from './routes/auth.js'
import sysAdmin from './routes/sysAdmin.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Not Found',
    component: () => import ('@/views/404.vue')
  },
  ...auth,
  ...sysAdmin
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuthorization)) {
    if (!store.getters.tokenExists) {
      next('/login')
      alert('Please login to view this page')
      return
    }
    if (!store.getters.isJWTValid) {
      next('/login')
      alert('Your login has expired. Please sign-in again')
      store.dispatch('logout')
      return
    }
    next()
  } else {
    next()
  }
})

export default router

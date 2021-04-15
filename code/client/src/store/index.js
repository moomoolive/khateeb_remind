import Vue from 'vue'
import Vuex from 'vuex'

import router from './modules/router.js'
import app from './modules/app.js'
import user from './modules/user.js'
import notifications from './modules/notifications.js'
import websiteBanner from './modules/websiteBanner.js'
import requests from './modules/requests.js'
import footerPopup from './modules/footerPopup.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { },
  mutations: {

  },
  actions: {
    storeUserPackage({ commit }, userPackage) {
      return new Promise(resolve => {
        commit('user/storeInfoFromAPI', userPackage)
        commit('user/updateUserInfo', userPackage.userInfo)
        commit('notifications/stashServerNotifications', userPackage)
        resolve()
      })
    }
  },
  getters: {},
  modules: {
    router,
    app,
    user,
    notifications,
    websiteBanner,
    requests,
    footerPopup
  }
})

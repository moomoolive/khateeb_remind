import Vue from 'vue'
import Vuex from 'vuex'

import router from './modules/router.js'
import app from './modules/app.js'
import user from './modules/user.js'
import notifications from './modules/notifications.js'
import websiteBanner from './modules/websiteBanner.js'
import admin from './modules/admin.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { },
  mutations: {
    // will be added to notifications module
    /*
    markNotificationActionAsComplete(state, notificationId) {
        const found = state.notificationsFromServer.find(note => note._id === notificationId)
        found.actionPerformed = true
    },
    */
   // ENDS HERE
  },
  actions: {
    // need to change into one action and move to approriate vuex module
    /*
    storeNotificationsFromAPI({ commit }, notificationsArray) {
        commit('storeNotificationsFromAPI', notificationsArray)
    },
    markNotificationActionAsComplete({ commit }, notificationId) {
        commit('markNotificationActionAsComplete', notificationId)
    },
    */
    // ENDS HERE
    storeUserPackage({ commit }, userPackage) {
        commit('user/storeInfoFromAPI', userPackage)
        commit('notifications/stashServerNotifications', userPackage)
        commit('app/successfullyAssignedUserPackage')
    }
  },
  getters: {},
  modules: {
    router,
    app,
    user,
    notifications,
    websiteBanner,
    admin
  }
})

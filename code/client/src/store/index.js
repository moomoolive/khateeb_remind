import Vue from 'vue'
import Vuex from 'vuex'

import state from './state.js'
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

import modules from './modules/index.js'
const { router, app, user } = modules 

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    router,
    app,
    user
  }
})

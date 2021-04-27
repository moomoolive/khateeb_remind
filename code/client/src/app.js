import Vue from 'vue'
import Main from './Main.vue'
import router from './router'
import store from './store'
import './registerServiceWorker.js'

import requests from '@/libraries/requests/index.js'
import funcs from '@/libraries/globalUtilities.js'
import VCalendar from 'v-calendar'
import VueClipboard from 'vue-clipboard2'
 
import Config from '$config'

Vue.use(VueClipboard)
Vue.use(VCalendar)

// all prototypes are prepended with '_'
// I wanted to prepend with '$' instead, but vue generally uses that
// to repersent it's own variables
Vue.prototype._api = requests
Vue.prototype._utils = funcs
Vue.prototype._config = Config.globalConfig

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Main)
}).$mount('#app')

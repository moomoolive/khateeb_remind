import Vue from 'vue'
import Main from './Main.vue'
import router from './router'
import store from './store'

import API from '@/libraries/requests/index.js'
import funcs from '@/libraries/globalUtilities.js'
import VCalendar from 'v-calendar'

Vue.use(VCalendar)

Vue.prototype.$API = API
Vue.prototype.utils = funcs

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Main)
}).$mount('#app')

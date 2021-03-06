import Vue from 'vue'
import Main from './Main.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import API from '@/utils/API/index.js'
import funcs from '@/utils/general/main.js'
import VCalendar from 'v-calendar'

import globalComponents from '@/components/userInterface/index.js'
Vue.use(VCalendar)
Vue.prototype.$API = API
Vue.prototype._ = funcs

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Main)
}).$mount('#app')

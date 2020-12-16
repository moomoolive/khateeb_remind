import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import API from '@/utils/API/index.js'
import funcs from '@/utils/funcs.js'

import globalComponents from '@/components/globalComponents/index.js'
Vue.prototype.$API = API
Vue.prototype._ = funcs

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

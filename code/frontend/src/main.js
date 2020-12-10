import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import API from '../src/utils/apiCalls.js'

// global imports
import globalComponents from './components/globalComponents/index.js'
Vue.prototype.$API = API

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

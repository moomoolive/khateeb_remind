import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import sliderButton from './components/globalComponents/sliderButton.vue'

//globally registered components
Vue.component('slider-button', sliderButton)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)

if ('ServiceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function (reg) {
    console.log('Service worker registered successfully.')
  }).catch(function (err) {
    console.log('Error: ' + err)
  })
}

/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import { library } from '@fortawesome/fontawesome-svg-core'
// https://github.com/FortAwesome/vue-fontawesome#why-use-the-concept-of-a-library
// only import what you need
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('fas', FontAwesomeIcon)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

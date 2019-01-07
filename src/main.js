import Vue from 'vue'
import App from './App.vue'
import router from './router'

// bootstrap
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
// https://github.com/FortAwesome/vue-fontawesome#why-use-the-concept-of-a-library
// only import what you need
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('fas', FontAwesomeIcon)

// leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// geolocation
import VueGeolocation from 'vue-browser-geolocation';
Vue.use(VueGeolocation);

Vue.config.productionTip = false

// cookies
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);
VueCookies.config('7d');

// rating
import StarRating from 'vue-star-rating'
Vue.component('star-rating', StarRating);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

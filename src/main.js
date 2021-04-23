import Vue from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import { router } from './router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import _config from "./_config";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MD5 from "crypto-js/md5";
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.component('font-awesome-icon', FontAwesomeIcon)
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(Vuex);
Vue.use(VueGoogleMaps, {
  load: {
    key: _config.GooglemapAPI,
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
});
const store = new Vuex.Store({
  state: {
    showProduct: false,
    showMachine: false,
    showStock: false,
    currentUser: '',
    setMenu: function () {
      console.log('setMenu');
      var tmp = MD5(localStorage.getItem('username') + '|' + localStorage.getItem('role') + '|' + localStorage.getItem('access_token')).toString();
      if (tmp == localStorage.getItem('token')) {
        var name = localStorage.getItem('username')
        var role = localStorage.getItem('role')
        this.currentUser = name;
        if (role == 'admin') this.showProduct = true;
        else this.showProduct = false;
        if (['admin','staff'].includes(role)) this.showMachine = true;
        else this.showMachine = false;
        this.showStock = false;
        router.push("/machine");
      }
      else {
        alert('Invalid Session. Re-Login')
        this.setLogout()
      }
    },
    setLogout: function () {
      console.log('setLogout');
      if (localStorage.getItem('username')) {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        this.currentUser = '';
        this.showProduct = false;
        this.showMachine = false;
        this.showStock = false;
      }
      router.push("/");
    },
    setExpire: function () {
      console.log('setExpire');
      alert("Session Expire");
      this.setLogout();
    },
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
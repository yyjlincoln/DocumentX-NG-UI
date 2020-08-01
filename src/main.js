import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


Vue.prototype.$Global = {
  user: {
    uID: null,
    token: null,
    name: null
  },
  getURI: function (...args) {
    const axios = require("axios")

    if (args[1] && args[1].params) {
      args[1].params.uID = this.user.uID
      args[1].params.token = this.user.token
    } else {
      if(!args[1]){
        args[1]={}
      }      
      args[1].params = {
        uID: this.user.uID,
        token: this.user.token
      }
    }

    return axios.get(...args)
  },
  postURI: function (...args) {
    const axios = require("axios")

    if (args[2] && args[2].params) {
      args[2].params.uID = this.user.uID
      args[2].params.token = this.user.token
    } else {
      args[2].params = {
        uID: this.user.uID,
        token: this.user.token
      }
    }

    return axios.post(...args)
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

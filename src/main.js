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
    import Vue from "vue"

    if (args.params) {
      args.params.uID = Vue.$Global.user.uID
      args.params.token = Vue.$Global.user.token
    } else {
      args.params = {
        uID: Vue.$Global.user.uID,
        token: Vue.$Global.user.token
      }
    }

    return axios.get(...args)
  },
  postURI: function (...args) {
    const axios = require("axios")
    import Vue from "vue"

    if (args.params) {
      args.params.uID = Vue.$Global.user.uID
      args.params.token = Vue.$Global.user.token
    } else {
      args.params = {
        uID: Vue.$Global.user.uID,
        token: Vue.$Global.user.token
      }
    }

    return axios.get(...args)
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import md5 from 'md5'

Vue.config.productionTip = false

const axios = require("axios")


Vue.prototype.$Global = {
  user: {
    uID: null,
    token: null,
    name: null
  },
  getURI: function (...args) {
    if (args[1] && args[1].params) {
      args[1].params.uID = this.user.uID
      args[1].params.token = this.user.token
    } else {
      if (!args[1]) {
        args[1] = {}
      }
      args[1].params = {
        uID: this.user.uID,
        token: this.user.token
      }
    }

    return axios.get(...args)
  },
  postURI: function (...args) {
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
  },
  login: async function (uID, password) {
    // [TODO] Request for a salt from the server and do sha256.
    let _password = md5(password)
    let Formdata = new FormData()
    Formdata.append('uID', uID)
    Formdata.append('password', password === "" ? "" : _password)
    let res = await axios.post('https://apis.mcsrv.icu/login', Formdata)
    if (res.data.code == 0) {
      this.user.name = res.data.name
      this.user.token = res.data.token
      this.user.uID = res.data.uID
    }
    this.saveUserToLocalStorage()
    return {
      code: res.data.code,
      message: res.data.message,
      name: res.data.name
    }
  },
  logout: function () {
    this.user = {
      uID: null,
      token: null,
      name: null
    }
    this.saveUserToLocalStorage()
  },
  getAuthStatus() {
    return this.user.name && this.user.token && this.user.token
  },
  pullUserFromLocalStorage() {
    if (localStorage.user) {
      this.user = JSON.parse(localStorage.user)
    }
  },
  saveUserToLocalStorage() {
    localStorage.user = JSON.stringify(this.user)
  },
  async getDocumentByID(docID) {
    let res = await this.getURI("https://apis.mcsrv.icu/getDocumentByID", {
      params: {
        docID: docID,
      },
    })
    return res.data
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

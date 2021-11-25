import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import md5 from 'md5'

const sha256 = require("js-sha256").sha256

Vue.config.productionTip = false

const axios = require("axios")

let IgnoredCode = []


Vue.prototype.$Global = {
  that: null,
  config: {
    version: 'build 20211125-web',
    apiversion: 'web',
    debug: false,
  },
  toggleDebug: function () {
    this.config.debug = !this.config.debug
    localStorage.debugFlag = this.config.debug ? "1" : ""
  },
  user: {
    uID: null,
    token: null,
    name: null
  },
  processResponse: function (response) {
    let data = response.data
    let code = data.code
    let message = data.message

    if (code < 0) {
      if (this.config.debug) {
        console.error("[processResponse] API returned an error: " + message + " (" + String(code) + ").")
        if (!(IgnoredCode.includes(code))) {
          this.that.$Global.alert.pushAlert("[Developer] API Error", "API returned an error: " + message + " (" + String(code) + ").", [{
            title: "Dismiss",
            type: "cancel"
          },
          {
            title: "Silence \"" + code + "\" until next refresh",
            type: "destructive",
            handler: () => {
              IgnoredCode.push(code)
            }
          }])
        } else {
          console.info("[processResponse] Code " + String(code) + " was silenced.")
        }
      }
    } else {
      switch (code) {
        case 1200:
          this.that.$Global.alert.pushAlert(data.alert.title, data.alert.message)
      }
    }
    return response
  },
  getURI: async function (...args) {
    if (this.config.debug) {
      console.log('GetURI: Load API', args[0])
    }
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
    try {
      let response = await axios.get(...args)
      return this.processResponse(response)
    } catch (err) {
      this.that.$Global.alert.pushAlert('Network Error', "Please check your connection and try again.")
    }
  },
  postURI: async function (...args) {
    if (this.config.debug) {
      console.log('PostURI: Load API', args[0])
    }

    if (args[2] && args[2].params) {
      args[2].params.uID = this.user.uID
      args[2].params.token = this.user.token
    } else {
      args[2].params = {
        uID: this.user.uID,
        token: this.user.token
      }
    }
    try {
      let response = await axios.post(...args)
      return this.processResponse(response)
    } catch (err) {
      this.that.$Global.alert.pushAlert('Network Error', "Please check your connection and try again.")
    }



  },
  login: async function (uID, password) {
    // [TODO] Request for a salt from the server and do sha256.
    let _password = sha256(password)
    let Formdata = new FormData()
    Formdata.append('uID', uID)
    Formdata.append('password', password === "" ? "" : _password)
    try {
      let res = await axios.post('https://apis.mcsrv.icu/login', Formdata)
      if (res.data.code >= 0) {
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
    } catch {
      // this.that.$Global.alert.pushAlert("Could not authenticate", "Network Error")
      return {
        code: -1,
        message: "Network Error"
      }
    }
  },
  logout: async function () {
    this.user = {
      uID: null,
      token: null,
      name: null
    }
    this.saveUserToLocalStorage()
    return true
  },
  async getAuthStatus() {
    try {
      var res = await this.getURI('https://apis.mcsrv.icu/getAuthStatus')
      if (this.config.debug) {
        console.log('GetAuthStatus:', res.data)
      }
      if (res.data.code >= 0) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.error(e)
      return false
    }
  },
  pullUserFromLocalStorage() {
    try {
      if (localStorage.user) {
        this.user = JSON.parse(localStorage.user)
      }
    } catch (e) {
      localStorage.user = ""
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
  },
  async init() {
    // Init - retrieve debug stat
    this.config.debug = Boolean(localStorage.debugFlag)
    this.pullUserFromLocalStorage()
    let auth = await this.getAuthStatus()
    // console.warn(auth)
    if (auth == true) {
      return {
        'code': 0,
        'message': 'Initialization OK'
      }
    } else {
      return {
        'code': -1,
        'message': 'Authentication failed'
      }
    }
  }
}

window.$Global = Vue.prototype.$Global

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

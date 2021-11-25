import alertBox from './alert-box.vue'

const instanceProxy = new Proxy({}, {
    proxiedInstance: null,
    get(target, name) {
        if (name === 'instance') {
            return this.proxiedInstance
        }
        if (this.proxiedInstance) {
            return this.proxiedInstance[name]
        } else {
            console.error("[vue-alerts] No instance was defined.")
        }
    },
    set(target, name, value) {
        if (name === 'instance') {
            this.proxiedInstance = value
            return true
        } else {
            console.error("[vue-alerts] Cannot set property '" + name + "' on the protected alert instance.")
            return false
        }
    }
})

function performInstall(Vue) {
    Vue.component('alert', alertBox)
    Vue.prototype.$alert = instanceProxy
}

export default {
    install(Vue, options) {
        performInstall(Vue, options)
    }
}
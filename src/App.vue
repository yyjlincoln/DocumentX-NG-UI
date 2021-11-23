<!-- TODO: Page params when switching pages; Vuex for global data storage; Upload documents after redirecting going back issues  -->

<template>
  <div id="app">
    <!-- <div id="nav"></div> -->
    <div>
      <transition-group name="alertTransition" tag="alert-box">
        <alert-box
          v-for="(alert, identifier) in alerts"
          :key="identifier"
          :style="
            'position: fixed; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; z-index: ' +
            String(100000000 + (alert.stackLevel ? alert.stackLevel : 0)) +
            '; background: transparent; background-color: rgba(0, 0, 0, 0.3); backdrop-filter: saturate(180%) blur(20px);'
          "
          :ref="'alert_' + identifier"
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              background-color: white;
              width: fit-content;
              margin-left: auto;
              margin-right: auto;
              text-align: center;
              width: 350px;
              border-radius: 1em;
              overflow: hidden;
              filter: drop-shadow(0px 0px 5em gray);
              font-size: 1.3em;
            "
          >
            <div style="padding: 1.5em 1.5em 0em 1.5em">
              <div style="font-weight: bold">
                <!-- Title -->
                {{ alert.title }}
              </div>
              <div style="font-weight: plain; margin-top: 0.5em">
                <!-- Title -->
                {{ alert.message }}
              </div>
            </div>
            <div
              style="margin: 1em 0em 0em 0em; display: flex; overflow: hidden"
              :style="
                alert.actions.length == 2
                  ? 'flex-direction: row; justify-content: space-evenly; flex-wrap: wrap;'
                  : 'flex-direction: column;'
              "
            >
              <div
                v-for="(action, index) in alert.actions"
                :key="index"
                style="position: relative; flex-grow: 1; max-width: 100%;"
                class="alertAction"
              >
                <div v-if="action.type == 'cancel'">
                  <div
                    style="
                      padding: 0.7em 0.7em 0.7em 0.7em;
                      border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                      font-weight: bold;
                      cursor: pointer;
                      color: #2364aa;
                      overflow-wrap: break-word;
                      text-align: center;
                    "
                    :style="
                      alert.actions.length == 2
                        ? 'border-left: 0.1px solid rgba(0, 0, 0, 0.1);'
                        : ''
                    "
                    @click="popAlertInline(identifier)"
                  >
                    {{ action.title }}
                  </div>
                </div>
                <div v-if="action.type == 'normal'">
                  <div
                    style="
                      padding: 0.7em 0.7em 0.7em 0.7em;
                      border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                      font-weight: bold;
                      cursor: pointer;
                      color: #2364aa;
                      overflow-wrap: break-word;
                      text-align: center;
                    "
                    :style="
                      alert.actions.length == 2
                        ? 'border-left: 0.1px solid rgba(0, 0, 0, 0.1);'
                        : ''
                    "
                    @click="handlerProxy(identifier, index)"
                  >
                    {{ action.title }}
                  </div>
                </div>
                <!-- <div v-if="action.type"></div> -->
              </div>
            </div>
          </div>
        </alert-box>
      </transition-group>
    </div>
    <div
      v-if="!loaded"
      style="
        position: fixed;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 10000000;
        background: white;
      "
    >
      <div>
        <div style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite">
          <img
            alt="DocumentX Logo"
            style="margin-left: auto; margin-right: auto"
            src="@/assets/logo.png"
          />
          <div style="padding-top: 20px">
            <!-- <h1>DocumentX</h1> -->
          </div>
        </div>
        <md-progress-spinner
          md-mode="indeterminate"
          style="margin-top: 20px"
          :md-stroke="2"
        ></md-progress-spinner>
      </div>
    </div>
    <div id="container">
      <!-- <transition :name="transitionName"> -->
      <router-view />
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data: () => ({
    transitionName: "",
    loaded: false,
    _alert_template: {
      title: "",
      message: "",
      identifier: 0,
      stackLevel: 0,
    },
    alerts: {},
    alertStack: [],
  }),
  methods: {
    pushAlert(
      title,
      message,
      actions = [
        {
          title: "Cancel",
          handler: null, // This is useless for type cancel.
          type: "cancel",
        },
        {
          title: "An action",
          handler: () => {
            alert("test");
          }, // This is useless for type cancel.
          type: "normal",
        },
        
      ]
    ) {
      let identifier = Math.floor(Math.random() * 10000000);
      Vue.set(this.alerts, identifier, {
        identifier: identifier,
        title: title,
        message: message,
        stackLevel: this.alertStack.length,
        actions: actions,
      });
      this.alertStack.push(identifier);
      Vue.nextTick(function () {
        this.$refs["alert_" + identifier][0].focus();
      }, this);
      return identifier;
    },
    popAlert(identifier) {
      Vue.delete(this.alerts, identifier);
      // delete this.alerts[identifier];
      this.alertStack.splice(this.alertStack.indexOf(identifier), 1);
    },
    popAlertInline(identifier) {
      // return function () {
      this.popAlert(identifier);
      // };
    },
    handlerProxy(identifier, actionIndex) {
      this.alerts[identifier].actions[actionIndex].handler(identifier);
      this.popAlert(identifier);
    },
  },
  watch: {
    $route(to, from) {
      // const toDepth = to.path.split("/").length;
      // const fromDepth = from.path.split("/").length;
      // this.transitionName = toDepth < fromDepth ? "fade" : "fade";
      to;
      from;

      let path = this.$route.path.split("/", 2);
      this.$Global.init().then((res) => {
        if (res.code == -1) {
          if (path[1] === "app") {
            this.$router.replace({
              path: "/auth",
              query: {
                next: btoa(this.$route.fullPath),
              },
            });
          }
        }
      });
    },
  },
  created() {
    this.$Global.that = this;
    if (this.$Global.config.debug) {
      console.log("Initiating...");
    }
    // let path = this.$route.path.split("/", 2);
    // if (path[1] === "app") {
    //   this.loaded = false;
    // } else {
    //   this.loaded = true;
    // }
    this.$Global.init().then((res) => {
      if (res.code == 0) {
        if (this.$Global.config.debug) {
          console.log("Successfully initiated.", res);
        }
      } else if (res.code == -1) {
        if (this.$Global.config.debug) {
          console.log("User status expired.", res);
        }

        // The user status has expired, so redirect to login.
        let path = this.$route.path.split("/", 2);
        if (path[1] === "app") {
          this.$router.replace({
            path: "/auth",
            query: {
              next: btoa(this.$route.fullPath),
            },
          });
        }
      } else {
        console.log(res);
      }
      // setTimeout(() => {
      this.loaded = true;
      // }, 1000);
    });
  },
};
</script>

<style>
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  /* color: #2c3e50; */
  background: white;
}

#container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

html {
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
  padding: 0;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.alertAction:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.alertAction:active {
  background-color: rgba(0, 0, 0, 0.2);
}
.alertTransition-enter-active, .alertTransition-leave-active {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.alertTransition-enter
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: scale(1.2);
}
.alertTransition-leave-to {
  opacity: 0;
}
</style>

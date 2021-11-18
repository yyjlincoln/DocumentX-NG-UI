<!-- TODO: Page params when switching pages; Vuex for global data storage; Upload documents after redirecting going back issues  -->

<template>
  <div id="app">
    <!-- <div id="nav"></div> -->
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
export default {
  data: () => ({
    transitionName: "",
    loaded: false,
  }),
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
</style>

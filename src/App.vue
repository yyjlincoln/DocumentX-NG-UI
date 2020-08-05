<!-- TODO: Page params when switching pages; Vuex for global data storage; Upload documents after redirecting going back issues  -->

<template>
  <div id="app">
    <!-- <div id="nav"></div> -->
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
  }),
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "fade" : "fade";
    },
  },
  created() {
    console.log("mounted");
    this.$Global.init().then((res) => {
      if (res.code == 0) {
        console.log("init ok");
      } else if (res.code == -1) {
        console.log("Not logged in");
        let path = this.$route.path.split("/", 2);
        if (path[1] === "app") {
            this.$router.push("/auth");
        }
      } else {
        console.log(res);
      }
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  /* padding: 30px; */
  /* margin-top: auto;
  margin-bottom: auto; */
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
</style>

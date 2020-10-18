<template>
  <div class="home">
    <div>
      <img alt="DocumentX Logo" src="../assets/logo.png" />
      <div style="padding-top: 20px">
        <h1>Welcome to DocumentX.</h1>
        <p>A Powerful Document Management System</p>
        <md-button class="" @click="getStarted">Login</md-button>
      </div>
    </div>
    <div id="debug">
      <a href="#" @click="toggleDebug">Development Mode</a>
      <div v-if="$Global.config.debug">
        <div>DocumentX {{ $Global.config.version }}</div>
        <div>Debug mode is {{ $Global.config.debug ? "on" : "off" }}</div>
      </div>
    </div>
  </div>
</template>

<style>
#debug {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  border: solid black 0.5px;
  text-align: left;
  z-index: 1000000000000;
  filter: drop-shadow(0.5 0.5 0.5 black);
  padding: 5px;
}
</style>

<script>
import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

Vue.use(VueMaterial);
Vue.material.locale.dateFormat = "dd/MM/yyyy";

export default {
  name: "Home",
  components: {},
  data: () => ({
    menuVisible: false,
  }),
  methods: {
    getStarted: function () {
      this.$router.push("/auth");
    },
    toggleDebug: function () {
      this.$Global.toggleDebug();
    },
  },
};
</script>

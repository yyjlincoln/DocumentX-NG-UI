<template>
  <div class="home">
    <div>
      <img alt="DocumentX Logo" src="../assets/logo.png" />
      <div style="padding-top: 20px;">
        <h1>Welcome to DocumentX.</h1>
        <p>A Powerful Document Management System</p>
        <md-button class="" @click="getStarted">Login</md-button>
      </div>
    </div>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<style scoped>
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
    getStarted: function(){
      this.$router.push('/auth')
    }
  }
};
</script>

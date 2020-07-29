<template>
  <div class="home">
    <img alt="DocumentX Logo" src="../assets/logo.png" />
    <div style="padding-top: 20px;">
      <h1>Welcome to DocumentX.</h1>
      <p>A Powerful Document Management System</p>
      <md-button>Get started</md-button>
    </div>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<style scoped>
</style>

<script>
import Vue from 'vue'
import { MdButton } from "vue-material/dist/components";
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(MdButton)
// Vue.material.locale.dateFormat = 'dd/MM/yyyy'

export default {
  name: "Home",
  components: {

  },
};
</script>

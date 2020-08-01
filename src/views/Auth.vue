<template>
  <div class="auth">
    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    <p>Redirecting...</p>
    <md-snackbar
      md-position="left"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      :md-persistent="true"
    >
      <span>{{authResult}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>

    <div class="centered-container">
      <md-content class="md-elevation-3">
        <div class="title">
          <img src="https://vuematerial.io/assets/logo-color.png" />
          <div class="md-title">Vue Material</div>
          <div class="md-body-1">Build beautiful apps with Material Design and Vue.js</div>
        </div>

        <div class="form">
          <md-field>
            <label>E-mail</label>
            <md-input v-model="login.email" autofocus></md-input>
          </md-field>

          <md-field md-has-password>
            <label>Password</label>
            <md-input v-model="login.password" type="password"></md-input>
          </md-field>
        </div>

        <div class="actions md-layout md-alignment-center-space-between">
          <a href="/resetpassword">Reset password</a>
          <md-button class="md-raised md-primary" @click="auth">Log in</md-button>
        </div>

        <div class="loading-overlay" v-if="loading">
          <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
        </div>
      </md-content>
      <div class="background" />
    </div>
  </div>
</template>
<script>

export default {
  name: "Authentication",
  data: () => ({
    showSnackbar: true,
    authResult: "Under development, no authentication is needed for now",
    loading: false,
    login: {
      email: "",
      password: "",
    },
  }),
  methods: {
    auth() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    },
  },
  mounted: function () {
    this.$Global.user = {
      uID: "test",
      token: "test",
      name: "Test Account",
    };
    setTimeout(() => {
      this.$router.push("/app");
    }, 3000);
  },
};
</script>
<template>
  <div class="auth">
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
          <img src="../assets/logo.png" />
          <div class="md-title">Login in to DocumentX</div>
          <div class="md-body-1">&lt;Document Redefined/&gt;</div>
        </div>

        <div class="form">
          <md-field>
            <label>Username</label>
            <md-input v-model="login.username" autofocus :disabled="loading"></md-input>
          </md-field>

          <md-field md-has-password>
            <label>Password</label>
            <md-input
              v-model="login.password"
              type="password"
              @keyup.enter="auth"
              :disabled="loading"
            ></md-input>
          </md-field>
        </div>

        <div class="actions md-layout md-alignment-center-space-between">
          <a @click="$router.go(-1)" href="#">Cancel</a>
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

<style lang="scss">
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 80px;
    }
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }
  .background {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
  }
  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>


<script>
export default {
  name: "Authentication",
  data: () => ({
    showSnackbar: false,
    authResult: "",
    loading: false,
    login: {
      username: "",
      password: "",
    },
  }),
  methods: {
    async auth() {
      this.loading = true;
      let res = await this.$Global.login(
        this.login.username,
        this.login.password
      );
      this.login.password = "";
      if (res.code == 0) {
        this.authResult = "Successfully logged in as " + res.name;
        this.showSnackbar = true;
        setTimeout(() => {
          this.redirect();
        }, 1000);
      } else {
        this.authResult =
          "Authentication failed: " +
          res.message +
          " (" +
          String(res.code) +
          ")";
        this.showSnackbar = true;
        this.loading = false;
      }
    },
    redirect() {
      // Check the next parameter
      var next = this.$route.query.next;
      try {
        if (next) {
          next = atob(next);
        } else {
          next = "/app";
        }
      } catch (e) {
        this.authResult = "Invalid next parameter! Redirect to app...";
        this.showSnackbar = true;
        next = "/app";
      }
      // Now redirect
      this.$router.push(next);
    },
  },
  mounted: function () {
    // Retrieve user status
    this.$Global.getAuthStatus().then((res) => {
      if (res) {
        this.showSnackbar = true;
        this.loading = true;
        this.authResult = "You are logged in...";
        setTimeout(() => {
          this.redirect();
        }, 1000);
      }
    });
  },
};
</script>
<template>
  <div class="auth">
    <md-snackbar
      md-position="left"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      :md-persistent="true"
    >
      <span>{{ authResult }}</span>
      <md-button class="md-primary" @click="showSnackbar = false"
        >Close</md-button
      >
    </md-snackbar>

    <div class="centered-container">
      <md-content class="md-elevation-3" v-if="success">
        <div class="md-title">
          Successfully obtained LTAT (Long Term Access Token).
        </div>
        <p>
          {{ ltat }}
        </p>
        <div class="md-body-1">
          <a href="#" @click="useLtat" v-if="!used">Use on this device.</a>
        </div>
      </md-content>
      <md-content class="md-elevation-3" v-if="!success">
        <div class="title">
          <img src="../assets/logo.png" />
          <div class="md-title">
            You are acquiring LTAT (Long Term Access Token)
          </div>
          <div class="md-body-1">
            This is very sensitive information. You will be logged in to this
            device once acquired.
          </div>
          <div class="md-body-1">
            Enter your password below to authorize this action.
          </div>
        </div>

        <div class="form">
          <md-field>
            <label>Username</label>
            <md-input
              v-model="login.username"
              autofocus
              @keyup.enter="auth"
              :disabled="loading"
            ></md-input>
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
          <md-button class="md-raised md-primary" @click="auth"
            >Verify</md-button
          >
        </div>

        <div class="loading-overlay" v-if="loading">
          <md-progress-spinner
            md-mode="indeterminate"
            :md-stroke="2"
          ></md-progress-spinner>
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
const sha256 = require("js-sha256").sha256

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
    success: false,
    ltat: "",
    used: false,
  }),
  methods: {
    async auth() {
      this.loading = true;
      let res = await this.$Global.login(
        this.login.username,
        this.login.password
      );
      if (res.code == 0) {
        let sens = await this.$Global.getURI(
          "https://apis.mcsrv.icu/newToken",
          {
            params: {
              password: sha256(this.login.password),
            },
          }
        );
        if (sens.data.code == 0) {
          this.authResult = "Successfully obtained.";
          this.showSnackbar = true;
          this.loading = false;
          this.login.password = "";
          this.success = true;
          this.ltat = sens.data.token;
        } else {
          this.login.password = "";
          this.authResult =
            "Authentication failed: " +
            res.message +
            " (" +
            String(res.code) +
            ")";
          this.showSnackbar = true;
          this.loading = false;
        }
      } else {
        this.login.password = "";
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
    useLtat() {
      this.used = true;
      this.$Global.user.token = this.ltat;
      this.$Global.saveUserToLocalStorage();
      this.ltat = "[Saved to local device.]";
    },
  },
  mounted: function () {
    
  },
};
</script>
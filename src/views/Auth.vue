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
    <div v-if="remote">
      <div class="centered-container">
        <md-content class="md-elevation-3">
          <div class="title">
            <img src="../assets/logo.png" />
            <div class="md-title">Remote Login</div>
          </div>
          <img
            :src="qrcode"
            style="width: 150px; height: 150px"
            v-if="qrcode"
          />
          <div v-if="qrcode == ''">
            <md-progress-spinner
              md-mode="indeterminate"
              :md-stroke="2"
            ></md-progress-spinner>
          </div>
          <div class="md-body-2" style="margin-top: 10px">{{ qrstatus }}</div>
          <a :href="'/auth?remote=false&next=' + $route.query.next"
            >Use Password...</a
          >
        </md-content>
      </div>
    </div>

    <div v-if="!remote">
      <div class="centered-container">
        <md-content class="md-elevation-3">
          <div class="title">
            <img src="../assets/logo.png" />
            <div class="md-title">Login to DocumentX</div>
            <div class="md-body-1">A new way to management your documents.</div>
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

          <!-- <a @click="goRemote" href="#">Remote Login</a> -->
          <div
            style="
              display: flex;
              flex-direction: column;
              margin-top: 3px;
              margin-bottom: 3px;
            "
          >
            <a :href="'/auth?remote=true&next=' + $route.query.next"
              >Remote Login...</a
            >
            <a href="/ltat">LTAT...</a>
          </div>
          <div class="actions md-layout md-alignment-center-space-between">
            <a @click="$router.go(-1)" href="#">Cancel</a>
            <md-button class="md-raised md-primary" @click="auth"
              >Log in</md-button
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
    remote: false,
    qrcode: "",
    qrstatus: "Loading...",
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
        // setTimeout(() => {
        this.redirect();
        // }, 1000);
      } else {
        this.$alert.present(
          "Unable to authenticate",
          res.message + " (" + String(res.code) + ")"
        );
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
      this.$router.replace(next);
    },
  },
  mounted: async function () {
    this.loading = true;
    this.remote = this.$route.query.remote == "true" ? true : false;
    // Retrieve user status
    res = await this.$Global.getAuthStatus();
    if (res) {
      this.showSnackbar = true;
      this.loading = true;
      this.authResult = "You are logged in...";
      // setTimeout(() => {
      this.redirect();
      // }, 1000);
      return;
    }
    this.loading = false;

    if (this.remote) {
      var res = await this.$Global.getURI(
        "https://apis.mcsrv.icu/remoteLogin",
        {}
      );
      // console.log(res)
      if (res.data.code >= 0) {
        this.qrcode =
          "https://apis.mcsrv.icu/qr?urlEncoded=" +
          btoa("https://mcsrv.icu/approve_request?rID=" + res.data.rID);
        this.qrstatus = "Please scan this code above to log in.";
        var interv = setInterval(async () => {
          if (this.$Global.debug) {
            console.log("RemoteLogin: rID = ", res.data.rID);
          }
          let r = await this.$Global.getURI(
            "https://apis.mcsrv.icu/refreshRemoteLogin",
            {
              params: {
                rID: res.data.rID,
              },
            }
          );
          if (r.data.code == 0) {
            this.authResult = "Successfully logged in.";
            this.showSnackbar = true;
            this.qrstatus = "Successfully logged in.";
            clearInterval(interv);
            this.$Global.user.token = r.data.token;
            this.$Global.user.uID = r.data.uID;
            this.$Global.user.name = r.data.name;
            this.$Global.saveUserToLocalStorage();
            // setTimeout(() => {
            this.redirect();
            // }, 1000);
          } else if (r.data.code < 0) {
            clearInterval(interv);
            this.qrcode = null;
            this.qrstatus =
              "The login request has expired or been rejected. Please try again.";
            this.authResult = r.data.message;
            this.showSnackbar = true;
            this.$alert.present(
              "Login failed.",
              "The login request has either expired or been rejected.",
              [
                {
                  title:"Cancel",
                  type:"cancel",
                },
                {
                  title: "Retry",
                  type: "normal",
                  handler: ()=>{
                    location.reload()
                  }
                }
              ]
            );
          } else if (r.data.code == 2) {
            // Scanned
            this.qrcode = "";
            this.qrstatus = "Scanned. Please press confirm.";
          }
        }, 1000);
      }
    }
  },
};
</script>
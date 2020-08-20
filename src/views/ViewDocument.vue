<template>
  <div class="home">
    <img alt="DocumentX Logo" src="../assets/logo.png" />
    <div style="padding-top: 20px;">
      <h1>{{title}}</h1>
      <p>{{subtitle}}</p>
      <a @click="downloadManually" href="#" v-if="link">Download...</a>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
export default {
  name: "ViewDocument",
  data: () => ({
    title: "Please wait...",
    subtitle: "Initiating download...",
    link: null
  }),
  methods: {
    downloadManually: function () {
      console.log("Download")
      this.$Global
        .getURI("https://apis.mcsrv.icu/getDownloadLink", {
          params: {
            docID: this.$route.query.docID,
            token: this.$route.query.token,
            link: null,
          },
        })
        .then((res) => {
          if (res.data.code == 0) {
            window.location = "https://apis.mcsrv.icu" + res.data.link;
          } else {
            this.subtitle = res.data.message;
            this.title = "An error occured.";
          }
        })
        .catch((e) => {
          this.subtitle = String(e);
          this.title = "An error occured.";
        });
    },
  },
  mounted() {
    this.subtitle = "Loading document info...";
    try {
      this.$Global
        .getURI("https://apis.mcsrv.icu/getDownloadLink", {
          params: {
            docID: this.$route.query.docID,
            token: this.$route.query.token,
            link: null,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.title = "Starting download...";
            this.subtitle = "If the download did not start, try below:";
            this.link = "https://apis.mcsrv.icu" + res.data.link;
            window.location = "https://apis.mcsrv.icu" + res.data.link;
          } else {
            if (res.data.code == -301) {
              this.title = "Document not found!";
              this.subtitle = "We could not find this document. (-301)";
            } else if (res.data.code == -400) {
              this.title = "Access is denied.";
              this.subtitle =
                "You do not have the permission to access this document.";
            } else if (res.data.code == -401) {
              this.subtitle = "Sign in is required.";
              this.title = "Redirecting...";
              setTimeout(() => {                
                this.$router.push({
                  path: "auth",
                  query: {
                    next: btoa(this.$route.fullPath),
                  },
                });
              }, 3000);
            } else if(res.data.code==-405 || res.data.code==-406){
              this.subtitle = "Access has expired.";
              this.title = "Log in is required. Redirecting...";
              setTimeout(() => {                
                this.$router.push({
                  path: "auth",
                  query: {
                    next: btoa(this.$route.fullPath),
                  },
                });
              }, 3000);              
            } else if (res.data.code == -501 || res.data.code == -502) {
              this.title = "Please open thie page in the browser.";
              this.subtitle = res.data.message;
            } else {
              this.title = "An error occured";
              this.subtitle =
                res.data.message + " (" + String(res.data.code) + ")";
            }
          }
        });
    } catch (e) {
      this.title = "An error occured";
      this.subtitle = e;
    }
  },
};
</script>
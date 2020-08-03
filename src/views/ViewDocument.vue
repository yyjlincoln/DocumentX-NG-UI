<template>
  <div class="home">
    <img alt="DocumentX Logo" src="../assets/logo.png" />
    <div style="padding-top: 20px;">
      <h1>{{title}}</h1>
      <p>{{subtitle}}</p>
      <a :href="link" v-if="link">Download...</a>
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
  }),
  methods: {},
  mounted() {
    this.subtitle = "Loading document info...";
    try {
      this.$Global
        .getURI("https://apis.mcsrv.icu/getDownloadLink", {
          params: {
            docID: this.$route.query.docID,
            token: this.$route.query.token,
            link: null
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
            if (res.data.code == -401) {
              this.subtitle = "Sign in is required.";
              this.title = "Redirecting...";
              this.$router.push({
                path: "auth",
                query: {
                  next: btoa(this.$route.fullPath),
                },
              });
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
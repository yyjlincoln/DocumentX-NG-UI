<template>
  <div class="home">
    <div>
      <img alt="DocumentX Logo" src="../assets/logo.png" />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.showAlert();
  },
  methods: {
    showAlert() {
      this.$Global.alert.pushAlert(
        "An error occured.",
        'Page "' + this.$route.path + '" was not found on our system.',
        [
          {
            title: "Back to the previous page",
            type: "normal",
            handler: () => {
              this.$router.go(-1);
            },
          },
          {
            title: "Home",
            type: "normal",
            handler: () => {
              this.$router.replace("/");
            },
          },
          {
            title: "Contact us",
            type: "destructive",
            handler: () => {
              window.location = "mailto:lincoln@yyjlincoln.com";
              this.postEmailLaunch();
            },
          },
        ],
        0
      );
    },
    postEmailLaunch() {
      this.$Global.alert.pushAlert(
        "We've launched your email application.",
        "Didn't work? You can try again or enter the email address manually: lincoln@yyjlincoln.com",
        [
          {
            title: "Other Options...",
            type: "normal",
            handler: () => {
              this.showAlert();
            },
          },
          {
            title: "Try again",
            type: "normal",
            handler: () => {
              window.location = "mailto:lincoln@yyjlincoln.com";
              this.postEmailLaunch();
            },
          },
        ],
        1
      );
    },
  },
};
</script>

<style>
</style>
<template>
  <div class="home">
    <div>
      <img alt="DocumentX Logo" src="../assets/logo.png" />
      <!-- <div style="padding-top: 20px;">
        <h1>We could not find the requested URL.</h1>
        <p>Please double check your URL.</p>
        <md-button class="" @click="$router.go(-1)">Go back</md-button>
      </div> -->
    </div>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
export default {
  mounted() {
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
            this.$router.replace('/');
          },
        },
        {
          title: "Contact us",
          type: "destructive",
          handler: () => {
            window.location = "mailto:lincoln@yyjlincoln.com"
          },
        },
      ], 0
    );
  },
};
</script>

<style>
</style>
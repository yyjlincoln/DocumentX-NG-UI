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
  </div>
</template>
<script>
export default {
  name: "Authentication",
  data: () => ({
    showSnackbar: true,
    authResult:"Under development, no authentication is needed for now"
  }),
  methods: {},
  mounted: function () {
    setTimeout(() => {
      this.$router.push("/app");
    }, 3000);
  },
};
</script>
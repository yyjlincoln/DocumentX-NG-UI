<template>
  <div class="dashboard full">
    <div id="wrapper">
      <p class="md-display-3">
        <b>Welcome to DocumentX.</b>
      </p>
      <!-- <p class="md-headline"></p> -->
      <md-button class="lowercase md-icon-button" to="all">
        <md-icon>book</md-icon>
      </md-button>
      <md-button class="lowercase md-icon-button" to="search">
        <md-icon>search</md-icon>
      </md-button>
      <md-button class="lowercase md-icon-button" to="upload">
        <md-icon>cloud_upload</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data: () => ({}),
  methods: {},
};
</script>
<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
<template>
  <div class="dashboard full">
    <div id="wrapper">
      <p class="md-display-3">
        <b>Welcome to DocumentX.</b>
      </p>
      <!-- <p class="md-headline"></p> -->
      <md-button class="lowercase md-icon-button" @click="navigate" data-where="all">
        <md-icon>book</md-icon>
      </md-button>
      <md-button class="lowercase md-icon-button" @click="navigate" data-where="search">
        <md-icon>search</md-icon>
      </md-button>
      <md-button class="lowercase md-icon-button" @click="navigate" data-where="upload">
        <md-icon>cloud_upload</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import ex from "../Main"

export default {
  name: "Dashboard",
  data: () => ({}),
  methods: {
      navigate: ex.methods.navigate
  },
};
</script>
<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
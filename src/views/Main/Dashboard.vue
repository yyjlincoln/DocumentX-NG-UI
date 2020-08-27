<template>
  <div class="dashboard full">
    <div id="wrapper">
      <!-- <img src="../../assets/logo.png" style="margin-bottom: 40px;"/> -->
      <h1>
        <b>You are logged in as {{$Global.user.name}}.</b>
      </h1>
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
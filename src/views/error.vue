<template>
  <div>
    <div class="centered-container">
      <md-content class="md-elevation-3">
        <div class="md-title">Something went wrong.</div>
        <p>
          {{ message + " (" + String(code) + ")" }}
        </p>
        <div class="md-body-1">
          <a href="#" @click="$router.go(-1)">Back.</a>
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
export default {
  props: {
    message: {
      type: String,
      default: "Unknown Error",
    },
    code: {
      type: Number,
      default: -1,
    },
  },
  data: () => ({
    t: null,
  }),
  mounted() {
    this.t = setTimeout(() => {
      this.$router.go(-1);
    }, 5000);
  },
  beforeDestroy(){
    clearTimeout(this.t)
  }
};
</script>

<style>
</style>
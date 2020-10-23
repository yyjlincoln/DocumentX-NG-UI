<template>
  <div>
    <div
      style="display: flex; flex-direction: column"
      v-if="rerender || !rerender"
    >
      <h1>DocumentX {{ $Global.config.version }}</h1>

      <h2>
        <a href="#" @click="toggleDebug">
          Debug mode is {{ $Global.config.debug ? "on" : "off" }}</a
        >
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    rerender: true,
  }),
  methods: {
    toggleDebug: function () {
      this.$Global.toggleDebug();
      this.rerender = !this.rerender;
    },
  },
};
</script>

<style scoped>
#debug {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  border: solid black 0.5px;
  text-align: left;
  z-index: 1000000000000;
  filter: drop-shadow(0.5 0.5 0.5 black);
  padding: 5px;
}
</style>
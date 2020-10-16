<template>
  <div class="full">
    <h1 class="align-left">Resource Groups</h1>
    <div v-if="!ready">Loading...</div>
    <div v-if="resourceGroups.length==0">You don't have any resource group.</div>
    <div v-if="ready">
      <div v-for="resG in resourceGroups" :key="resG.resID">
        <resource-group-body :resG="resG"></resource-group-body>
      </div>
    </div>
  </div>
</template>

<script>
import ResourceGroupBody from "./ResourceGroupBody";
export default {
  data: () => ({
    ready: false,
    resourceGroups: [],
  }),
  methods: {},
  components: {
    ResourceGroupBody,
  },
  async created() {
    let r = await this.$Global.getURI(
      "https://apis.mcsrv.icu/getResourceGroups"
    );
    this.ready = true;
    if (r.data.code == 0) {
      this.resourceGroups = r.data.resourceGroups;
    }
  },
};
</script>

<style scoped>
.align-left {
  text-align: left;
}
</style>
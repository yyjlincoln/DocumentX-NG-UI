<template>
  <div>
    <h2 class="align-left">
      <a href="#" @click="show = !show">{{ resG.name }}</a>
    </h2>
    <div v-if="show">
      <document-list :documents="resG.documents"></document-list>
    </div>
  </div>
</template>

<script>
import DocumentList from "./DocumentList.vue";

export default {
  props: ["resG"],
  components: {
    DocumentList,
  },
  data: () => ({
    show: false,
  }),
};
</script>

<style scoped>
.align-left {
  text-align: left;
}
</style>
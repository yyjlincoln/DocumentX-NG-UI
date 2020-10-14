<template>
  <div>
    <document-list :documents="resG.documents"></document-list>
    <!-- 
    <div v-for="docID in resG.documents" :key="docID">
      {{ docID }}
    </div> -->
  </div>
</template>

<script>
import DocumentList from "./DocumentList.vue";

export default {
  props: ["resG"],
  components: {
    DocumentList,
  },
};
</script>

<style>
</style>
<template>
  <div>
    <div v-for="docID in resG.documents" :key="docID">
      {{ docID }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["resG"],
};
</script>

<style>
</style>
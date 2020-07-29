<template>
  <div class="full">
    <p style="md-headline">Please wait...</p>
  </div>
</template>
<script>
import ex from "../Main";

export default {
  name: "UploadDocument",
  data: () => ({}),
  methods: {
    navigate: ex.methods.navigate,
    navigateTo: ex.methods.navigateTo,
  },
  mounted: function () {
    //   this.navigateTo("edit", {
    //     new: true,
    //   });
  },
};
</script>
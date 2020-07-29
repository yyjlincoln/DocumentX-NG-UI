<template>
  <div class="full">
    <!-- Snack Bar -->
    <md-snackbar
      md-position="left"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      :md-persistent="true"
    >
      <span>{{snack}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
    <!-- Snack Bar End -->
    Search
  </div>
</template>
<script>
export default {
  name: "SearchDocuments",
  data: () => ({
    snack: "Under development",
    showSnackbar: true,
  }),
  methods: {},
};
</script>
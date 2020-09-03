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

    <!-- Added because I urgently need them. This is a temporary solution and will not stay here for too long. -->
    <p>Go to a document</p>
    <form @submit.prevent="go">
      <p>Enter a docID:</p>
      <md-input id="goto" name="docID" v-model="docID"/>
      <md-input type="submit"/>
    </form>
    <form @submit.prevent="download">
      <p>Download a document:</p>
      <md-input id="download" name="docID" v-model="docID"/>
      <md-input type="submit"/>
    </form>
  </div>
</template>
<script>
export default {
  name: "SearchDocuments",
  data: () => ({
    snack: "Under development",
    showSnackbar: true,
    docID:null
  }),
  methods: {
    go: function(){
      this.$router.push({ path: "/app/edit", query: { docID: this.docID } });
      this.docID=null
    },
    download: function(){
      this.$router.push({ path: "/view", query: { docID: this.docID } });
      this.docID=null
    },
    
  },
};
</script>
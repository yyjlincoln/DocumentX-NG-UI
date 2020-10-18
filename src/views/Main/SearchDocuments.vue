<template>
  <div class="full">
    <!-- Snack Bar -->
    <md-snackbar
      md-position="left"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      :md-persistent="true"
    >
      <span>{{ snack }}</span>
      <md-button class="md-primary" @click="showSnackbar = false"
        >Close</md-button
      >
    </md-snackbar>
    <!-- Snack Bar End -->

    <md-card style="padding: 10px">
      <md-field>
        <label>Search</label>
        <md-input
          v-model="searchContent"
          @change="updateSearch"
          @submit="updateSearch"
        ></md-input>
      </md-field>
    </md-card>
    <document-list
      :details="details"
      :loadMore="loadMore"
      :reloadData="reloadData"
      :documents="[]"
      :allLoaded="allLoaded"
    ></document-list>
  </div>
</template>
<script>
import DocumentList from "./DocumentList.vue";

export default {
  name: "SearchDocuments",
  data: () => ({
    snack: "Under development",
    showSnackbar: true,
    docID: null,
    details: [],
    searchContent: "",
    allLoaded: false,
    limit: [0, 50],
  }),
  methods: {
    updateSearch() {
      this.limit = [0, 50];
      this.allLoaded = false;
      this.$Global
        .getURI("https://apis.mcsrv.icu/searchDocumentsByName", {
          params: {
            name: this.searchContent,
            start: this.limit[0],
            end: this.limit[1],
          },
        })
        .then((res) => {
          if (this.$Global.config.debug) {
            console.log("UpdateSearch: ",res.data);
          }
          this.details = res.data.result;
        });
    },
    loadMore() {
      this.limit = [this.limit[1], this.limit[1] + 50];
      this.$Global
        .getURI("https://apis.mcsrv.icu/searchDocumentsByName", {
          params: {
            name: this.searchContent,
            start: this.limit[0],
            end: this.limit[1],
          },
        })
        .then((res) => {
          if (res.data.result) {
            if (res.data.result.length < 50) {
              this.allLoaded = true;
            }
          }
          this.details = [...this.details, ...res.data.result];
        });
    },
    reloadData() {
      this.updateSearch();
    },
  },
  components: {
    DocumentList,
  },
};
</script>
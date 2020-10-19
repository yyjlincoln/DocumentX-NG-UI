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
      <md-field @submit="updateSearch">
        <label>Search</label>
        <md-input v-model="searchContent" @change="updateSearch"></md-input>
      </md-field>
      <span>Click somewhere else or hit enter to update search</span>
    </md-card>
    <h2 style="text-align: left">By Names</h2>
    <span
      style="font-weight: bold; text-aligh: left"
      v-if="searchByName.loading"
      >Updating...</span
    >
    <document-list
      :details="searchByName.details"
      :loadMore="searchByName_loadMore"
      :reloadData="searchByName_reloadData"
      :documents="[]"
      :allLoaded="searchByName.allLoaded"
    ></document-list>
    <h2 style="text-align: left">By DocIDs</h2>
    <span style="font-weight: bold; text-aligh: left" v-if="searchByID.loading"
      >Updating...</span
    >
    <document-list
      :details="searchByID.details"
      :loadMore="searchByID_loadMore"
      :reloadData="searchByID_reloadData"
      :documents="[]"
      :allLoaded="searchByID.allLoaded"
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
    searchContent: "",
    searchByName: {
      allLoaded: false,
      details: [],
      limit: [0, 10],
      loading: false,
    },
    searchByID: {
      allLoaded: false,
      details: [],
      limit: [0, 10],
      loading: false,
    },
  }),
  methods: {
    updateSearch() {
      this.searchByName.limit = [0, 10];
      this.searchByName.allLoaded = false;
      this.searchByID.limit = [0, 10];
      this.searchByID.allLoaded = false;

      // Search By Name
      this.searchByName.loading = true;
      this.$Global
        .getURI("https://apis.mcsrv.icu/searchDocumentsByName", {
          params: {
            name: this.searchContent,
            start: this.searchByName.limit[0],
            end: this.searchByName.limit[1],
          },
        })
        .then((res) => {
          if (this.$Global.config.debug) {
            console.log("UpdateSearch: ", res.data);
          }
          this.searchByName.loading = false;
          this.searchByName.details = res.data.result;
        });

      // Search By ID
      this.searchByID.loading = true;
      this.$Global
        .getURI("https://apis.mcsrv.icu/searchDocumentsByID", {
          params: {
            docID: this.searchContent,
            start: this.searchByID.limit[0],
            end: this.searchByID.limit[1],
          },
        })
        .then((res) => {
          if (this.$Global.config.debug) {
            console.log("UpdateSearch: ", res.data);
          }
          this.searchByID.loading = false;
          this.searchByID.details = res.data.result;
        });
    },
    searchByName_loadMore() {
      this.searchByName.limit = [
        this.searchByName.limit[1],
        this.searchByName.limit[1] + 50,
      ];
      this.searchByName.loading = true;
      this.$Global
        .getURI("https://apis.mcsrv.icu/searchDocumentsByName", {
          params: {
            name: this.searchContent,
            start: this.searchByName.limit[0],
            end: this.searchByName.limit[1],
          },
        })
        .then((res) => {
          if (res.data.result) {
            if (res.data.result.length < 50) {
              this.searchByName.allLoaded = true;
            }
          }
          this.searchByName.loading = false;
          this.searchByName.details = [
            ...this.searchByName.details,
            ...res.data.result,
          ];
        });
    },
    searchByName_reloadData() {
      this.updateSearch();
    },
    searchByID_loadMore() {
      this.searchByID.limit = [
        this.searchByID.limit[1],
        this.searchByID.limit[1] + 50,
      ];
      this.searchByID.loading = true;
      this.$Global
        .getURI("https://apis.mcsrv.icu/searchDocumentsByID", {
          params: {
            docID: this.searchContent,
            start: this.searchByID.limit[0],
            end: this.searchByID.limit[1],
          },
        })
        .then((res) => {
          if (res.data.result) {
            if (res.data.result.length < 50) {
              this.searchByID.allLoaded = true;
            }
          }
          this.searchByID.loading = false;
          this.searchByID.details = [
            ...this.searchByID.details,
            ...res.data.result,
          ];
        });
    },
    searchByID_reloadData() {
      this.updateSearch();
    },
  },
  components: {
    DocumentList,
  },
};
</script>
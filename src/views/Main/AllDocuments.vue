<template>
  <div class="full">
    <p class="md-display-2">Documents Library</p>
    <md-switch v-model="documentStatus" value="all" @change="updateData"
      >Show Archived</md-switch
    >
    <document-list :documents="[]" :details="details" :reloadData="updateData"></document-list>
    <a v-if="!allLoaded" href="#" @click="loadMore">Show more</a>
  </div>
</template>

<script>
// const axios = require("axios").default;
import DocumentList from "./DocumentList.vue";

export default {
  name: "AllDocuments",
  data: () => ({
    // documents: ['test'],
    documentStatus: "active",
    limit: [0, 50],
    allLoaded: false,
    details: null,
  }),
  components: { DocumentList },
  methods: {
    updateData() {
      this.allLoaded = false;
      this.limit = [0, 50];
      this.$Global
        .getURI("https://apis.mcsrv.icu/getDocuments", {
          params: {
            status: this.documentStatus,
            start: this.limit[0],
            end: this.limit[1],
          },
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.details = res.data.result;
          }
        });
    },
    getData: function (callback) {
      this.$Global
        .getURI("https://apis.mcsrv.icu/getDocuments", {
          params: {
            status: this.documentStatus,
            start: this.limit[0],
            end: this.limit[1],
          },
        })
        .then(callback);
    },
    loadMore: function () {
      this.limit = [this.limit[1], this.limit[1] + 50];
      this.getData((res) => {
        console.log(res);
        if (res.data.result) {
          if (res.data.result.length < 50) {
            this.allLoaded = true;
          }
        }
        this.details = [...this.details, ...res.data.result];
      });
    },
  },
  mounted: function () {
    this.updateData();
  },
};
</script>


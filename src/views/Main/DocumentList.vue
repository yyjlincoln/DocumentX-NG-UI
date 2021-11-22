<!-- 
document_details: Internal variable for rendering
details: Param, overrides document_details and documents.
documents: Param, only effective when details is null.
 -->
<template>
  <div>
    <div v-if="warning">{{ warning }}</div>
    <md-progress-spinner
      v-if="loading"
      md-mode="indeterminate"
    ></md-progress-spinner>
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
    <md-table
      v-if="!loading"
      v-model="document_details"
      md-sort="dScanned"
      md-sort-order="desc"
      md-card
    >
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name" md-sort-by="name">
          <a
            @click.prevent="PreviewDocument"
            :data-docid="item.docID"
            :href="'https://mcsrv.icu/view?docID=' + item.docID"
            >{{ item.name }}</a
          >
        </md-table-cell>
        <md-table-cell md-label="Subject" md-sort-by="subject">{{
          item.subject
        }}</md-table-cell>
        <md-table-cell md-label="Description" md-sort-by="desc">{{
          item.desc
        }}</md-table-cell>
        <md-table-cell md-label="Archived?">{{ item.archived }}</md-table-cell>
        <md-table-cell md-label="Time Scanned" md-sort-by="dScanned">{{
          item.dScanned ? new Date(item.dScanned * 1000) : "N/A"
        }}</md-table-cell>
        <md-table-cell md-label="DocID" md-sort-by="docID">{{
          item.docID
        }}</md-table-cell>
        <md-table-cell md-label="Comments" md-sort-by="comments">{{
          item.comments
        }}</md-table-cell>
        <md-table-cell md-label="More..." style="width: fit-content">
          <md-menu md-size="auto" md-align-trigger>
            <md-button md-menu-trigger class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="DownloadPopUp" :data-docid="item.docID"
                >Download</md-menu-item
              >
              <md-menu-item @click="openInApp" :data-docid="item.docID"
                >Open in App</md-menu-item
              >
              <md-menu-item @click="EditDoc" :data-docid="item.docID"
                >Edit</md-menu-item
              >
              <md-menu-item @click="CopyLink" :data-docid="item.docID"
                >Copy Link</md-menu-item
              >
              <md-menu-item @click="CopyAppLink" :data-docid="item.docID"
                >Copy App Link</md-menu-item
              >
              <md-menu-item
                @click="ArchiveAllSelected"
                :data-docid="item.docID"
                :data-simple="true"
                >Archive Selected Documents</md-menu-item
              >
              <md-menu-item
                @click="UnarchiveAllSelected"
                :data-docid="item.docID"
                :data-simple="true"
                >Unarchive Selected Documents</md-menu-item
              >
              <md-menu-item
                @click="PrintAllSelected"
                :data-docid="item.docID"
                :data-simple="true"
                >Print Selected Documents (Simple)</md-menu-item
              >
              <md-menu-item
                @click="PrintAllSelected"
                :data-docid="item.docID"
                :data-simple="false"
                >Print Selected Documents (Full)</md-menu-item
              >
              <md-menu-item @click="DeleteDoc" :data-docid="item.docID"
                >Delete</md-menu-item
              >
            </md-menu-content>
          </md-menu>
        </md-table-cell>
        <md-table-cell md-label="Select..." style="width: fit-content">
          <md-checkbox v-model="checkList[item.docID]"></md-checkbox>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <p>
      Showing
      {{ document_details == null ? 0 : document_details.length }} results.
    </p>
    <a v-if="!allLoaded_internal" href="#" @click="loadMore_internal"
      >Show more</a
    >
    <input
      style="
        opacity: 0;
        pointer-events: none;
        cursor: normal;
        z-index: -10000;
        position: fixed;
        top: -1000px;
      "
      id="CopyToClipboard"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    // documents: [],
    document_details: [],
    loading: true,
    showSnackbar: false,
    snack: "",
    CopyToClipboard: "",
    checkList: {},
    warning: null,
    allLoaded_internal: false,
    limits: [0, 50],
  }),
  created() {
    if (this.checkValidity()) {
      this.fullReload();
    }
  },
  watch: {
    details: function (before, after) {
      this.document_details = after;
      this.fullReload();
    },
    documents: function (before, after) {
      if (!this.details) {
        before; // We don't care about the value here, just to use those variables to avoid error.
        after;
        this.fullReload();
      }
    },
  },
  methods: {
    loadMore_internal() {},
    checkValidity() {
      // Check stuff
      if (this.documents == undefined || this.documents == null) {
        this.warning =
          "Fatal: this.documents must be supplied, even as an empty array [] to avoid error.";
        return;
      }
      if (this.details && !this.loadMore) {
        this.warning =
          "Warning: (future): LoadMore should be supplied if this.details is not null.";
      }
      if (this.details && !this.reloadData) {
        this.warning =
          "Fatal: reloadData must be supplied as a callback function to handle data update.";
        console.error(
          "Fatal: reloadData must be supplied as a callback function to handle data update."
        );
        return false;
      }

      // Bind external functions
      if (this.details && this.loadMore) {
        this.loadMore_internal = this.loadMore;
      }
      if (this.allLoaded != undefined && this.allLoaded != null) {
        this.allLoaded_internal = this.allLoaded;
      }

      return true;
    },
    fullReload: async function () {
      if (!this.checkValidity()) {
        return;
      }
      if (!this.details) {
        this.loading = true;
        this.document_details = [];
        // console.log("Start");
        // TODO: Implement limit & loadMore here, with the aid of loadMore_internal.

        var request = [];

        for (var x = 0; x < this.documents.length; x++) {
          request.push({
            route: "/getDocumentByID",
            data: {
              docID: this.documents[x],
              token: this.$Global.user.token,
              uID: this.$Global.user.uID,
            },
          });

          // try {
          //   let r = await this.$Global.getURI(
          //     "https://apis.mcsrv.icu/getDocumentByID",
          //     {
          //       params: {
          //         docID: this.documents[x],
          //       },
          //     }
          //   );
          //   this.document_details.push(r.data.result);
          // } catch (error) {
          //   console.log(error);
          //   //   Do nothing
          // }
        }
        let f = new FormData();
        f.append("batch", JSON.stringify(request));
        let r = await this.$Global.postURI(
          "https://apis.mcsrv.icu/batch",
          f,
          {}
        );

        for (var i = 0; i < r.data.batch.length; i++) {
          this.document_details.push(r.data.batch[i].result);
        }

        this.loading = false;
      } else {
        this.document_details = this.details;
        this.loading = false;
      }
    },
    DownloadPopUp: function (e) {
      var data = e.currentTarget.dataset;
      this.GetDownloadLink(data.docid).then((link) => {
        // window.open(link);
        // This fixes the problem with Safari
        if (link) {
          window.location = link;
        } else {
          window.location = "documentx://view/" + data.docid;
        }
      });
    },
    openInApp: function (e) {
      var data = e.currentTarget.dataset;
      window.location = "documentx://view/" + data.docid;
    },
    PreviewDocument: function (e) {
      var data = e.currentTarget.dataset;
      this.GetPreviewLink(data.docid).then((link) => {
        // window.open(link);
        // This fixes the problem with Safari
        if (link) {
          window.location = link;
        } else {
          window.location = "documentx://view/" + data.docid;
        }
      });
    },
    GetDownloadLink: async function (docID) {
      let res = await this.$Global.getURI(
        "https://apis.mcsrv.icu/getDownloadLink",
        {
          params: {
            docID: docID,
          },
        }
      );
      if (res.data.code >= 0) {
        return "https://apis.mcsrv.icu" + res.data.link;
      } else {
        this.$Global.pushAlert(
          "An error occured.",
          res.data.message + " (" + String(res.data.code) + ")"
        );
      }
    },
    GetPreviewLink: async function (docID) {
      let res = await this.$Global.getURI(
        "https://apis.mcsrv.icu/getPreviewLink",
        {
          params: {
            docID: docID,
          },
        }
      );
      if (res.data.code >= 0) {
        return "https://apis.mcsrv.icu" + res.data.link;
      } else {
        console.log(this.$Global);
        this.$Global.pushAlert(
          "An error occured.",
          res.data.message + " (" + String(res.data.code) + ")"
        );
      }
    },
    PrintAllSelected: function (e) {
      var docID = e.currentTarget.dataset.docid;
      var simple = e.currentTarget.dataset.simple;
      this.checkList[docID] = true;
      this.$router.push({
        path: "/app/print",
        query: {
          docIDs: JSON.stringify(Object.keys(this.checkList)),
          mode: simple ? "simple" : "full",
        },
      });
    },
    ArchiveAllSelected: function (e) {
      var docID = e.currentTarget.dataset.docid;
      this.checkList[docID] = true;

      var Request = [];

      for (var x in Object.keys(this.checkList)) {
        Request.push({
          route: "/editDocumentByID",
          data: {
            docID: Object.keys(this.checkList)[x],
            properties: JSON.stringify({
              archived: true,
            }),
            uID: this.$Global.user.uID,
            token: this.$Global.user.token,
          },
        });
      }
      var Form = new FormData();
      Form.append("batch", JSON.stringify(Request));

      this.$Global
        .postURI("https://apis.mcsrv.icu/batch", Form, {})
        .then((res) => {
          var success = 0;
          var failed = 0;
          for (var x = 0; x < res.data.batch.length; x++) {
            console.log(res.data.batch[x]);
            if (res.data.batch[x].code >= 0) {
              success += 1;
            } else {
              failed += 1;
              console.log("Error from API: " + res.data.batch[x].message);
            }
          }
          this.snack =
            "Successfully archived " +
            success +
            " documents, failed: " +
            failed;
          this.showSnackbar = true;
          this.loading = true;
          this.checkList = [];
          this.reloadData();
        });
    },
    UnarchiveAllSelected: function (e) {
      var docID = e.currentTarget.dataset.docid;
      this.checkList[docID] = true;

      var Request = [];

      for (var x in Object.keys(this.checkList)) {
        Request.push({
          route: "/editDocumentByID",
          data: {
            docID: Object.keys(this.checkList)[x],
            properties: JSON.stringify({
              archived: false,
            }),
            uID: this.$Global.user.uID,
            token: this.$Global.user.token,
          },
        });
      }
      var Form = new FormData();
      Form.append("batch", JSON.stringify(Request));

      this.$Global
        .postURI("https://apis.mcsrv.icu/batch", Form, {})
        .then((res) => {
          var success = 0;
          var failed = 0;
          for (var x = 0; x < res.data.batch.length; x++) {
            console.log(res.data.batch[x]);
            if (res.data.batch[x].code >= 0) {
              success += 1;
            } else {
              failed += 1;
              console.log("Error from API: " + res.data.batch[x].message);
            }
          }
          this.snack =
            "Successfully unarchived " +
            success +
            " documents, failed: " +
            failed;
          this.showSnackbar = true;
          this.loading = true;
          this.checkList = [];
          this.reloadData();
        });
    },
    EditDoc: function (e) {
      var data = e.currentTarget.dataset;
      this.$router.push({ path: "/app/edit", query: { docID: data.docid } });
    },
    CopyLink: function (e) {
      var c = document.getElementById("CopyToClipboard");
      var docID = e.currentTarget.dataset.docid;
      // Temporary - Need to integrate getDocumentAccess api.
      c.value = "https://mcsrv.icu/view?docID=" + docID;
      c.select();
      c.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.snack = "Link copied to clipboard.";
      this.showSnackbar = true;
    },
    CopyAppLink: function (e) {
      var c = document.getElementById("CopyToClipboard");
      var docID = e.currentTarget.dataset.docid;
      // Temporary - Need to integrate getDocumentAccess api.
      c.value = "documentx://view/" + docID;
      c.select();
      c.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.snack = "Link copied to clipboard.";
      this.showSnackbar = true;
    },
    DeleteDoc: function (e) {
      var data = e.currentTarget.dataset;
      this.$Global
        .getURI("https://apis.mcsrv.icu/deleteDocumentByID?docID=" + data.docid)
        .then((res) => {
          if (res.data.code >= 0) {
            this.snack = "Successfully deleted document.";
          } else {
            this.$Global.pushAlert(
              "Could not delete the document",
              res.data.result + " (" + String(res.data.code) + ")"
            );
          }
        })
        .catch((err) => {
          this.$Global.pushAlert("Could not delete the document", String(err));
          // this.snack = "Error: " + String(err);
        })
        .then(() => {
          this.showSnackbar = true;
          this.loading = true;
          this.reloadData();
        });
    },
  },
  props: ["documents", "details", "loadMore", "reloadData", "allLoaded"],
};
</script>

<style>
</style>
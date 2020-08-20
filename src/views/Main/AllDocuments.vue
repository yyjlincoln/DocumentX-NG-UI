<template>
  <div class="full">
    <p class="md-display-2">Documents Library</p>
    <div>
      <md-progress-spinner v-if="loading" md-mode="indeterminate"></md-progress-spinner>
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
      <!-- Confirm Dialog -->
      <!-- <md-dialog-confirm
      :md-active.sync="dialog.active"
      :md-title="dialog.title"
      :md-content="dialog.content"
      md-confirm-text="Continue"
      md-cancel-text="Cancel"
      @md-cancel="dialog.cancel"
      @md-confirm="dialog.confirm" />-->
      <!-- Confirm Dialog End-->
      <md-table v-if="!loading" v-model="documents" md-sort="dScanned" md-sort-order="desc" md-card>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
          <md-table-cell md-label="Subject" md-sort-by="subject">{{ item.subject }}</md-table-cell>
          <md-table-cell md-label="Description" md-sort-by="desc">{{ item.desc }}</md-table-cell>
          <md-table-cell md-label="Status" md-sort-by="status">{{ item.status }}</md-table-cell>
          <md-table-cell
            md-label="Time Scanned"
            md-sort-by="dScanned"
          >{{ item.dScanned? new Date(item.dScanned*1000) : "N/A" }}</md-table-cell>
          <md-table-cell md-label="DocID" md-sort-by="docID">{{ item.docID }}</md-table-cell>
          <md-table-cell md-label="Comments" md-sort-by="comments">{{ item.comments }}</md-table-cell>
          <md-table-cell md-label="More..." style="width: fit-content;">
            <md-menu md-size="auto" md-align-trigger>
              <md-button md-menu-trigger class="md-icon-button">
                <md-icon>more_vert</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="DownloadPopUp" :data-docid="item.docID">Download</md-menu-item>
                <md-menu-item @click="EditDoc" :data-docid="item.docID">Edit</md-menu-item>
                <md-menu-item @click="CopyLink" :data-docid="item.docID">Copy Link</md-menu-item>
                <md-menu-item
                  @click="PrintAllSelected"
                  :data-docid="item.docID"
                >Print Selected Documents</md-menu-item>
                <md-menu-item @click="DeleteDoc" :data-docid="item.docID">Delete</md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-table-cell>
          <md-table-cell md-label="Select..." style="width: fit-content;">
            <md-checkbox v-model="checkList[item.docID]"></md-checkbox>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <p>Showing {{documents==null?0:documents.length}} results.</p>
      <input
        style="opacity: 0; pointer-events: none; cursor: normal; z-index: -10000; position: fixed; top: -1000px;"
        id="CopyToClipboard"
      />
    </div>
  </div>
</template>

<script>
// const axios = require("axios").default;

export default {
  name: "AllDocuments",
  data: () => ({
    documents: [],
    loading: true,
    showSnackbar: false,
    snack: "",
    CopyToClipboard: "",
    checkList: {},
  }),
  methods: {
    updateData: function () {
      this.$Global.getURI("https://apis.mcsrv.icu/getDocuments").then((res) => {
        this.documents = res.data.result;
        this.loading = false;
      });
    },
    DownloadPopUp: function (e) {
      var data = e.currentTarget.dataset;
      this.GetDownloadLink(data.docid).then((link) => {
        // window.open(link);
        // This fixes the problem with Safari
        window.location = link;
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
      if (res.data.code == 0) {
        return "https://apis.mcsrv.icu" + res.data.link;
      } else {
        return "about:blank";
      }
    },
    PrintAllSelected: function (e) {
      var docID = e.currentTarget.dataset.docid;
      this.checkList[docID] = true;
      this.$router.push({
        path: "/app/print",
        query: {
          docIDs: JSON.stringify(Object.keys(this.checkList)),
        },
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
    DeleteDoc: function (e) {
      var data = e.currentTarget.dataset;
      this.$Global
        .getURI("https://apis.mcsrv.icu/deleteDocumentByID?docID=" + data.docid)
        .then((res) => {
          if (res.data.code == 0) {
            this.snack = "Successfully deleted document.";
          } else {
            this.snack =
              "Failed to complete the operation: " +
              res.data.result +
              " (" +
              String(res.data.code) +
              ")";
          }
        })
        .catch((err) => {
          this.snack = "Error: " + String(err);
        })
        .then(() => {
          this.showSnackbar = true;
          this.loading = true;
          this.updateData();
        });
    },
  },
  mounted: function () {
    this.updateData();
  },
};

//       {
//     name: "Test Document",
//     docID: "Document ID",
//     subject: "Software Design and Development",
//     status: "Digital (PDF)",
//     dScanned: 0,
//     comments: "",
//     desc: "There is no description available for this document.",
//     qr:
//       "https://apis.mcsrv.icu/qr?urlEncoded=" + btoa("https://google.com"),
//     checked: false,
//   },
//   {
//     name: "Test Document",
//     docID: "Document ID",
//     subject: "Software Design and Development",
//     status: "Digital (PDF)",
//     dScanned: 0,
//     comments: "",
//     desc: "There is no description available for this document.",
//     qr:
//       "https://www.google.com/logos/doodles/2020/jeanne-barets-280th-birthday-6753651837108693-l.png",
//     checked: false,
//   },

//   {
//     name: "Test1 Document",
//     docID: "Document ID",
//     subject: "Software Design and Development",
//     status: "Digital (PDF)",
//     dScanned: 1,
//     comments: "",
//     desc: "There is no description available for this document.",
//     qr:
//       "https://www.google.com/logos/doodles/2020/jeanne-barets-280th-birthday-6753651837108693-l.png",
//     checked: false,
//   },
</script>


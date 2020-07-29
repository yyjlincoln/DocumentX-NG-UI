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
      @md-confirm="dialog.confirm" /> -->
      <!-- Confirm Dialog End-->
      <md-table v-if="!loading" v-model="documents" md-sort="dScanned" md-sort-order="asc" md-card md-fixed-header>
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
                <md-menu-item @click="DeleteDoc" :data-docid="item.docID">Delete</md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-table-cell>
          <md-table-cell md-label="Select..." style="width: fit-content;">
            <md-checkbox v-model="item.checked"></md-checkbox>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <p>Showing {{documents.length}} results.</p>
    </div>
  </div>
</template>
<script>
const axios = require("axios").default;

export default {
  name: "AllDocuments",
  data: () => ({
    documents: [],
    loading: true,
    showSnackbar: false,
    snack: "",
    // dialog:{
    //     active:false,
    //     title:"Test",
    //     content:"Test",
    //     cancel:function(){this.dialog.active=false},
    //     confirm:()=>{}
    // }
  }),
  methods: {
    updateData: function () {
      axios.get("https://apis.mcsrv.icu/getDocuments").then((res) => {
        this.documents = res.data.result;
        this.loading = false;
      });
    },
    DownloadPopUp: function (e) {
      var data = e.currentTarget.dataset;
      window.open(
          this.GetDownloadLink(data.docid)
      );
    },
    GetDownloadLink:(docID)=>{
        return "https://apis.mcsrv.icu/viewDocumentByID?docID=" + docID
    },
    EditDoc: function (e) {
      var data = e.currentTarget.dataset;
      console.log(data);
      this.snack="Under development"
      this.showSnackbar=true

    },
    DeleteDoc: function (e) {
      var data = e.currentTarget.dataset;
      axios
        .get("https://apis.mcsrv.icu/deleteDocumentByID?docID=" + data.docid)
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
          this.snack = "Error: "+String(err);
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


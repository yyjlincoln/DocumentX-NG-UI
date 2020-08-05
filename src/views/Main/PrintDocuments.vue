<template>
  <div>
    <div v-if="!ready">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      <p>{{loadMessage}}</p>
    </div>
    <div v-for="doc in documents" :key="doc" class="printUI">
      <table class="tg" style="table-layout: fixed; width: 661px">
        <colgroup>
          <col style="width: 160px" />
          <col style="width: 171px" />
          <col style="width: 159px" />
          <col style="width: 171px" />
        </colgroup>
        <thead>
          <tr>
            <th class="tg-baqh" colspan="4">
              <span style="font-weight:bold">DocumentX Record</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="tg-baqh">Document Name</td>
            <td class="tg-baqh">{{doc.name}}</td>
            <td class="tg-c3ow">Document ID</td>
            <td class="tg-c3ow">{{doc.docID}}</td>
          </tr>
          <tr>
            <td class="tg-baqh">Subject</td>
            <td class="tg-baqh">{{doc.subject}}</td>
            <td class="tg-baqh">Document Status</td>
            <td class="tg-baqh">{{doc.status}}</td>
          </tr>
          <tr>
            <td class="tg-baqh">Date Scanned</td>
            <td class="tg-baqh">{{new Date(doc.dScanned*1000)}}</td>
            <td class="tg-baqh">Comments...</td>
            <td class="tg-baqh">{{doc.comments}}</td>
          </tr>
          <tr>
            <td class="tg-baqh">Description</td>
            <td class="tg-baqh" colspan="3">{{doc.desc}}</td>
          </tr>
          <tr>
            <td class="tg-baqh">Retrieve File...</td>
            <td class="tg-baqh" colspan="3" style="">
              <img :src="doc.qr" style="height: 70px;" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrintDocuments",
  data: () => ({
    documents: null,
    ready: false,
    loadMessage: null,
  }),
  methods: {},
  mounted() {
    try {
      var DocumentIDs = JSON.parse(
        this.$route.query.docIDs ? this.$route.query.docIDs : "[]"
      );
    } catch (e) {
      this.loadMessage = "Could not parse JSON.";
    }

    if (DocumentIDs == []) {
      this.$router.go(-1);
    }
    console.log(DocumentIDs);
    this.documents = [];
    for (var x = 0; x < DocumentIDs.length; x++) {
      this.$Global.getDocumentByID(DocumentIDs[x]).then((res) => {
        if (res.code == 0 && res.result != undefined) {
          var r = res.result;
          r.qr =
            "https://apis.mcsrv.icu/qr?urlEncoded=" +
            btoa("https://mcsrv.icu/view?docID=" + res.result.docID);
          this.documents.push(r);
        }
      });
    }
    this.ready = true;
  },
};
</script>

<style scoped>
.tg {
  border-collapse: collapse;
  border-spacing: 0;
  page-break-inside: avoid;
  page-break-after: auto;
}
.tg td {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
  page-break-inside: avoid;
}
.tg th {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
  page-break-inside: avoid;
}
.tg .tg-baqh {
  text-align: center;
  vertical-align: top;
  page-break-inside: avoid;
}
.tg .tg-c3ow {
  border-color: black;
  text-align: center;
  vertical-align: top;
  page-break-inside: avoid;
}
.tg .tg-0lax {
  text-align: left;
  vertical-align: top;
  page-break-inside: avoid;
}

.printUI {
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.vert_cent {
  display: flex;
  flex-direction: column;
}
</style>
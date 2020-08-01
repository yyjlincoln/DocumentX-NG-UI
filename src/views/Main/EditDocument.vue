<template>
  <form
    novalidate
    class="md-layout"
    @submit.prevent="validateUser"
    style="width: 100%; position: relative; display:flex; justify-content: center;"
  >
    <md-card class="md-layout-item md-size-50 md-small-size-100" style="height: fit-content">
      <!-- <md-card-header>
          <div class="md-title">Add a document</div>
      </md-card-header>-->

      <md-card-content>
        <p>Editing Document #{{this.docID}}</p>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('docID')">
              <label for="docID">DocID</label>
              <md-input
                name="DocID"
                id="DocID"
                autocomplete
                v-model="form.docID"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.docID.required">DocID is required</span>
              <span class="md-error" v-else-if="!$v.form.docID.minlength">This field is invalid.</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('status')">
              <label for="status">Status</label>
              <md-input
                name="status"
                id="status"
                autocomplete
                v-model="form.status"
                :disabled="sending"
              />
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('name')">
              <label for="name">Name</label>
              <md-input name="name" id="name" autocomplete v-model="form.name" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.name.required">Document Name is required</span>
              <span class="md-error" v-else-if="!$v.form.name.minlength">This field is invalid.</span>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('subject')">
              <label for="subject">Subject</label>
              <md-input
                name="subject"
                id="subject"
                autocomplete
                v-model="form.subject"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.subject.required">Subject is required</span>
              <span class="md-error" v-else-if="!$v.form.subject.minlength">This field is invalid</span>
            </md-field>
          </div>
        </div>

        <md-field :class="getValidationClass('desc')">
          <label for="desc">Description</label>
          <md-textarea name="desc" id="desc" v-model="form.desc" :disabled="sending" />
        </md-field>
        <md-field :class="getValidationClass('comments')">
          <label for="comments">Comments</label>
          <md-textarea name="comments" id="comments" v-model="form.comments" :disabled="sending" />
        </md-field>
      </md-card-content>

      <md-progress-bar md-mode="indeterminate" v-if="sending" />

      <md-card-actions>
        <md-button type="submit" class="md-primary" :disabled="sending">Update</md-button>
      </md-card-actions>
    </md-card>

    <md-snackbar :md-active.sync="showSnackBar" :md-persistent="true">{{snackBarText}}</md-snackbar>
  </form>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
// const axios = require("axios");

export default {
  mixins: [validationMixin],
  data: () => ({
    docID: null,
    form: {
      name: null,
      subject: null,
      desc: null,
      comments: null,
      file: null,
      docID: null,
      status: null,
    },
    sending: true,
    showSnackBar: false,
    snackBarText: "",
  }),
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
      },
      subject: {
        required,
      },
      docID: {
        required,
      },
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.docID = null;
      this.form.name = null;
      this.form.subject = null;
      this.form.desc = null;
      this.form.comments = null;
      this.form.status = null;
    },
    confirmRequest: function () {
      this.sending = true;
      var formData = new FormData();
      formData.append("docID", this.docID);

      console.log(this.$Global)
      // axios
      this.$Global
        .getURI("https://apis.mcsrv.icu/editDocumentByID", {
          params: {
            docID: this.docID,
            properties: JSON.stringify({
              docID: this.form.docID,
              name: this.form.name,
              subject: this.form.subject,
              desc: this.form.desc,
              comments: this.form.comments,
              status: this.form.status,
            }),
          },
        })
        .then((res) => {
          this.snackBarText =
            res.data.message + " (" + String(res.data.code) + ")";
          if (res.data.code == 0) {
            this.snackBarText =
              "Successfully updated file (#" + this.docID + ")";
            this.showSnackBar = true;
            this.clearForm();
            this.$router.go(-1);
          }
        })
        .catch(() => {
          this.snackBarText = "Failed to complete the request.";
        })
        .then(() => {
          this.showSnackBar = true;
          this.sending = false;
        });
    },
    validateUser: function (e) {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.confirmRequest(e);
      }
    },
    loadData: function () {
      if (this.docID == null) {
        this.snackBarText = "No DocID is provided!";
        this.showSnackBar = true;
        window.history.back();
        return;
      }
      // axios
      this.$Global
        .getURI("https://apis.mcsrv.icu/getDocumentByID", {
          params: {
            docID: this.docID,
          },
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.form = res.data.result;
            this.sending = false;
          }
        })
        .catch((e) => {
          console.error(e);
          this.snackBarText = "Request error!";
          this.showSnackBar = true;
        })
        .then(() => {
          this.sending = false;
        });
    },
  },
  mounted: function () {
    this.docID = this.$route.query.docID;
    this.loadData();
  },
};
</script>
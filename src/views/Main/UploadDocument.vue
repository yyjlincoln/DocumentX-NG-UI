<template>
  <div class="full">
    <!-- <div> -->
    <!-- Form -->
    <p class="md-display-2">Upload a document</p>
    <form
      novalidate
      class="md-layout"
      @submit.prevent="validateUser"
      style="
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
      "
    >
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <!-- <md-card-header>
          <div class="md-title">Add a document</div>
        </md-card-header> -->

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('name')">
                <label for="name">Name</label>
                <md-input
                  name="name"
                  id="name"
                  autocomplete
                  v-model="form.name"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.name.required"
                  >Document Name is required</span
                >
                <span class="md-error" v-else-if="!$v.form.name.minlength"
                  >This field is invalid.</span
                >
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
                <span class="md-error" v-if="!$v.form.subject.required"
                  >Subject is required</span
                >
                <span class="md-error" v-else-if="!$v.form.subject.minlength"
                  >This field is invalid</span
                >
              </md-field>
            </div>
          </div>

          <md-field :class="getValidationClass('desc')">
            <label for="desc">Description</label>
            <md-textarea
              name="desc"
              id="desc"
              v-model="form.desc"
              :disabled="sending"
            />
          </md-field>
          <md-field :class="getValidationClass('comments')">
            <label for="comments">Comments</label>
            <md-textarea
              name="comments"
              id="comments"
              v-model="form.comments"
              :disabled="sending"
            />
          </md-field>
          <md-field :class="getValidationClass('file')">
            <label for="file">Pick a file...</label>
            <md-file v-model="form.file" name="file" />
            <span class="md-error" v-if="!$v.form.file.required"
              >A file is required</span
            >
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending"
            >Upload</md-button
          >
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="showSnackBar">{{
        snackBarText
      }}</md-snackbar>
    </form>
    <!-- Form End -->
    <!-- </div> -->
  </div>
</template>
<script>
import ex from "../Main";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
// const axios = require("axios");
export default {
  name: "UploadDocument",
  mixins: [validationMixin],
  data: () => ({
    form: {
      name: null,
      subject: null,
      desc: null,
      comments: null,
      file: null,
    },
    sending: false,
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
      file: {
        required,
      },
    },
  },
  methods: {
    navigate: ex.methods.navigate,
    navigateTo: ex.methods.navigateTo,
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
      this.form.name = null;
      this.form.subject = null;
      this.form.desc = null;
      this.form.comments = null;
      this.form.file = null;
    },
    confirmRequest: function (e) {
      this.sending = true;
      var formData = new FormData();
      formData.append("name", this.form.name);
      formData.append("subject", this.form.subject);
      formData.append("desc", this.form.desc ? this.form.desc : "");
      formData.append("comments", this.form.comments ? this.form.comments : "");
      formData.append("file", e.target[5].files[0], this.form.file);

      this.$Global
        .postURI("https://apis.mcsrv.icu/uploadDocument", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.code >= 0) {
            this.snackBarText =
              "Successfully uploaded file (#" + res.data.docID + ")";
            this.clearForm();
            this.showSnackBar = true;
          } else {
            this.$Global.alert.pushAlert(
              "An error occured",
              res.data.message + " (" + String(res.data.code) + ")"
            );
          }
        })
        .catch(() => {
          this.snackBarText = "Failed to complete the request.";
        })
        .then(() => {
          this.sending = false;
        });
    },
    validateUser: function (e) {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.confirmRequest(e);
      }
    },
  },
  mounted: function () {},
};
</script>
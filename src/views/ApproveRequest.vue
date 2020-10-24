<template>
  <div>
    <div class="centered-container">
      <md-content class="md-elevation-3">
        <div class="title">
          <img src="../assets/logo.png" />
          <div class="md-title">Remote Login Request</div>
          <div class="md-body-1" style="margin-top: 10px">
            Do you want to log in to a remote computer?
          </div>
          <div class="md-body-2" style="margin-top: 10px">
            This will share your login cridentials with that computer. This can
            be dangerous.
          </div>
          <md-checkbox v-model="tempToken"
            >Issue a temporary token (valid for 15s)</md-checkbox
          >
          <p v-if="status">{{ status }}</p>
          <div v-if="!status" style="margin-top: 30px">
            <md-button class="md-raised" @click="cancel">Cancel</md-button>
            <md-button class="md-raised md-primary" @click="approve"
              >Approve</md-button
            >
          </div>

          <!-- <a @click="">Approve</a> -->
        </div>
      </md-content>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    rID: "",
    status: "",
    tempToken: true,
  }),
  methods: {
    async cancel() {
      let res = await this.$Global.getURI(
        "https://apis.mcsrv.icu/rejectRemoteLogin",
        {
          params: {
            rID: this.rID,
          },
        }
      );
      if(res.data.code==0){
        this.status = "Cancelled.";
      } else {
        this.status = "Could not reject the login request, but since you have not authenticated, your login is still safe."
      }
      //   this.$router.go(-1);
    },
    async approve() {
      let res = await this.$Global.getURI(
        "https://apis.mcsrv.icu/approveRemoteLogin",
        {
          params: {
            rID: this.rID,
            tempToken: this.tempToken ? "true" : null,
          },
        }
      );
      if (res.data.code == 0) {
        this.status = "Approved.";
      } else {
        this.status = "Error: " + res.data.message;
      }
    },
  },
  async mounted() {
    this.rID = this.$route.query.rID;
    console.log(this.rID);
    if (!this.rID) {
      this.status = "Invalid request!";
      return;
    }
    this.status = "Validating request...";
    // Validate Request
    let res = await this.$Global.getURI(
      "https://apis.mcsrv.icu/validateRemoteLogin",
      {
        params: {
          rID: this.rID,
        },
      }
    );
    if (res.data.code != 0) {
      this.status = "Invalid request!";
      return;
    }
    this.status=""

    this.$Global.init().then((res) => {
      if (res.code == -1) {
        this.$router.push({
          path: "/auth",
          query: {
            next: btoa(this.$route.fullPath),
            remote:'false'
          },
        });
      }
    });
  },
};
</script>

<style scoped>
</style>
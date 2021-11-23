<template>
  <div class="main">
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed">
        <md-app-toolbar class="md-dense md-primary">
          <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
              <md-button
                class="md-icon-button"
                @click="menuVisible = !menuVisible"
              >
                <md-icon>menu</md-icon>
              </md-button>

              <a
                class="md-title"
                @click.prevent="menuVisible = !menuVisible"
                href="#"
                >{{ title }}</a
              >
            </div>

            <div class="md-toolbar-section-end">
              <md-menu>
                <md-button
                  class="md-icon-button"
                  md-size="auto"
                  md-menu-trigger
                >
                  <md-avatar style="background: rgba(0, 0, 0, 0.2)">{{
                    $Global.user.name ? $Global.user.name[0].toUpperCase() : "?"
                  }}</md-avatar>
                  <md-menu-content>
                    <md-menu-item
                      >You are logged in as
                      {{ $Global.user.name }}</md-menu-item
                    >
                    <md-menu-item @click="logout">Logout</md-menu-item>
                    <!-- Can not directly call $Global.logout due to issues with "this" -->
                  </md-menu-content>
                </md-button>
              </md-menu>
              <!-- <md-button class="md-icon-button">
                <md-icon>more_vert</md-icon>
              </md-button>-->
            </div>
          </div>
        </md-app-toolbar>

        <md-app-drawer :md-active.sync="menuVisible">
          <md-list>
            <md-list-item
              class
              md-elevation="1"
              @click="menuVisible = !menuVisible"
            >
              <md-icon>keyboard_arrow_left</md-icon>
              <span class="md-list-item-text">Hide</span>
            </md-list-item>
            <md-list-item @click="navigate" data-where>
              <md-icon>dashboard</md-icon>
              <span class="md-list-item-text">Dashboard</span>
            </md-list-item>
            <md-list-item @click="navigate" data-where="all">
              <md-icon>book</md-icon>
              <span class="md-list-item-text">All documents</span>
            </md-list-item>
            <md-list-item @click="navigate" data-where="search">
              <md-icon>search</md-icon>
              <span class="md-list-item-text">Search...</span>
            </md-list-item>
            <md-list-item @click="navigate" data-where="upload">
              <md-icon>cloud_upload</md-icon>
              <span class="md-list-item-text">Upload...</span>
            </md-list-item>
            <md-list-item @click="navigate" data-where="resourcegroups">
              <md-icon>book</md-icon>
              <span class="md-list-item-text">Resource Groups</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>

        <md-app-content style="display: flex">
          <router-view />
        </md-app-content>
      </md-app>
    </div>
    <div v-if="rerender || !rerender">
      <div v-if="$Global.config.debug" id="debug">
        <div>DocumentX {{ $Global.config.version }}</div>
        <div>Debug mode is {{ $Global.config.debug ? "on" : "off" }}</div>
        <div>uID: {{ $Global.user.uID }}</div>
        <div>Token: {{ $Global.user.token }}</div>
        <div>
          <a
            :href="
              'https://apis.mcsrv.icu/getAuthStatus?uID=' +
              $Global.user.uID +
              '&token=' +
              $Global.user.token
            "
            target="_blank"
            >Request as this user</a
          >
        </div>
        <a href="#" @click="toggleDebug">Toggle Development Mode</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data: () => ({
    menuVisible: false,
    title: "Dashboard",
    rerender: true,
  }),
  methods: {
    navigate: function (e) {
      let where = e.currentTarget.dataset.where;
      if (where == "all") {
        this.title = "All Documents";
      } else if (where == "edit") {
        this.title = "Edit Document";
      } else if (where == "upload") {
        this.title = "Upload...";
      } else if (where == "search") {
        this.title = "Search";
      } else if (where == "" || where == "/") {
        this.title = "Dashboard";
      }
      this.$router.push("/app/" + e.currentTarget.dataset.where);
      this.menuVisible = false;
    },
    navigateTo: function (location, params = {}, root = "/app/") {
      var par = "";
      for (var x in params) {
        par = par + x + "=" + params[x] + "&";
      }
      this.$router.push(root + location + "");
    },
    async logout() {
      this.$Global.alert.pushAlert("Do you want to log out?", "", [
        {
          title: "Cancel",
          type: "cancel",
        },
        {
          title: "Logout",
          type: "destructive",
          handler: async () => {
            await this.$Global.logout();
            this.$router.replace("/");
          },
        },
      ]);
    },
    toggleDebug: function () {
      this.$Global.toggleDebug();
      this.rerender = !this.rerender;
    },
  },
  mounted() {
    // this.$Global.init().then((res) => {
    //   if (res.code == 0) {
    //     console.log("init ok");
    //   } else if (res.code == -1) {
    //     console.log("Not logged in");
    //     let path = this.$route.path.split("/", 2);
    //     if (path[1] === "app") {
    //       this.$router.push("/auth");
    //     }
    //   } else {
    //     console.log(res);
    //   }
    // });
  },
};
</script>
<style scoped>
.md-app {
  height: 100vh;
}
</style>
<style>
.full {
  position: relative;
  min-height: 100%;
  min-width: 100%;
}

.lowercase {
  text-transform: none;
}
</style>
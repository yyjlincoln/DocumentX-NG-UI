<template>
  <div class="main">
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed">
        <md-app-toolbar class="md-dense md-primary">
          <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
              <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                <md-icon>menu</md-icon>
              </md-button>

              <a class="md-title" @click="menuVisible = !menuVisible" href="#">{{title}}</a>
            </div>

            <div class="md-toolbar-section-end">
              <md-menu>
                <md-button class="md-icon-button" md-size="auto" md-menu-trigger>
                  <md-avatar style="background: rgba(0,0,0,0.2)">{{$Global.user.name?$Global.user.name[0].toUpperCase():"?"}}</md-avatar>
                  <md-menu-content>
                    <md-menu-item>You are logged in as {{$Global.user.name}}</md-menu-item>
                    <md-menu-item to="/" @click="logout">Logout</md-menu-item>
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
            <md-list-item class md-elevation="1" @click="menuVisible = !menuVisible">
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
          </md-list>
        </md-app-drawer>

        <md-app-content style="display: flex;">
          <router-view />
        </md-app-content>
      </md-app>
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data: () => ({
    menuVisible: false,
    title: "Dashboard",
  }),
  methods: {
    navigate: function (e) {
      let where = e.currentTarget.dataset.where
      if(where=="all"){
        this.title="All Documents"
      } else if(where=="edit"){
        this.title="Edit Document"
      } else if(where=="upload"){
        this.title="Upload..."
      } else if (where=="search"){
        this.title="Search"
      } else if (where=="" || where=="/"){
        this.title="Dashboard"
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
    logout(){
      this.$Global.logout()
    }
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
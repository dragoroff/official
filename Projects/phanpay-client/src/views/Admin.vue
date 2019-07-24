<template>
  <div class="admin">
    <md-toolbar id="toolbar" class="custom-style">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon class="custom-style">menu</md-icon>
      </md-button>
      <router-link to="/admin" class="md-title custom-style link">Phanatic Pay &copy;</router-link>
    </md-toolbar>

    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <router-link to="/admin" class="md-title link">Phanatic Pay &copy;</router-link>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <md-icon>assessment</md-icon>
          <span class="md-list-item-text">
            <router-link to="/admin-reports" class="sidebar-links">Reports</router-link>
          </span>
        </md-list-item>
      </md-list>

      <md-list>
        <md-list-item>
          <md-icon>exit_to_app</md-icon>
          <span class="md-list-item-text">
            <span class="sidebar-links" v-on:click="logout">Sign Out</span>
          </span>
        </md-list-item>
      </md-list>
    </md-drawer>
    <img alt="logo" src="../assets/pay.png" style="height:150px" />
    <router-view />
  </div>
</template>
<script>
export default {
  data: () => ({
    showNavigation: false,
    showSidepanel: false
  }),
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    }
  }
};
</script>
<style>
.custom-style {
  background-color: black !important;
  color: white !important;
}
.link {
  text-decoration: none !important;
}
.sidebar-links {
  color: black !important;
}
.sidebar-links:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>

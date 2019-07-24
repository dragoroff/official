<template>
  <div class="home">
    <div class="page-container md-layout-column">
      <md-toolbar id="toolbar" class="custom-style">
        <md-button class="md-icon-button" @click="showNavigation = true">
          <md-icon class="custom-style">menu</md-icon>
        </md-button>
        <router-link to="/dashboard" class="md-title custom-style link">Phanatic Pay &copy;</router-link>
        <span class="md-toolbar-section-end">
          Welcome,
          <span id="name">{{this.first_name}}!</span>
        </span>
      </md-toolbar>

      <md-drawer :md-active.sync="showNavigation" md-swipeable>
        <md-toolbar class="md-transparent" md-elevation="0">
          <router-link to="/dashboard" class="md-title link">Phanatic Pay &copy;</router-link>
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>attach_money</md-icon>
            <router-link to="/deposit" class="md-list-item-text sidebar-links">Deposit</router-link>
          </md-list-item>

          <md-list-item>
            <md-icon>payment</md-icon>
            <router-link to="/withdrawal" class="md-list-item-text sidebar-links">Withdrawal</router-link>
          </md-list-item>

          <md-list-item>
            <md-icon>equalizer</md-icon>
            <router-link to="/reports" class="md-list-item-text sidebar-links">Reports</router-link>
          </md-list-item>

          <md-list-item>
            <md-icon>exit_to_app</md-icon>
            <span class="md-list-item-text">
              <span class="sidebar-links" v-on:click="logout">Sign Out</span>
            </span>
          </md-list-item>
        </md-list>
      </md-drawer>
      <img alt="logo" src="../assets/pay.png" style="height:150px" />
      <div class="md-title">Balance: {{this.balance}} NIS</div>
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { domain } from "../domain.js";
export default {
  data: () => ({
    showNavigation: false,
    showSidepanel: false,
    first_name: null,
    balance: null,
    usr_id: null
  }),
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    }
  },
  created() {
    this.usr_id = localStorage.getItem("id");
    axios
      .get(`${domain}/api/initial-info/${this.usr_id}`)
      .then(res => {
        this.first_name = res.data.data.name;
        this.balance = res.data.data.balance;
      })
      .catch(err => this.errors.push(err.response.data["error"]));
  }
};
</script>
<style>
.custom-style {
  background-color: black !important;
  color: white !important;
}

#name {
  text-transform: capitalize;
}
.success {
  background: lightgreen !important;
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

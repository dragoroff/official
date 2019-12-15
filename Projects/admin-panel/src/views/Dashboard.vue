<template>
  <div>
    <div v-if="width > 768">
      <el-container>
        <dash-aside></dash-aside>
        <el-container>
          <el-header height="75px">
            <div style="float:right;">
              <span style="margin-right: 20px">Hello, {{getState.username}}</span>
              <router-link to="/signin">
                <el-button type="success">{{pageText.button.logout}}</el-button>
              </router-link>
            </div>
          </el-header>
          <el-main>
            <router-view :width="width"></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div v-else>
      <el-container>
        <el-header height="75px">
          <el-row>
            <el-col :md="18" :sm="20" :xs="22">
              <el-menu :default-active="this.$route.path" mode="horizontal">
                <el-menu-item index="/dashboard" style="margin-right:15px">
                  <router-link to="/dashboard">Dashboard</router-link>
                </el-menu-item>
                <el-menu-item index="/dashboard/balance" style="margin-right:15px">
                  <router-link to="/dashboard/balance">Balance</router-link>
                </el-menu-item>
                <el-menu-item index="/dashboard/transactions">
                  <router-link to="/dashboard/transactions">Transactions</router-link>
                </el-menu-item>
              </el-menu>
            </el-col>
            <el-col :md="6" :sm="4" :xs="2">
              <router-link to="/signin">
                <el-button type="success" size="mini">{{pageText.button.logout}}</el-button>
              </router-link>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view :width="width"></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import Aside from "../components/dashboard/Aside.vue";
import { defaultText } from "../mixins.js";
export default {
  data() {
    return {
      width: window.innerWidth
    };
  },
  mixins: [defaultText],
  components: {
    dashAside: Aside
  },
  mounted() {
    window.onresize = () => {
      this.width = window.innerWidth;
    };
  }
};
</script>
<style scoped>
.el-header {
  color: #333;
  line-height: 60px;
  margin: -10px 30px;
  background-color: none;
}
.el-main {
  background-color: #f2f6fc;
  min-height: 100vh;
}
.el-button {
  margin-right: -40px !important;
  margin-left: 5px !important;
}
a {
  text-decoration: none;
  color: black;
}
@media (max-width: 375px) {
  .el-menu-item :nth-child(1) {
    width: 65px;
    margin-left: -50px !important;
  }
  .el-main {
    margin-left: -10px;
  }
}
@media (min-width: 375px) {
  .el-menu-item :nth-child(1) {
    width: 65px;
    margin-left: -40px !important;
  }
}
</style>

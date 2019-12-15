<template>
  <div>
    <el-aside>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="el-menu-vertical-demo"
          :default-active="this.$route.path"
          >
          <el-menu-item index="0" class="image">
            <router-link to="/dashboard">
              <img src="../../assets/Zotapay-crop.png" alt="Zotapay">
            </router-link>
          </el-menu-item>
            <router-link to="/dashboard">
              <el-menu-item index="/dashboard">
                <i class="el-icon-menu"></i>
                {{pageText.dashboard}}
              </el-menu-item>
            </router-link>

            <router-link to="/dashboard/balance">
              <el-submenu index="/dashboard/balance">
                <template slot="title">
                  <i class="fas fa-dollar-sign fa-lg" style="margin-right:10px;"></i>
                  {{pageText.balance}}
                </template>
                <el-menu-item index="/dashboard/balance">
                    {{pageText.balance}}
                </el-menu-item>
                <router-link to="/dashboard/history">
                  <el-menu-item index="/dashboard/history">
                    {{pageText.history}}
                  </el-menu-item>
                </router-link>
              </el-submenu>
            </router-link>
            
            <router-link to="/dashboard/transactions">
              <el-menu-item index="/dashboard/transactions">
                <i class="fab fa-telegram-plane fa-lg" style="margin-right:10px;"></i>
                {{pageText.transactions}}
              </el-menu-item>
            </router-link>
        </el-menu>
      </el-aside>
  </div>
</template>
<script>
import { defaultText } from "../../mixins.js";
export default {
  mixins: [defaultText]
};
</script>
<style scoped>
.el-aside {
  margin: -10px;
}
.image {
  background-color: #545c64 !important;
  cursor: inherit;
}
.el-menu {
  position: fixed;
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
}
a {
  color: inherit;
  text-decoration: inherit;
}
</style>

<template>
  <div>
    <el-container>
      <el-main>
        <img src="../assets/Zotapay.png" alt="Zotapay Logo" style="margin-bottom: 55px">
        <app-sign-in></app-sign-in>
     </el-main>
    </el-container>
  </div>
</template>
<script>
import SignIn from "../components/login/SignIn.vue";
export default {
  components: {
    appSignIn: SignIn
  }
};
</script>

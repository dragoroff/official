<template>
  <div class="home">
    <img alt="logo" src="../assets/pay.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <h1>Welcome to Phanatic Pay</h1>
    <div id="nav">
      <router-link to="/signin">Sign In</router-link>
      <router-link to="/signup">Sign Up</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "main"
  // components: {
  //   HelloWorld
  // }
};
</script>

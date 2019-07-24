<template>
  <div id="signin">
    <div class="md-layout">
      <div class="md-layout-item md-size-35"></div>
      <div class="md-layout-item md-gutter md-size-30">
        <form @submit.prevent="submitForm">
          <md-card class="md-with-hover">
            <md-ripple>
              <md-card-header>
                <div class="md-title">Sign in to your account in Phanatic Pay</div>
              </md-card-header>
              <md-card-content>
                <p v-if="errors.length" style="color:red">
                  <strong>Please correct the following error(s):</strong>
                  <ul>
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
                </p>
                <md-field>
                  <label for="email">Email</label>
                  <md-input name="email" v-model="email" required></md-input>
                </md-field>
                <md-field>
                  <label for="password">Password</label>
                  <md-input name="password" v-model="password" type="password" required></md-input>
                </md-field>
              </md-card-content>
              <md-card-actions>
                <md-button type="submit" class="md-primary">Sign In</md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>
        </form>
      </div>
      <div class="md-layout-item md-size-35"></div>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/signup">Sign Up</router-link>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { domain } from "../domain.js";
export default {
  data: () => ({
    errors: [],
    email: "",
    password: ""
  }),
  methods: {
    submitForm() {
      this.errors = []
        const data = {
          data: {
            email: this.email,
            password: this.password
          }
        };
        axios
          .post(`${domain}/api/sign-in/`, data)
          .then(res => {
            if (res.data.data.status === 'admin'){
              localStorage.setItem("token", "secret_token")
              localStorage.setItem("status", res.data.data.status)
              localStorage.setItem("id", res.data.data.user_id)
              this.$router.push("/admin")
            } else {
              localStorage.setItem("token", "secret_token")
              localStorage.setItem("status", res.data.data.status)
              localStorage.setItem("id", res.data.data.user_id)
              this.$router.push("/dashboard")
            }
          })
          .catch(err => this.errors.push(err.response.data['error']));
    },
  }
};
</script>

<style scoped>
#signin {
  margin: 150px;
}
</style>
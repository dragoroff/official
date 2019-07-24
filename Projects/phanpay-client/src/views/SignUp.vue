<template>
  <div id="signup">
    <div class="md-layout">
      <div class="md-layout-item md-size-35"></div>
      <div class="md-layout-item md-gutter md-size-30">
        <form @submit.prevent="submitForm">
          <md-card class="md-with-hover">
            <md-ripple>
              <md-card-header>
                <div class="md-title">Start your path with Phanatic Pay</div>
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
                <md-field>
                  <label for="name">Name</label>
                  <md-input name="name" v-model="name" required></md-input>
                </md-field>
              </md-card-content>
              <md-card-actions>
                <md-button type="submit" class="md-primary">Sign Up</md-button>
              </md-card-actions>
            </md-ripple>
          </md-card>
        </form>
      </div>
      <div class="md-layout-item md-size-35"></div>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/signin">Sign In</router-link>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { domain } from "../domain.js";
export default {
  data: () => ({
    errors: [],
    name: "",
    email: "",
    password: ""
  }),
  methods: {
    submitForm() {
      if (!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");
      } else {
        this.errors = []
        const data = {
          data: {
            name: this.name,
            email: this.email,
            password: this.password
          }
        };
        axios
          .post(`${domain}/api/sign-up/`, data)
          .then(() => this.$router.push("/signin"))
          .catch(err => this.errors.push(err.response.data['error']));
      }
    },
    validEmail: email => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>

<style scoped>
#signup {
  margin: 150px;
}
</style>
<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="{span: 12, offset: 6}" :md="{span: 12, offset: 6}">
        <el-card class="card">
          <form @submit.prevent="sendData">
            <div class="email-field">
              <el-input type="text" name="email" v-model="email" :placeholder="pageText.email">
                <template slot="prepend">
                  <i class="fas fa-envelope"></i>
                </template>
              </el-input>
            </div>
            <div class="password-field">
              <el-input
                type="password"
                name="password"
                v-model="password"
                :placeholder="pageText.password"
              >
                <template slot="prepend">
                  <i class="fas fa-star-of-life"></i>
                </template>
              </el-input>
            </div>
            <div class="form-footer">
              <el-button
                class="button"
                type="success"
                native-type="submit"
              >{{pageText.button.submit}}</el-button>
            </div>
          </form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    pageText() {
      return this.$store.getters.getPageText;
    }
  },
  methods: {
    sendData() {
      const data = {
        email: this.email,
        password: this.password
      };
      axios
        .post("/signin", data)
        .then(res => console.log(res))
        .then(() => this.$router.push("/dashboard"))
        .catch(err => console.log(err));
    }
  }
};
</script>
<style scoped>
.card {
  padding: 15px;
  padding-bottom: 50px;
}
.email-field,
.password-field {
  margin-top: 15px;
}

.form-footer {
  margin-top: 35px;
}
.form-footer .button {
  float: right;
}
.form-footer .checkbox {
  float: left;
}
</style>

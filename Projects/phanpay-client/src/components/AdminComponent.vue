<template>
  <div>
    <div class="md-title">Fees: {{this.balance}} NIS</div>
    <md-content class="md-accent" v-if="errors">
      <ul v-for="error in errors" :key="error">
        <div class="md-title">{{error}}</div>
      </ul>
    </md-content>
    <div class="md-layout" style="margin-top:30px">
      <div class="md-layout-item md-size-20"></div>
      <div class="md-layout-item md-size-60">
        <md-table v-if="state" style="margin-bottom:30px">
          <md-table-row>
            <md-table-head id="head">Amount</md-table-head>
            <md-table-head id="head">Date</md-table-head>
            <md-table-head id="head">From</md-table-head>
            <md-table-head id="head">To</md-table-head>
          </md-table-row>
          <md-table-row v-for="(val, index) in state" :key="index">
            <md-table-cell>{{val.amount}}</md-table-cell>
            <md-table-cell>{{val.date}}</md-table-cell>
            <md-table-cell>{{val.from}}</md-table-cell>
            <md-table-cell>{{val.to}}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
      <div class="md-layout-item md-size-20"></div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { domain } from "../domain.js";
export default {
  data: () => ({
    balance: null,
    state: [],
    errors: []
  }),
  created() {
    axios
      .get(`${domain}/api/fees-history/`)
      .then(res => {
        this.balance = res.data.data.balance;
        this.state = res.data.data.state;
      })
      .catch(err => this.errors.push(err.response.data["error"]));
  }
};
</script>
<style>
#head {
  text-align: center;
}
</style>

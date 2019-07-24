<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-35"></div>
    <div class="md-layout-item md-size-30">
      <md-content class="md-accent" v-show="errors">
        <ul v-for="error in errors" :key="error">
          <div class="md-title">{{error}}</div>
        </ul>
      </md-content>
      <md-field style="margin-top:25px">
        <label for="report">Reports</label>
        <md-select v-model="report" name="report">
          <md-option value="deposits">Deposits</md-option>
          <md-option value="withdrawals">Withdrawals</md-option>
          <md-option value="transaction">Transaction History</md-option>
          <md-option value="fees">Fees Amount</md-option>
        </md-select>
      </md-field>
      <div style="margin: 20px">
        <md-datepicker v-model="from">
          <label>From</label>
        </md-datepicker>
      </div>
      <div style="margin: 20px">
        <md-datepicker v-model="to">
          <label>To</label>
        </md-datepicker>
      </div>
      <md-button class="md-raised md-primary" @click="createReport">Submit</md-button>
    </div>
    <div class="md-layout-item md-size-35"></div>
    <div class="md-layout-item md-size-20"></div>
    <div class="md-layout-item md-size-60" style="margin-top:30px">
      <md-table>
        <md-table-row>
          <md-table-head id="head">Amount</md-table-head>
          <md-table-head id="head">Count</md-table-head>
        </md-table-row>
        <md-table-row v-if="typeof data === 'string'">
          <md-content>{{data}}</md-content>
        </md-table-row>
        <md-table-row v-else>
          <md-table-cell>{{data.amount}}</md-table-cell>
          <md-table-cell>{{data.number}}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <div class="md-layout-item md-size-20"></div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { domain } from "../domain.js";
export default {
  data: () => ({
    report: null,
    data: [],
    errors: [],
    from: null,
    to: null
  }),
  methods: {
    createReport() {
      this.errors = [];
      if (this.report && this.from && this.to) {
        const from = moment(this.from).format("YYYY-MM-DD");
        const to = moment(this.to).format("YYYY-MM-DD");
        if (this.report === "deposits" || this.report === "withdrawals") {
          axios
            .get(`${domain}/api/report-date/${this.report}/${from}/${to}/`)
            .then(res => (this.data = res.data.data))
            .catch(err => console.log(err));
        } else {
          axios
            .get(`${domain}/api/${this.report}-date/${from}/${to}/`)
            .then(res => (this.data = res.data.data))
            .catch(err => console.log(err));
        }
      } else {
        this.errors.push("Please select type of report and date range");
      }
    }
  }
};
</script>

<style>
#head {
  text-align: center;
}
</style>
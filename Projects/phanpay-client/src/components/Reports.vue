<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-35"></div>
    <div class="md-layout-item md-size-30">
      <md-field style="margin-top:25px">
        <label for="report">Reports</label>
        <md-select v-model="report" name="report">
          <md-option value="deposit">Deposits</md-option>
          <md-option value="withdrawal">Withdrawals</md-option>
          <md-option value="transaction">Transaction History</md-option>
        </md-select>
      </md-field>
    </div>
    <div class="md-layout-item md-size-35"></div>
    <div class="md-layout-item md-size-20"></div>
    <div class="md-layout-item md-size-60">
      <md-table v-if="data.length">
        <md-table-row>
          <md-table-head id="head">Amount</md-table-head>
          <md-table-head id="head">Date</md-table-head>
          <md-table-head id="head">Event</md-table-head>
          <md-table-head id="head">From</md-table-head>
          <md-table-head id="head">To</md-table-head>
        </md-table-row>
        <md-table-row v-for="(val, index) in data" :key="index">
          <md-table-cell>{{val.amount}}</md-table-cell>
          <md-table-cell>{{val.date}}</md-table-cell>
          <md-table-cell>{{val.event}}</md-table-cell>
          <md-table-cell>{{val.from}}</md-table-cell>
          <md-table-cell>{{val.to}}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <div class="md-layout-item md-size-20"></div>
  </div>
</template>

<script>
import axios from "axios";
import { domain } from "../domain.js";
export default {
  data: () => ({
    report: null,
    data: [],
    errors: []
  }),
  watch: {
    report: {
      handler: function(val) {
        const usr_id = localStorage.getItem("id");
        axios
          .get(`${domain}/api/${val}-history/${usr_id}/`)
          .then(res => this.dataFiller(res.data.data))
          .catch(err => this.errorFiller(err.response.data.error));
      }
    }
  },
  methods: {
    dataFiller(data) {
      if (data.state) {
        this.data = data.state;
      } else {
        this.data = data;
      }
    },
    errorFiller(err) {
      console.log(err);
    }
  }
};
</script>

<style>
#head {
  text-align: center;
}
</style>

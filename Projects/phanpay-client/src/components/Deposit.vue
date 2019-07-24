<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-35"></div>
    <div class="md-layout-item md-size-30">
      <md-empty-state
        md-icon="account_balance_wallet"
        md-label="Make your first deposit"
        md-description="Making a deposit you are doing the right thing not only for you, but
        for all community as well."
      >
        <md-button @click="showDialog = true" class="md-primary md-raised">Make a Deposit Now</md-button>
      </md-empty-state>
      <md-dialog-prompt
        :md-active.sync="showDialog"
        v-model="amount"
        md-title="Deposit"
        md-content="*Amount Must be a Number"
        md-input-maxlength="6"
        md-input-placeholder="Amount"
        md-confirm-text="Make deposit"
      />
      <md-content class="md-accent" v-if="error">
        <div class="md-title">{{error}}</div>
      </md-content>
      <md-content class="md-primary" v-if="status" style="padding:25px">
        <div class="md-title">{{status}}</div>
      </md-content>
    </div>
    <div class="md-layout-item md-size-35"></div>
  </div>
</template>
<script>
import axios from "axios";
import { domain } from "../domain.js";
export default {
  data: () => ({
    showDialog: false,
    amount: null,
    error: null,
    status: null
  }),
  watch: {
    amount: {
      handler: function(val) {
        if (val) {
          val = parseInt(val);
          if (val <= 0) {
            this.errorSwither("Amount must be greater than zero");
          } else if (isNaN(val)) {
            this.errorSwither(
              "The amount must be a NUMBER, please don't use any other symbol"
            );
          } else {
            this.errorSwither(null);
            const usr_id = localStorage.getItem("id");
            axios
              .post(`${domain}/api/deposit-funds/${usr_id}/`, { amount: val })
              .then(() => this.makeDeposit("Deposit succesfully processed"))
              .catch(err => this.makeDeposit(err.response.data.error));
          }
        }
      }
    }
  },
  methods: {
    makeDeposit(state) {
      this.status = state;
    },
    errorSwither(val) {
      this.error = val;
    }
  }
};
</script>
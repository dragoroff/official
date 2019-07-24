<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-35"></div>
    <div class="md-layout-item md-size-30">
      <md-empty-state
        md-icon="eject"
        md-label="Think twice before asking withdrawal"
        md-description="The withdrawal operation can take up to 2 weeks, so be prepared to wait"
      >
        <md-button @click="showDialog = true" class="md-primary md-raised">Withdraw funds</md-button>
      </md-empty-state>
      <md-dialog-prompt
        :md-active.sync="showDialog"
        v-model="amount"
        md-title="Withdraw funds"
        md-content="*Amount Must be a Number"
        md-input-maxlength="6"
        md-input-placeholder="Amount"
        md-confirm-text="Withdraw"
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
              .post(`${domain}/api/withdrawal-funds/${usr_id}/`, {
                amount: val
              })
              .then(() =>
                this.makeWithdrawal(
                  "Withdrawal request successfully accepted, check current state in dashboard"
                )
              )
              .catch(err => this.makeWithdrawal(err.response.data.error));
          }
        }
      }
    }
  },
  methods: {
    makeWithdrawal(state) {
      this.status = state;
    },
    errorSwither(val) {
      this.error = val;
    }
  }
};
</script>
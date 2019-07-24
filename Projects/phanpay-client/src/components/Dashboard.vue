<template>
  <div>
    <div class="md-layout">
        <div class="md-size-20 md-layout-item"></div>
        <div class="md-size-30 md-layout-item" style="margin-top:65px">
          <md-card class="card-expansion">
            <md-card-media>
              <img src="../assets/payment2.webp" alt="payment">
            </md-card-media>
            <md-card-header>
              <div class="md-title">Transfer money to your friend</div>
            </md-card-header>
            <md-card-expand>
              <md-card-actions>
                <md-card-expand-trigger>
                  <md-button class="md-icon-button">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </md-button>
                </md-card-expand-trigger>
              </md-card-actions>
              <md-card-expand-content>
              <div v-if="!success">
                <form @submit.prevent="submitForm">
                    <md-card-content>
                    <p v-if="errors.length" style="color:red" >
                      <strong>Please correct the following error(s):</strong>
                      <ul>
                        <li id="error" v-for="error in errors" :key="error">{{ error }}</li>
                      </ul>
                    </p>
                    <md-field>
                      <label for="email">Recepient Email</label>
                      <md-input name="email" v-model="email" required></md-input>
                    </md-field>
                    <md-field>
                      <label for="amount">Amount</label>
                      <md-input name="amount" v-model="amount" required></md-input>
                    </md-field>
                    </md-card-content>
                    <md-card-actions>
                    <md-button type="submit" class="md-icon-button md-primary md-raised">
                      <md-icon>
                        send
                      </md-icon>
                    </md-button>
                    </md-card-actions>
                </form>
              </div>
              <div v-else>
                <h1 class="md-title" style="color:green">
                  Your transfer has been successfully received
                </h1>
              </div>
              </md-card-expand-content>
              </md-card-expand>
          </md-card>
        </div>
        <div class="md-layout md-size-30 md-layout-item" 
        :style="{'margin-top':'65px', 'margin-left':'60px'}">
          <div class="md-layout-item md-size-0"></div>
          <div class="md-layout-item md-size-60">
            <span class="md-title">Transaction history</span>
            <p v-if="typeof operations === 'string'">
              {{operations}}
            </p>
            <ul v-else style="list-style-type:none">
              <li v-for="(opr, index) in lastTen" :key="index" >
                <md-card 
                style="width:250px"
                :class="{'success': opr.event==='IncomingPayment' || opr.event==='DepositAccepted' || opr.event==='InitialDeposit' | opr.event==='WithdrawalAccepted'}">
                <strong>{{ opr.event }}</strong> <br>
                <div v-if="opr.event==='OperationDeclined'">
                  Reason: {{opr.data.Reason}}
                </div>
                <div v-else-if="opr.event==='FeesCharged' || opr.event === 'WithdrawalAccepted'">
                  from: {{opr.data.from}} <br>
                  amount: {{opr.data.amount}}
                </div>
                <div v-else>
                  amount: {{opr.data.amount}} <br>
                from: {{opr.data.from}} <br>
                to: {{opr.data.to}}
                </div>
                </md-card>
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import { domain } from "../domain.js";
export default {
  data: () => ({
    errors: [],
    operations: [],
    email: null,
    amount: null,
    usr_id: null,
    success: false,
  }),
  methods: {
    submitForm() {
      this.errors = [];
      const amount = parseInt(this.amount);
        if (amount <= 0){
          this.errors.push("Amount must be greater than zero");
        } else if (isNaN(amount)){
          this.errors.push("Amount must be a number");
        }
         else {
          const data = {
            data: {
              to: this.email,
              amount: amount
            }
          };
          axios
            .post(`${domain}/api/transfer-funds/${this.usr_id}/`, data)
            .then(res => this.success=true)
            .catch(err => this.errors.push(err.response.data.error));
        }
    }
  },
  created() {
    this.usr_id = localStorage.getItem("id");
  },
  computed: {
    lastTen: function(){
      if (typeof this.operations !== "string"){
        return this.operations.slice(-10).reverse()
      }
    }
  },
  mounted(){
    axios.get(`${domain}/api/current-history/${this.usr_id}`)
    .then(res => {
    this.operations = res.data.data;
    }
    )
    .catch(err => this.errors.push(err.response.data['error']))
  }
};
</script>
<style>
.custom-style {
  background-color: black !important;
  color: white !important;
}
#transfer {
  margin: 150px;
}
#name {
  text-transform: capitalize;
}
.success {
  background: lightgreen !important;
}
.link {
  cursor: pointer;
}
#error {
  list-style-type: none;
}

</style>

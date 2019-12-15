<template>
  <div class="main">
    <el-row>
      <el-col :md="12" :sm="24">
        <h1>{{getState.company}}</h1>
        <p class="lead">
          {{pageText.balance}}:
          <span
            class="text-success"
          >{{allData[0].balance}} {{getState.currency.dollar}}</span>
        </p>
      </el-col>
      <el-col :md="12" :sm="24">
        <div style="margin-top:20px;">
          <el-dropdown>
            <el-button type="primary">
              {{pageText.chooseCur}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <a @click="getInitData">
                <el-dropdown-item>{{pageText.settlementCur}}</el-dropdown-item>
              </a>
              <div v-for="i in currencies" :key="i">
                <a @click="filterCurrency(i)">
                  <el-dropdown-item>{{i}}</el-dropdown-item>
                </a>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :md="{span:14, offset: 4}" :sm="24">
        <p class="lead">{{pageText.titleForGraph}}</p>
        <el-card class="box-card">
          <canvas id="chart"></canvas>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { chartBuilder } from "../../helpers/chart-data.js";
import { chartCreate } from "../../helpers/chartCreator.js";
import { defaultText } from "../../mixins.js";
export default {
  mixins: [defaultText],
  data() {
    return {
      quantity: [],
      currencies: [],
      merchants: ["Total"],
      chart: null
    };
  },
  methods: {
    getAllResults() {
      const initData = this.$store.getters.getCurrencyFilt;
      this.quantity = initData.currencyFilt;
      if (this.currencies.length) {
        this.chart.data.datasets[0].data = this.quantity;
        this.chart.update();
      } else {
        this.currencies = initData.currencies;
        this.$store.dispatch("filterMerch");
        const data = this.$store.getters.getAllMerchants;
        data.map(x => {
          this.merchants.push(x.value);
        });
      }
    },
    filterCurrency(value) {
      this.$store.dispatch("currFilt", value);
      this.getAllResults();
    },
    getInitData() {
      this.$store.dispatch("clearCurrFilt");
      this.$store.dispatch("initCurrData");
      this.getAllResults();
    }
  },
  mounted() {
    const chart = chartBuilder(
      "bar",
      this.quantity,
      // ["Total", "Merchant1", "Merchant2", "Merchant3"],
      this.merchants,
      "Balance"
    );
    this.chart = chartCreate("chart", chart);
  },
  created() {
    this.getInitData();
  }
};
</script>

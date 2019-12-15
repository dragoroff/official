<template>
  <div class="balance">
    <el-row>
      <el-col :md="12" :sm="24">
        <h1>{{getState.company}}</h1>
        <p class="lead">
          {{pageText.balance}}:
          <span
            class="text-success"
          >{{allData[0].balance}} {{getState.currency.dollar}}</span>
        </p>
        <div v-if="width<765" style="margin-bottom:25px;">
          <router-link to="/dashboard/history">
            <el-button type="primary">{{pageText.history}}</el-button>
          </router-link>
        </div>
      </el-col>
      <el-col :md="6" :sm="24">
        <el-card class="box-card">
          <div
            slot="header"
            style="cursor: pointer;"
            @click="getTableData"
          >{{all}} {{pageText.merchants}}</div>
          <div v-for="(merch, index) in allMerchants" :key="index">
            <li @click="getMerchant(merch.value)">{{merch.value}}</li>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :md="12" :sm="24">
        <p class="lead">{{pageText.balance}}: {{balance}} {{getState.currency.dollar}}</p>
        <p class="lead">{{pageText.reserve}}: {{reserve}} {{getState.currency.dollar}}</p>
        <p class="lead">{{pageText.turnover}}: {{turnover}} {{getState.currency.dollar}}</p>
      </el-col>
    </el-row>
    <el-row>
      <my-table
        :prop="['name', 'date']"
        :label="['Name', 'Date']"
        :data="data"
        :sortable="[false, true]"
        :columns="2"
      ></my-table>
    </el-row>
    <div>
      <h1 class="lead">{{header}}</h1>
      <my-table
        :prop="['name', 'date']"
        :label="['Name', 'Date']"
        :data="data"
        :sortable="[false, true]"
        :columns="2"
      ></my-table>
    </div>
  </div>
</template>
<script>
import { defaultText, filterMerchants } from "../../mixins.js";
export default {
  props: ["width"],
  data() {
    return {
      header: "Fees",
      all: "All",
      data: [],
      balance: null,
      reserve: null,
      turnover: null
    };
  },
  mixins: [defaultText, filterMerchants],
  created() {
    this.getTableData();
  }
};
</script>

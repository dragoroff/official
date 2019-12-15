<template>
  <div class="trans">
    <el-row>
      <el-col :md="4" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">{{pageText.turnover}}</div>
          <div>{{this.turnover}}$</div>
        </el-card>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">{{pageText.declined}}</div>
          <div>$</div>
        </el-card>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">{{pageText.chargebacks}}</div>
          <div>{{getState.currency.dollar}}</div>
        </el-card>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">{{pageText.frauds}}</div>
          <div>{{getState.currency.dollar}}</div>
        </el-card>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">{{pageText.reversals}}</div>
          <div>{{getState.currency.dollar}}</div>
        </el-card>
      </el-col>
      <el-col :md="4" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">{{pageText.disputes}}</div>
          <div>{{getState.currency.dollar}}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="12" :md="20">
        <div class="block">
          <div style="margin-bottom:20px;">
            <el-button
              type="primary"
              @click="lastweek = !lastweek; dateRange=null; current=false"
            >{{pageText.button.lastWeek}}</el-button>
            <el-button
              type="primary"
              @click="current = !current; lastweek = false; dateRange=null;"
            >{{pageText.button.thisWeek}}</el-button>
            <el-button type="primary" @click="show = !show">{{pageText.button.custom}}</el-button>
            <el-button type="primary">Today</el-button>
            <el-button type="primary">Yesterday</el-button>
            <el-button type="primary">Last Month</el-button>
            <el-button type="primary">This Month</el-button>
          </div>
          <div v-if="show">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            ></el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :sm="12" :md="4">
        <el-dropdown>
          <el-button type="primary">
            {{pageText.merchants}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <a @click="getTableData">
              <el-dropdown-item>{{pageText.all}} {{pageText.merchants}}</el-dropdown-item>
            </a>
            <div v-for="(merch, index) in allMerchants" :key="index">
              <a @click="getMerchant(merch.value)">
                <el-dropdown-item>{{merch.value}}</el-dropdown-item>
              </a>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <my-table
        :data="getData"
        :prop="['address', 'date', 'name']"
        :label="['address', 'date', 'name']"
        :columns="3"
        :sortable="[false, true, true]"
      ></my-table>
    </el-row>
  </div>
</template>
<script>
import { defaultText, filterMerchants } from "../../mixins.js";
import { getDate } from "../../helpers/date.js";
export default {
  data() {
    return {
      dateRange: null,
      data: [],
      show: false,
      lastweek: false,
      current: false,
      turnover: null
    };
  },
  mixins: [defaultText, filterMerchants],
  computed: {
    getData() {
      return getDate(this.dateRange, this.data, this.lastweek, this.current);
    }
  },
  created() {
    this.data = this.allData[1].merchants;
    this.getTableData();
  }
};
</script>
<style scoped>
.block {
  margin-bottom: -20px;
}
@media (max-width: 765px) {
  .el-button {
    margin: 10px;
  }
  .el-dropdown {
    margin-top: 40px;
  }
}
</style>

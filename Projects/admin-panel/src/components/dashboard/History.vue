<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="10" style="margin-bottom: 20px;">
        <h2>{{getState.company}}</h2>
        <p class="lead">{{pageText.summary}}</p>
        <my-table
          :prop="['number', 'text']"
          :label="[null, null]"
          :data="data"
          :show-header="false"
          :sortable="[false, false]"
          :columns="2"
        ></my-table>
      </el-col>
      <el-col :sm="24" :md="14">
        <canvas id="doughnut" height="120"></canvas>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="24" :md="24">
        <my-table
          :prop="['address','date', 'name']"
          :label="['Address','Date', 'Name']"
          :data="allData[1].merchants"
          :sortable="[false, true, false]"
          :columns="3"
        ></my-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { defaultText } from "../../mixins.js";
import { chartBuilder } from "../../helpers/chart-data.js";
import { chartCreate } from "../../helpers/chartCreator.js";
import { specTableCreation } from "../../helpers/specTableCreation.js";
export default {
  data() {
    return {
      data: []
    };
  },
  mixins: [defaultText],
  methods: {
    createTable() {
      let arrayText = [
        "Total Settlement Account",
        "Total Paid Account",
        "Total Open Balance"
      ];
      return specTableCreation(arrayText, this.allData, this.data);
    }
  },
  mounted() {
    const chart = chartBuilder(
      "doughnut",
      [this.allData[0].paid, this.allData[0].open],
      ["paid", "open"]
    );
    chartCreate("doughnut", chart);
  },
  created() {
    this.createTable();
  }
};
</script>
<style scoped>
h2 {
  color: #6c757d;
  font-weight: 400;
}
</style>

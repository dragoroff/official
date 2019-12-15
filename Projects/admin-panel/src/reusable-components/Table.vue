<template>
  <div>
    <el-table :data="data" :columns="columns" :show-header="showHeader">
      <div v-for="(a, index) in columns" :key="index">
        <el-table-column :prop="prop[index]" :label="label[index]" :sortable="sortable[index]"></el-table-column>
      </div>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    prop: {
      type: Array,
      required: true
    },
    label: {
      type: Array,
      required: true
    },
    columns: {
      type: Number,
      required: true
    },
    sortable: {
      type: Array,
      default: () => []
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  }
};
</script>

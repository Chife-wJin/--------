<template>
  <el-table
    border
    :data="List"
    max-height="500"
    class="container-table"
    @selection-change="handleSelectionChange"
    ref="table"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="业务名称" prop="dataName"></el-table-column>
    <el-table-column label="数据类型" prop="dataType"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      required: true,
      type: Object,
      default: () => {},
    },
    node: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      List: [],
      output: [],
    };
  },
  methods: {
    // 表格复选框选择事件
    handleSelectionChange(val) {
      this.output = val;
    },
    // 获取表格数据
    setTableList() {
      this.$nextTick(() => {
        // 找出当前节点的两个入口节点, 将入口节点选中的字段拿过来
        const sourceList = [];
        this.data.lineList.forEach((item) => {
          if (item.to == this.node.nodeId) {
            sourceList.push(item.from);
          }
        });
        this.data.nodeList.forEach((item) => {
          if (sourceList.includes(item.nodeId)) {
            const list = [...item.output];
            this.List = this.List.concat(list);
          }
        });
      });
    },
    // 编辑时选中历史项
    setTableSelect() {
      this.$nextTick(() => {
        if (!this.node.output) {
          return false;
        }
        this.node.output.forEach((item) => {
          this.$refs["table"].toggleRowSelection(
            this.List.find((tx) => {
              return tx.dataName == item.dataName;
            }),
            true
          );
        });
      });
    },
  },
};
</script>

<style>
</style>
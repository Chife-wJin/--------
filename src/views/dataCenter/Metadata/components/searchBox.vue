<template>
  <div class="box">
    <el-dialog
      :title="title"
      :visible="true"
      v-if="true"
      width="500px"
      append-to-body
      :before-close="handleDialogClose"
    >
      <div class="search">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          size="small"
        >
        </el-input>
        <el-tree
          v-if="showType == 'contactpartyselect' || showType == 'cntProvider'"
          class="filter-tree"
          :data="data"
          :props="defaultProps1"
          default-expand-all
          node-key="id"
          :default-checked-keys="checkedKeys"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          ref="tree"
        >
        </el-tree>
        <el-tree
          v-else
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          :default-checked-keys="checkedKeys"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          ref="tree"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleDialogClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "SearchBox",
  data() {
    return {
      loading: true,
      filterText: "",
      defaultProps: {
        children: "childList",
        label: "name",
      },
      defaultProps1: {
        children: "children",
        label: "label",
      },
      checkedData: undefined,
      checkedKeys: [],
    };
  },

  props: {
    title: String,
    currentKey: String,
    data: Array,
    showType:String
  },
  created() {
    this.checkedKeys = [this.currentKey];
    console.log(this.data)
    console.log(this.showType)
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    // handleInput: function () {
    //   this.$emit("handleSearch");
    // },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleSubmit: function () {
      this.$emit("getCheckedData", this.checkedData);
    },
    handleNodeClick: function (data) {
      // console.log(data)
      this.checkedData = data;
    },
    handleDialogClose: function () {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  padding-top: 14px;
  overflow: auto;
  .el-input {
    margin-bottom: 14px;
  }
  .el-tree {
    height: 280px;
    overflow: auto;
  }
}
</style>

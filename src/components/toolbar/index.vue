<template>
  <div class="rightToolbar">
    <ul>
      <li @click="searchShow"><i class="el-icon-search"></i></li>
      <li @click="refresh"><i class="el-icon-refresh"></i></li>
      <li @click="drawer = true"><i class="el-icon-s-operation"></i></li>
    </ul>
    <el-drawer
      title="列显隐"
      size="35%"
      :visible.sync="drawer"
      :with-header="false"
    >
      <el-table border :data="tableData">
        <el-table-column prop="label" label="列名"> </el-table-column>
        <el-table-column label="隐藏">
          <template v-slot="scope">
            <input
              type="checkbox"
              class="el-checkbox__inner"
              @click="isHideChange(scope.row, $event)"
            />
          </template>
        </el-table-column>
        <el-table-column label="冻结">
          <template v-slot="scope">
            <input
              type="checkbox"
              class="el-checkbox__inner"
              @click="isFixedChange(scope.row, $event)"
            />
          </template>
        </el-table-column>
        <el-table-column label="筛选">
          <template v-slot="scope">
            <input
              type="checkbox"
              class="el-checkbox__inner"
              @click="isFilterChange(scope.row, $event)"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template v-slot="scope">
            <input
              type="checkbox"
              class="el-checkbox__inner"
              @click="isSortChange(scope.row, $event)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "Toolbar",
  props: ["tableData"],
  data() {
    return {
      toolbar: {
        isSearchShow: true,
        isRefresh: false,
        tableChange: [],
      },
      drawer: false,
    };
  },
  watch: {
    tableData: {
      handler(newV) {
        this.toolbar.tableChange = newV;
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    searchShow() {
      this.toolbar.isRefresh = false;
      this.toolbar.isSearchShow = !this.toolbar.isSearchShow;
      this.$emit("toolbarEvent", this.toolbar);
    },
    refresh() {
      this.toolbar.isRefresh = true;
      this.$emit("toolbarEvent", this.toolbar);
    },
    isHideChange(row, val) {
      this.toolbar.tableChange.find((item) => item.id == row.id).isHide =
        val.target.checked;
    },
    isFixedChange(row, val) {
      this.toolbar.tableChange.find((item) => item.id == row.id).isFixed =
        val.target.checked;
    },
    isSortChange(row, val) {
      this.toolbar.tableChange.find((item) => item.id == row.id).isSort =
        val.target.checked;
    },
    isFilterChange(row, val) {
      this.toolbar.tableChange.find((item) => item.id == row.id).isFilter =
        val.target.checked;
      this.$emit("toolbarEvent", this.toolbar);
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.el-checkbox__inner {
  border: solid 1px blue;
}
.rightToolbar {
  ul {
    display: flex;
    float: right;
    li {
      list-style: none;
      margin-left: 10px;
      width: 28px;
      height: 28px;
      border: 1px solid #dcdfe6;
      border-radius: 50%;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
      color: #606266;
    }
    li:hover {
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #c6e2ff;
    }
  }
}
</style>
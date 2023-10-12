<template>
  <div class="app-container list">
    <el-row :gutter="10" class="mb8 container-state">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>

      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      :data="tableData"
      v-loading="loading"
      class="container-table"
      style="width: 100%; margin-top: 10px; margin-bottom: 20px"
      row-key="id"
      :stripe="true"
      border
      default-expand-all
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column type="selection" />
      <el-table-column label="分类编码" width="180">
        <template slot-scope="scope">
          <a
            class="linStyle"
            style="padding-left: 20px"
            @click="handleView(scope.row)"
          >
            {{ scope.row.classifyCode }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="classifyName" label="分类名称" width="180">
      </el-table-column>
      <el-table-column prop="remarks" label="描述"></el-table-column>
      <el-table-column prop="name" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="delete-state-btn"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >添加下级资源目录明细</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getResourceDirectoryList } from "@/api/dataCenter/metaData.js";
import { deleteResourceDirectory } from "@/api/dataCenter/metaData.js";
export default {
  name: "List",
  data() {
    return {
      loading: true,
      tableData: [],
    };
  },
  props: {
    treeId: String,
  },
  created: function () {
    this.getList();
  },
  methods: {
    handleDelete(id) {
      this.$confirm("确认要删除该资源目录明细及所有子资源目录明细吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteResourceDirectory({ id }).then((reponse) => {
            if (reponse.code == 200) {
              this.$message({
                message: reponse.msg,
                type: "success",
              });
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },
    handleAdd: function (row) {
      this.$emit("changeCom", "new", "资源目录明细添加", row.id);
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "资源目录明细更新", row.id);
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "资源目录明细查看", row.id);
    },
    async getList() {
      this.loading = true;
      const reponse = await getResourceDirectoryList({
        parent: this.treeId,
      });
      this.tableData = reponse.data.length ? reponse.data : [];
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding-top: 10px !important;
}
a {
  color: rgb(64, 158, 255);
}

// ::v-deep .el-table .cell {
//   display: flex;
//   justify-content: center;
// }
// ::v-deep .sort-input .el-input__inner {
//   height: 28px;
//   text-align: center;
// }
// ::v-deep .el-table__expand-icon {
//   margin-right: -20px !important;
// }
// ::v-deep .el-table th.el-table__cell {
//   padding: 10px 0;
//   background-color: #f8f8f9 !important;
//   border-right: none;
// }
// ::v-deep .el-table th.el-table__cell > .cell {
//   border: none;
//   padding: 0 10px;
//   font-weight: 600;
//   color: #515a6e;
//   font-size: 13px;
// }
// ::v-deep .el-table .el-table__cell {
//   border-right: none !important;
// }
</style>
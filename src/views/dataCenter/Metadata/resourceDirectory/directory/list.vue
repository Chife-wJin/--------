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
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
    <el-table-column prop="classifyStandardName" label="资源目录名称"></el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          <a
            class="linStyle"
            style="padding-left: 20px"
            @click="handleView(scope.row)"
          >
            {{ scope.row.updateDate }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" >
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
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="params.pageNo"
      :limit.sync="params.pageSize"
      @pagination="getList"
      class="pull-right"
    />
  </div>
</template>
<script>
import { getResourceDirectoryList2,deleteResourceDirectory2 } from "@/api/dataCenter/metaData.js";
export default {
  name: "List",
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      params: {
        pageNo: 1,
        pageSize: 15,
      },
    };
  },
  created: function () {
    this.getList();
  },
  methods: {
    handleDelete(id) {
      this.$confirm("确认要删除该资源目录吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteResourceDirectory2({ id }).then((reponse) => {
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
    handleAdd: function () {
      this.$emit("changeCom", "new", "资源目录添加");
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "资源目录更新", row.id);
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "资源目录查看", row.id);
    },
    async getList() {
      this.loading = true;
      const reponse = await getResourceDirectoryList2(this.params);
      this.tableData = reponse.data.count ? reponse.data.list : [];
      this.total = reponse.data.count;
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
<template>
  <div class="app-container list">
    <el-row :gutter="10" class="mb8 container-state">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-back"
          size="mini"
          @click="back"
          >返回列表</el-button
        >
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
      <el-table-column label="名称" width="120">
        <template slot-scope="scope">
          <a
            class="linStyle"
            style="padding-left: 20px"
            @click="handleView(scope.row)"
          >
            {{ scope.row.name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="tmetaElement.definitions" label="定义" width="180">
      </el-table-column>
      <el-table-column
        prop="tmetaElement.dataType"
        label="数据类型"
         width="180"
      ></el-table-column>
      <el-table-column
        prop="tmetaElement.dataDomain"
        label="值域"
         width="180"
      ></el-table-column>
      <el-table-column prop="name" label="操作" min-width="300" fixed="right">
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
            @click="handleAddChild(scope.row)"
            >添加下级元数据模板明细</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  getTemplateDetailList,
  deleteTemplateDetail,
} from "@/api/dataCenter/metaData.js";
export default {
  name: "List",
  data() {
    return {
      tableData: [],
    };
  },
  props: {
    tMetaTemplate: String,
    treeId: String,
  },
  created: function () {
    this.getList();
  },
  methods: {
    back: function () {
      this.$emit("back");
    },
    async getList() {
      const reponse = await getTemplateDetailList({
        tMetaTemplate: this.tMetaTemplate,
        parent:this.treeId,
      });

      this.tableData = reponse.data.length ? reponse.data : [];
      this.loading = false;
    },
    handleAdd: function () {
      this.$emit("changeCom", "new", "元数据模板明细添加",);
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "元数据模板明细修改", row.id);
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "元数据模板明细查看", row.id);
    },
    handleAddChild: function (row) {
      this.$emit("changeCom", "next", "下级元数据模板明细添加", row.id);
    },
    handleDelete(id) {
      this.$confirm("是否要删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTemplateDetail({ id }).then((reponse) => {
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
::v-deep .el-table .cell {
  display: flex;
  justify-content: center;
}
::v-deep .sort-input .el-input__inner {
  height: 28px;
  text-align: center;
}
::v-deep .el-table__expand-icon {
  margin-right: -20px !important;
}
::v-deep .el-table th.el-table__cell {
  padding: 10px 0;
  background-color: #f8f8f9 !important;
  border-right: none;
}
::v-deep .el-table th.el-table__cell > .cell {
  border: none;
  padding: 0 10px;
  font-weight: 600;
  color: #515a6e;
  font-size: 13px;
}
::v-deep .el-table .el-table__cell {
  border-right: none !important;
}
</style>
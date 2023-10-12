<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="params"
      ref="queryForm"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="中文名称:" prop="company">
        <el-input
          v-model="params.cname"
          size="small"
          placeholder="输入搜索关键词"
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item label="英文名称:" prop="company">
        <el-input
          v-model="params.ename"
          size="small"
          placeholder="输入搜索关键词"
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item label="短名:" prop="company">
        <el-input
          v-model="params.sname"
          size="small"
          placeholder="输入搜索关键词"
          style="width: 180px"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" type="primary"
          plain
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8 container-state"
      ><el-col :span="1.5">
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
    <div class="information-body">
      <el-table
        :data="tableData"
        class="container-table"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :stripe="true"
        v-loading="loading"
        border
        default-expand-all
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="中文名称">
          <template slot-scope="scope">
            <a
              class="linStyle"
              style="padding-left: 20px"
              @click="handleView(scope.row)"
            >
              {{ scope.row.cname }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="definitions" label="定义">
        </el-table-column>
        <el-table-column prop="ename" label="英文名称">
        </el-table-column>
        <el-table-column prop="constraints" label="约束条件">
          <template slot-scope="scope">
            <div v-if="scope.row.constraints == 'M'">必选</div>
            <div v-else-if="scope.row.constraints == 'O'">可选</div>
            <div v-else-if="scope.row.constraints == 'C'">条件必选</div>
          </template>
        </el-table-column>
        <el-table-column prop="sname" label="短名">
        </el-table-column
        ><el-table-column prop="frequency" label="频次">
        </el-table-column
        ><el-table-column prop="dataType" label="数据类型">
        </el-table-column>
        <el-table-column prop="dataDomain" label="值域">
        </el-table-column
        ><el-table-column prop="dataRemarks" label="备注">
        </el-table-column
        ><el-table-column prop="showType" label="显示表单类型" >
        </el-table-column
        ><el-table-column prop="dictType" label="字典类型">
        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="100" fixed="right">
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
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="params.pageNo"
      :limit.sync="params.pageSize"
      @pagination="getList"
      class="pull-right"
    /> -->
  </div>
</template>
<script>
import { getElementList, deleteElement } from "@/api/dataCenter/metaData.js";
export default {
  name: "List",
  data() {
    return {
      tableData: [],
      loading: true,
      total: 0,
      params: {
        cname: "",
        ename: "",
        sname: "",
        pageNo: 1,
        pageSize: 15,
      },
    };
  },
  created: function () {
    this.getList();
  },
  methods: {
    handleQuery() {
      this.params.pageNo = 1;
      this.getList();
    },
    resetQuery() {
      for (let i in this.params) {
        if (!["pageNo", "pageSize"].includes(i)) {
          this.$set(this.params, i, undefined);
        }
      }
      this.handleQuery();
    },
    handleDelete(row) {
      this.$confirm("是否要删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteElement({ id:row.id }).then((reponse) => {
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
    async getList() {
      this.loading = true;
      const reponse = await getElementList(this.params);
      console.log(reponse)
      this.tableData = reponse.data ? reponse.data : [];
      // this.total = reponse.data.count;
      this.loading = false;
    },
    handleAdd: function () {
      this.$emit("changeCom", "new", "元数据元素添加");
      
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "元数据元素修改", row.id);
     
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "元数据元素查看", row.id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
.ellipsis {
  @include textOmit;
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
.container-state {
  padding-bottom: 10px;
}
</style>
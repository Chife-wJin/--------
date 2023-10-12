<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="params"
      ref="queryForm"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="服务名称:" prop="apiServicename">
        <el-input
          v-model="params.apiServicename"
          size="small"
          placeholder="输入服务名称"
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务url:" prop="apiServiceurl">
        <el-input
          v-model="params.apiServiceurl"
          size="small"
          placeholder="输入服务url"
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
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="clear"
          type="primary"
          plain
          >重置</el-button
        >
      </el-form-item>
    </el-form>
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

    </el-row>
    <div class="information-body">
      <el-table
        :data="tableData"
        v-loading="loading"
        row-key="id"
        :stripe="true"
        border
        class="container-table" 
      >
        <el-table-column label="服务名称" >
          <template slot-scope="scope">
            <a
              class="linStyle"
              style="padding-left: 20px"
              @click="handleView(scope.row)"
            >
              {{ scope.row.apiServicename }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="apiServiceurl" label="服务url" >
        </el-table-column>
        <el-table-column prop="apiServiceprice" label="数据源" >
        </el-table-column>
        ><el-table-column prop="apiServiceprice" label="备注" >
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
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
              icon="el-icon-edit-outline"
              @click="handleWrite(scope.row)"
              >编写文档</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleSee(scope.row)"
              >查看文档</el-button
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
import {
  serviceList,
  apiServiceDocDelete
 } from "@/api/dataCenter/dataShare.js";
export default {
  name: "List",
  data() {
    return {
      tableData: [],
      total: 0,
      params: {
        pageNo: 1,
        pageSize: 15,
      },
      loading: true,
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
    clear(){
      this.params = {
        pageNo: 1,
        pageSize: 15,
      },
      this.getList();
    },
    handleDelete(row) {
      this.$confirm("是否要删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apiServiceDocDelete({ id:row.id }).then((reponse) => {
            //console.log(reponse)
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
      const reponse = await serviceList(this.params);
      //console.log(reponse)
      // this.tableData = reponse.data.count ? reponse.data.list : [];
      this.tableData = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    handleAdd: function () {
      this.$emit("changeCom", "new", "添加");
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "修改", row.id);
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "查看", row.id);
    },
    handleSee(row){
      this.$emit("docSee", "see", "查看文档", row.id);
    },
    handleWrite(row){
      this.$emit("docWirite", "write", "编写文档", row.id);
    }
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


.container-state {
  padding-bottom: 10px;
}
</style>
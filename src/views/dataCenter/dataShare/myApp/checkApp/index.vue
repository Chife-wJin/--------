<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="params"
      ref="queryForm"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="应用名称:" prop="apiAppName">
        <el-input
          v-model="params.apiAppName"
          size="small"
          placeholder="输入应用名称"
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名称:" prop="apiUsername">
        <el-input
          v-model="params.apiUsername"
          size="small"
          placeholder="输入服务用户名称"
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
        <el-table-column label="应用编号" >
          <template slot-scope="scope">
            <a
              class="linStyle"
              style="padding-left: 20px"
              @click="handleView(scope.row)"
            >
              {{ scope.row.id }}
            </a>
          </template>
          
        </el-table-column>
        <el-table-column prop="apiAppName" label="应用名称" >
        </el-table-column>
        <el-table-column prop="createDate" label="更新时间" >
        </el-table-column>
        ><el-table-column prop="remarks" label="备注" >
        </el-table-column
        ><el-table-column prop="apiAppIsapprove_text" label="审批状态" >
        </el-table-column
        ><el-table-column prop="apiUserid" label="用户编号" >
        </el-table-column
        ><el-table-column prop="apiUsername" label="用户名称" >
        </el-table-column
        >
        <el-table-column label="操作" min-width="100">
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
        <el-table-column label="访问统计" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-data"
              @click="handleDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column
        >
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
    <el-dialog
      :title="title"
      v-if="isShowAlert"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><New :type="type" :id="id" @hidden="hidden" @goBack="goBack" :apiAppService="apiAppService"
    /></el-dialog>
    <el-dialog
      :title="title"
      v-if="isShowAlertDetail"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><Detail :id="id" @goBack="goBack"
    /></el-dialog>
    <el-dialog
      :title="titleMenu"
      v-if="isShowAlertView"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><CheckMenu :id="id" @goBack="goBack" :apiAppService="apiAppService"
    /></el-dialog>
  </div>
</template>

<script>
import {
  apiAppList,
  apiAppDelete
 } from "@/api/dataCenter/dataShare.js";
import New from "./new.vue";
import Detail from "./detailCheck.vue";
import CheckMenu from "../components/checkMenu.vue"
export default {
  name: "CheckApp",
  data() {
    return {
      isShowAlert: false,
      isShowAlertDetail:false,
      isShowAlertView:false,
      type: "",
      id: "",
      apiAppService:"",
      visible:true,
      title:"",
      titleMenu:"",
      params: {
        pageNo: 1,
        pageSize: 15,
      },
      tableData: [],
      total: 0,
      loading: true,
    };
  },
  components: {
    New,
    Detail,
    CheckMenu
  },
created: function () {
    this.getList();
  },
  methods: {
     async getList() {
      this.loading = true;
      const reponse = await apiAppList(this.params);
      console.log(reponse)
      this.tableData = reponse.data.count ? reponse.data.list : [];
      this.tableData.map(item => {
        item.apiAppIsapprove === '1' ? (item.apiAppIsapprove_text = '通过') : item.apiAppIsapprove === "2" ? (item.apiAppIsapprove_text = '未通过') : (item.apiAppIsapprove_text = '未审核')
     })
      this.total = reponse.data.count;
      this.loading = false;
    },
    handleEdit(row){
      console.log(row)
      this.title = "修改应用";
      this.type = "edit"
      this.isShowAlert = true;
      this.id = row.id
      this.apiAppService = row.apiAppService
    },
    handleView(row){
      this.titleMenu = "查看应用";
      this.isShowAlertView = true;
      this.id = row.id
      this.apiAppService = row.apiAppService
    },
    handleAdd(){
      this.title = "新增应用";
      this.isShowAlert = true;
      this.type = "new"
    },
    handleDelete(row) {
      this.$confirm("是否要删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apiAppDelete({ id:row.id }).then((reponse) => {
            if (reponse.code == 200) {
              this.getList();
            }
          });
        })
        .catch((err) => err);
    },
    handleDetail(row){
      //console.log(row.id)
      this.title = "查看菜单";
      this.isShowAlertDetail = true;
      this.id = row.id
    },
    hidden(){
      this.isShowAlert = false
      this.getList();
    },
    handleQuery(){
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
    handleDialogClose: function () {
      this.isShowAlert = false;
      this.isShowAlertDetail = false;
      this.isShowAlertView = false
    },
    goBack(){
      this.isShowAlertDetail = false;
      this.isShowAlert = false
      this.isShowAlertView = false
    }
  },
};
</script>

<style lang="scss" scoped>
.information-body{margin-top: 10px;}
.linStyle{ color: #409EFF;}
</style>
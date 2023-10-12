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
    <div class="information-body">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%;"
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
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="pass(scope.row)"
              >审批通过</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="noPass(scope.row)"
              >不通过</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="assign(scope.row)"
              >分配</el-button
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
    <el-dialog
      :title="titleMenu"
      v-if="isShowAlertView"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><CheckMenu :id="id"
    /></el-dialog>
    <el-dialog
      :title="title"
      v-if="isShowAlertNoPass"
      :before-close="handleDialogClose"
      :visible="visible"
      width="500px"
      append-to-body
      ><NoPass :id="id"  @hidden="hidden"
    /></el-dialog>
    <el-dialog
      title="分配菜单"
      v-if="isShowAlertAssign"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><Assign :id="id" @hidden="hidden"
    /></el-dialog>
  </div>
</template>

<script>
import {
  approvelist,
  doapprove
 } from "@/api/dataCenter/dataShare.js";
 import CheckMenu from "../components/checkMenu.vue"
import NoPass from "../components/noPass.vue"
import Assign from "../components/assignMenu.vue"
export default {
  name: "appPendingReview",
  data() {
    return {
      isShowAlertAssign: false,
      isShowAlertNoPass:false,
      isShowAlertView:false,
      type: "",
      id: "",
      serviceId:"",
      userName:"",
      visible:true,
      title:"",
      params: {
        pageNo: 1,
        pageSize: 15,
      },
      tableData: [],
      total: 0,
      loading:true
    };
  },
  components: {
    CheckMenu,
    NoPass,
    Assign
  },
created: function () {
    this.getList();
  },
  methods: {
     async getList() {
       console.log(this.params)
       this.loading = true;
       const reponse = await approvelist(this.params);
       console.log(reponse)
      this.tableData = reponse.data.count ? reponse.data.list : [];
      this.tableData.map(item => {
      item.apiAppIsapprove === '1' ? (item.apiAppIsapprove_text = '通过') : item.apiAppIsapprove === "2" ? (item.apiAppIsapprove_text = '未通过') : (item.apiAppIsapprove_text = '未审核')
     })
      this.total = reponse.data.count;
      this.loading = false;
    },

     handleView(row){
      this.titleMenu = "查看应用";
      this.isShowAlertView = true;
      this.id = row.id
    },
    pass(row){
      console.log(row.id)
      this.$confirm("确认要审核通过该应用并且生成token吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          doapprove({ id:row.id }).then((reponse) => {
            // console.log(reponse)
            if (reponse.code == 200) {
              console.log(reponse)
              this.getList();
            }
          });
        })
        .catch((err) => err);
    },
    noPass(row){
      this.isShowAlertNoPass = true;
      this.id = row.id
    },
    assign(row){
      this.isShowAlertAssign = true
      this.id = row.id
    },
    handleQuery(){
      this.params.pageNo = 1;
      this.getList();
    },
    hidden(){
      this.isShowAlertNoPass = false
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
      this.isShowAlertAssign = false;
      this.isShowAlertView = false
      this.isShowAlertNoPass = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.information-body{margin-top: 10px;}
.linStyle{ color: #409EFF;}
</style>
<template>
  <div class="app-container">
      <el-form
          class="search-body"
          :model="queryParams"
          :inline="true"
          label-width="150px"
        >
        <el-form-item label="调用的服务接口URL:" prop="apiServiceurl">
            <el-input 
            v-model="queryParams.apiServiceurl" 
            size="small" 
            style="width: 180px"
            placeholder="输入调用的服务接口URL"
            ></el-input>
        </el-form-item>
        <el-form-item label="调用人:" prop="apiUsername">
            <el-input 
            v-model="queryParams.apiServicename" 
            size="small" 
            style="width: 180px"
            placeholder="输入调用人"
            ></el-input>
        </el-form-item>
        <el-form-item label="开始调用时间:" prop="beginCreateDate">
            <el-date-picker
             style="width: 180px"
              v-model="queryParams.beginCreateDate"
              type="date"
              size="small"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="选择开始时间">
            </el-date-picker>
        </el-form-item>
        
        <el-form-item label="结束调用时间:" prop="endCreateDate">
            <el-date-picker
             style="width: 180px"
              v-model="queryParams.endCreateDate"
              type="date"
              size="small"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="选择结束时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="clear"
              type="primary"
              plain>重置</el-button
            >
        </el-form-item>
      </el-form>
      <div>
        <el-table
         v-loading="loading"
         border 
         class="container-table"
          :data="List">
          <el-table-column type="index"
           width="50" label="序号">
            <template
             slot-scope="scope">
              {{
              (queryParams.pageNo - 1) * queryParams.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="apiServiceurl" label="调用的服务接口">
             <template slot-scope="scope">
            <a
              class="linStyle"
              style="padding-left: 20px"
              @click="handleView(scope.row)"
            >
              {{ scope.row.apiServiceurl }}
            </a>
          </template>
          </el-table-column>
          <el-table-column prop="apiServiceprice" label="数据源" ></el-table-column>
          <el-table-column prop="apiUsername" label="调用人" ></el-table-column>
          <el-table-column prop="createDate" label="调用时间" ></el-table-column>
        </el-table>
      </div>
    <pagination
      v-show="total>0"
      :total="total"
      :pageNo.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
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
      ><LogView :id="id"
    /></el-dialog>
  </div>
</template>

<script>
import {
  getApiLogList
} from "@/api/dataCenter/dataShare"
import LogView from "./logView.vue";
export default {
  name: 'checkService',
  data(){
    return {
        queryParams: {
        pageNo: 1,
        pageSize: 15,
        apiUsername: "",
        apiServiceurl: "",
        beginCreateDate:"",
        endCreateDate:""
      },
        total: 1,
        loading: true,
        List: [],
        isShowAlert:false,
        visible:true,
        title:"查看日志"
        
    }
  },
  components: {
    LogView
  },

  created(){
      this.getList();
  },

  methods:{
    async getList() {
      this.loading = true;
      const reponse = await getApiLogList(this.queryParams);
      console.log(reponse)
      this.List = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    clear(){
      this.queryParams = {
        pageNo: 1,
        pageSize: 15,
      },
      this.getList();
    },
    handleView(row){
        this.id = row.id
        this.isShowAlert = true
    },
    handleDialogClose: function () {
      this.isShowAlert = false;
    },
   
    
  },
}
</script>
<style lang='scss' scoped>
.interface-manage .delete-state-btn {
    color: #fb3636;
}
.linStyle{ color: #409eff;}
.title{ 
    display: flex; 
    justify-content: space-between;
    background: #dcebfa;
    line-height: 30px;
    padding: 5px 10px;
    margin-bottom: 20px;
    div::before{
        content: '';
        display: inline-block;
        width: 5px;
        height: 20px;
        background:#409EFF;
        position: relative;
        top:5px; 
        margin-right: 10px;
    }
}
</style>
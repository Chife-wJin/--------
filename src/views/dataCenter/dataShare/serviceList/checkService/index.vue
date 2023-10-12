<template>
  <div class="app-container">
      <el-form
          class="search-body"
          :model="queryParams"
          :inline="true"
          label-width="100px"
        >
        <el-form-item label="服务名称" prop="apiServicename">
            <el-input 
            v-model="queryParams.apiServicename" 
            size="small" 
            style="width: 180px"
            placeholder="输入服务名称"
            ></el-input>
        </el-form-item>
        <el-form-item label="服务url" prop="apiServiceurl">
            <el-input 
            v-model="queryParams.apiServiceurl" 
            size="small" 
            style="width: 180px"
            placeholder="输入服务url"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button 
            type="primary" 
            icon="el-icon-search" 
            size="mini" 
            @click="handleQuery">搜索</el-button>
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
        row-key="id"
        :stripe="true"
        border
        class="container-table" 
        :data="List">
          <el-table-column type="index" width="50" label="序号">
            <template slot-scope="scope">
              {{
              (queryParams.pageNo - 1) * queryParams.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="apiServicename" label="服务名称"></el-table-column>
          <el-table-column prop="apiServiceurl" label="服务url" ></el-table-column>
          <el-table-column prop="createDate" label="更新时间" ></el-table-column>
          <el-table-column prop="apiServiceprice" label="数据源" ></el-table-column>
          <el-table-column prop="couValue" label="操作" min-width="80">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleSee(scope.row)"
                >查看文档</el-button
                >
            </template>
          </el-table-column>
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
      :title="titleSee"
      v-if="isShowAlertSee"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><DocSee  :idSee="id" @goBack="goBack"
    /></el-dialog>
  </div>
</template>

<script>
import {
  serviceList
} from "@/api/dataCenter/dataShare"
import DocSee from "../serviceManagement/docSee.vue";
export default {
  name: 'checkService',
  data(){
    return {
        queryParams: {
        pageNo: 1,
        pageSize: 15,
        apiServicename: '',
        apiServiceurl: ''
      },
        total: 1,
        loading: true,
        List: [],
        titleSee:"查看文档",
        isShowAlertSee:false,
        id:"",
        visible:true
        
    }
  },
 components: {
    DocSee
  },
  created(){
      this.getList();
  },

  methods:{
    async getList() {
      this.loading = true;
      const reponse = await serviceList(this.queryParams);
      //console.log(reponse)
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
    handleSee(row){
      console.log(row)
      this.id = row.id
      this.isShowAlertSee = true      
    },
    handleDialogClose() {
      this.isShowAlertSee = false;
    },
    goBack(){
      this.isShowAlertSee = false;
    }

  },
}
</script>
<style lang='scss' scoped>
.interface-manage .delete-state-btn {
    color: #fb3636;
}
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
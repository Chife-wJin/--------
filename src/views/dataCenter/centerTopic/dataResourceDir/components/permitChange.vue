<template>
  <div class="app-container">
      <el-form
          class="search-body"
          :model="queryParams"
          :inline="true"
          label-width="80px"
        >
        <!-- <el-form-item label="编码:" prop="code">
            <el-input 
            v-model="queryParams.code" 
            size="small" 
            style="width: 180px"
            placeholder="输入编码"
            ></el-input>
        </el-form-item> -->
        <el-form-item label="行业类别:" prop="industry">
            <el-input 
            v-model="queryParams.industry" 
            size="small" 
            style="width: 180px"
            placeholder="输入行业类别"
            ></el-input>
        </el-form-item>
        <el-form-item label="单位名称:" prop="name">
            <el-input 
            v-model="queryParams.name" 
            size="small" 
            style="width: 180px"
            placeholder="单位名称"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
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
        <el-table v-loading="loading" border class="container-table" :data="List">
          <el-table-column type="index" width="50" label="序号">
            <template slot-scope="scope">
              {{
              (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="province" label="省份"></el-table-column>
          <el-table-column prop="city" label="城市"></el-table-column>
          <!-- <el-table-column prop="djbh" label="编码"></el-table-column> -->
          <el-table-column prop="hylb" label="行业类别" ></el-table-column>
          <el-table-column prop="dwmc" label="单位名称" ></el-table-column>
          <el-table-column prop="xdsj" label="限定时间" ></el-table-column>
          <el-table-column prop="yxqx" label="时间" ></el-table-column>
        </el-table>
      </div>
    <pagination
      v-show="total>0"
      :total="total"
      :pageNo.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      class="pull-right"
    />

  </div>
</template>

<script>
import {
  permitRectification
} from "@/api/dataCenter/centerTopic";
export default {
  name: 'unitinformation',
  data(){
    return {
        queryParams: {
        pageNum: 1,
        pageSize: 15,
       // code:undefined,
        industry:undefined,
        name:undefined
      },
        total: 1,
        loading: true,   
        List:[]     
    }
  },

  created(){
      this.getList();
  },

  methods:{
    async getList() {
      this.loading = true;
      const reponse = await permitRectification(this.queryParams);
      console.log(reponse)
      this.List = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    clear(){
      this.queryParams = {
        pageNum: 1,
        pageSize: 15,
      },
      this.getList();
    },
    
  },
}
</script>
<style lang='scss' scoped>
.linStyle{ color: #409eff;}

</style>
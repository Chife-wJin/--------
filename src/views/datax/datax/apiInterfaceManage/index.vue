<template>
  <div class="app-container">
      <el-form
          class="search-body"
          :model="queryParams"
          :inline="true"
          label-width="78px"
        >

        <el-form-item label="名称:" prop="name">
        <el-input v-model="queryParams.name" placeholder="名称" style="width: 180px;" />
      </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryAir">查询</el-button>
            <el-button
          type="primary"
          plain
          icon="el-icon-search"
          size="small"
          @click="resetHandle"
          >重置</el-button
        >
        </el-form-item>
        
      </el-form>
      <div>
        <el-table v-loading="loading" border class="container-table" :data="List">
          <el-table-column type="index" width="55" label="序号">
            <template slot-scope="scope">
              {{
              (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="apiName" label="API名称"></el-table-column>
          <el-table-column prop="apiEncoded" label="API编码" ></el-table-column>
          <el-table-column prop="url" label="访问路径" ></el-table-column>
          <el-table-column prop="requestType" label="请求方式" ></el-table-column>
          <el-table-column prop="accept" label="输入数据格式" ></el-table-column>
          <el-table-column prop="contentType" label="输出数据格式" ></el-table-column>
          <el-table-column prop="body" label="请求参数"></el-table-column>
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
  apiModelPage
} from "@/api/datax/datax-api-manage"
import{  _dateFormat } from "@/utils/dateFormat"
export default {
  name: 'WqzhhjglptUIIndex',
  data(){
    return {
        queryParams: {
        pageNum: 1,
        pageSize: 15,
        name:""
      },
        total: 1,
        loading: true,
        List: [],
    }
  },
  filters: {
    _dateFormat (time) {
      let date = new Date(time)
      return _dateFormat(date, 'yyyy-MM-dd hh:mm')
    }
  },
  created(){
      this.getList();
  },
  methods:{  
    async getList() {
      this.loading = true;
      const reponse = await apiModelPage(this.queryParams)
      console.log(reponse)
      this.List = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
    },
    handleQueryAir() {
      this.queryParams.pageNum = 1;
      this.getList();      
    },
    resetHandle(){
      this.queryParams.pageNum = 1,
      this.pageSize = 15,
      this.queryParams.name = "",
      this.getList();
    }
  },
}
</script>
<style lang='scss' scoped>
.search-body .el-checkbox{
  margin-right: 0; 
  margin-left: 15px;
}
.search-body{
  overflow: hidden;
}
.cascader{ 
    padding: 5px 20px; 
    display:inline-block;
}

</style>
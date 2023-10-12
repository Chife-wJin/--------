<template>
  <div class="app-container">
      <el-form
          class="search-body"
          :model="queryParams"
          :inline="true"
          label-width="80px"
        >
         <el-form-item label="时间:">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="dateChange">
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
        <el-table v-loading="loading" border class="container-table" :data="List">
          <el-table-column type="index" width="50" label="序号">
            <template slot-scope="scope">
              {{
              (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期" ></el-table-column>
          <el-table-column prop="gpcjl" label="挂牌成交量"></el-table-column>
          <el-table-column prop="gpcje" label="挂牌成交额"></el-table-column>
          <el-table-column prop="jrkpj" label="今日开盘价" ></el-table-column>
          <el-table-column prop="jrzgj" label="今日最高价" ></el-table-column>
          <el-table-column prop="jrzdj" label="今日最低价" ></el-table-column>
          <el-table-column prop="jrspj" label="今日收盘价" ></el-table-column>
          <el-table-column prop="spjzf" label="收盘价涨幅" ></el-table-column>
          <el-table-column prop="dzjyl" label="大宗交易量" ></el-table-column>
          <el-table-column prop="dzcje" label="大宗成交额" ></el-table-column>
          <el-table-column prop="pecjl" label="配额成交量" ></el-table-column>
          <el-table-column prop="pecje" label="配额成交额" ></el-table-column>
          <el-table-column prop="leijiPecjl" label="累计配额成交量" ></el-table-column>
          <el-table-column prop="leijiPecje" label="累计配额成交额" ></el-table-column>
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
  carbonTradingVolume
} from "@/api/dataCenter/centerTopic";
export default {
  name: 'unitinformation',
  data(){
    return {
      value1:"",
        queryParams: {
            pageNum: 1,
            pageSize: 15,
            startDate:"",
            endDate:"",
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
      const reponse = await carbonTradingVolume(this.queryParams);
      console.log(reponse)
      this.List = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
    },
    dateChange(){
      if(this.value1){
      this.queryParams.startDate = this.value1[0]
      this.queryParams.endDate = this.value1[1]
      console.log(this.queryParams)
      }
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
      this.value1 = "",
      this.getList();
    },
    
  },
}
</script>
<style lang='scss' scoped>
.linStyle{ color: #409eff;}
::v-deep .el-range-separator {
    width: 28px;
  }
</style>
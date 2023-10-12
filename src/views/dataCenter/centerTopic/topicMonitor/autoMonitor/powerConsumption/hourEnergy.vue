<template>
  <div>
    <el-form
      class="search-body"
      :model="queryParams"
      :inline="true"
      label-width="78px"
    >
      <el-form-item label="企业名称:" prop="enterpriseId">
        <el-select
          v-model="queryParams.enterpriseId"
          size="small"
          style="width: 250px"
          placeholder="请选择企业"
        >
          <el-option 
          v-for="(v,i) in enterpriseList" 
          :key="i" :value="v.id" 
          :label="v.name">
          </el-option>
        </el-select>
      </el-form-item>
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
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
          >查询</el-button
        >
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
      <el-table
        v-loading="loading"
        border
        class="container-table"
        :data="ListData"
      >
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNo - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" width="200"></el-table-column>
        <el-table-column prop="outputEnergy" label="产污用电量"></el-table-column>
        <el-table-column prop="treatmentEnergy" label="治污用电量"></el-table-column>
        <el-table-column prop="totalEnergy" label="全部用电量(产污+治污)" width="200"></el-table-column>
        <el-table-column prop="totalPower" label="总功率（产污+治污）" width="200"></el-table-column>
        <el-table-column prop="treatmentPower" label="治污"></el-table-column>
        <el-table-column prop="outputPower" label="产污"></el-table-column>
        <el-table-column prop="date" label="数据时间"></el-table-column>
        <el-table-column prop="hour" label="小时"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="productionLoad" label="生产负荷"></el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getListData"
      class="pull-right"
    />
  </div>
</template>

<script>
import {ecmEnterpriseList,ecmEnterpriseHourEnergyPage } from "@/api/dataCenter/centerTopic";
import { _dateFormat } from "@/utils/dateFormat";
export default {
  name: "hourEnergy",
  data() {
    return {
      value1:"",
      queryParams: {
        pageNo: 1,
        pageSize: 15,
        enterpriseId: "",
        startDate: "",
        endDate: "",
      },
      total: 1,
      loading: true,
      ListData: [],
      enterpriseList:[],
    };
  },

  filters: {
    _dateFormat(time) {
      let date = new Date(time);
      return _dateFormat(date, "yyyy-MM-dd hh:mm");
    },
  },

  created() {
    this.getListData();
    this.getEcmEnterpriseList()
  },
  methods: {
    async getListData() {
      this.loading = true;
      // console.log(this.queryParams)
      const reponse = await ecmEnterpriseHourEnergyPage(this.queryParams);
      //  console.log(reponse);
      this.ListData = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
    },
    async getEcmEnterpriseList() {
      const reponse = await ecmEnterpriseList();
      // console.log(reponse);
      this.enterpriseList = reponse.data;
    },
    dateChange(){
      if(this.value1){
      this.queryParams.startDate = this.value1[0]
      this.queryParams.endDate = this.value1[1]
      console.log(this.queryParams)
      }
    },
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getListData();
    },
    resetHandle(){
      this.queryParams.pageNo = 1,
      this.pageSize = 15,
      this.queryParams.enterpriseId = "",
      this.queryParams.startDate = "",
      this.queryParams.endDate = "",
      this.value1 = "",
      this.getListData();
    }
  },
};
</script>
<style lang='scss' scoped>
.search-body .el-checkbox {
  margin-right: 0;
  margin-left: 15px;
}
.search-body {
  overflow: hidden;
}
.cascader {
  padding: 5px 20px;
  display: inline-block;
}
::v-deep .el-range-separator { width: 28px;}
</style>
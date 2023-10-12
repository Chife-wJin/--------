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
          @change="selectChanged"
        >
          <el-option 
          v-for="(v,i) in enterpriseList" 
          :key="i" :value="v.id" 
          :label="v.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产设施监测点:" prop="pointId" label-width="130px">
        <el-select
          v-model="queryParams.pointId"
          size="small"
          style="width: 180px"
          placeholder="生产设施监测点"
        >
          <el-option
            v-for="(item,i) in EcmPollutantOutputPointListData"
            :key="i"
            :label="item.name"
            :value="item.id"
          ></el-option>
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
        <el-table-column type="index" width="55" label="序号" fixed>
          <template slot-scope="scope">
            {{
              (queryParams.pageNo - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" width="200"></el-table-column>
        <el-table-column prop="pointName" label="监测点" width="180"></el-table-column>
        <el-table-column prop="sampDatetime" label="采集时间" width="90"></el-table-column>
         <el-table-column prop="rcvDatetime" label="接收时间" width="90"></el-table-column>
        <el-table-column prop="insertDatetime" label="入库时间" width="90"></el-table-column>
        <el-table-column prop="ia" label="a相电流"></el-table-column>
        <el-table-column prop="ib" label="b相电流"></el-table-column>
        <el-table-column prop="ic" label="c相电流"></el-table-column>
        <el-table-column prop="ua" label="a相电压"></el-table-column>
        <el-table-column prop="ub" label="b相电压"></el-table-column>
        <el-table-column prop="uc" label="c相电压"></el-table-column>
        <el-table-column prop="activePower" label="总有功功率" width="100"></el-table-column>
        <el-table-column prop="activeEnergy" label="总正向有功电能" width="150"></el-table-column>
        <el-table-column prop="runState_text" label="被测设备运行状态"  width="150"></el-table-column>
        <el-table-column prop="flag_text" label="参见gb17版表8"  width="150"></el-table-column>
        <el-table-column prop="isParsed_text" label="该条数据是否已被报警模块读取分析过"  width="280"></el-table-column>
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
import {ecmEnterpriseList,ecmPollutantOutputPointList,ecmHisdatPollutantOutputPage } from "@/api/dataCenter/centerTopic";
import { _dateFormat } from "@/utils/dateFormat";
export default {
  name: "productData",
  data() {
    return {
      value1:"",
      queryParams: {
        pageNo: 1,
        pageSize: 15,
        enterpriseId: "",
        pointId: "",
        startDate: "",
        endDate: "",
      },
      total: 1,
      loading: true,
      ListData: [],
      enterpriseList:[],
      EcmPollutantOutputPointListData:[]
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
      const reponse = await ecmHisdatPollutantOutputPage(this.queryParams);
      console.log(reponse);
      this.ListData = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
      this.ListData.map(item => {
        item.runState == '1' ? (item.runState_text = '运行') : (item.runState_text = '停运')
        item.isParsed == '1' ? (item.isParsed_text = '已分析') : (item.isParsed_text = '未分析')
        item.flag == 'N' ? (item.flag_text = '数据可信') : (item.isParsed_text = '数据不可信')
     })
    },
     async getEcmEnterpriseList() {
      const reponse = await ecmEnterpriseList();
      // console.log(reponse);
      this.enterpriseList = reponse.data;
    },
    selectChanged(value){
      ecmPollutantOutputPointList({enterpriseId:value}).then((res) => {
        // console.log(res);
        this.EcmPollutantOutputPointListData = res.data
      })
    },
    dateChange(){
      if(this.value1){
      this.queryParams.startDate = this.value1[0]
      this.queryParams.endDate = this.value1[1]
      // console.log(this.queryParams)
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
      this.queryParams.pointId = "",
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
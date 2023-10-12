<template>
  <div>
    <el-form
      class="search-body"
      :model="queryParams"
      :inline="true"
      label-width="78px"
    >
      <el-form-item label="企业名称:" prop="enterpriseCode">
        <el-select
          v-model="queryParams.enterpriseCode"
          size="small"
          style="width: 250px"
          placeholder="请选择企业"
          @change="change"
        >
          <el-option 
          v-for="(v,i) in enterpriseList" 
          :key="i" :value="v.enterpriseCode" 
          :label="v.enterpriseName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站点名称:" prop="stationId">
        <el-select
          v-model="queryParams.stationId"
          size="small"
          style="width: 250px"
          placeholder="请选择站点"
        >
          <el-option 
          v-for="(v,i) in stationList" 
          :key="i" :value="v.stationId" 
          :label="v.stationName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间:" prop="timeType">
        <el-select
          v-model="queryParams.timeType"
          size="small"
          style="width: 180px"
          placeholder="请选择维度"
        >
          <el-option label="日" value="1"></el-option>
          <el-option label="时" value="2"></el-option>
          <el-option label="分" value="3"></el-option>
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
          @click="handleQueryWater"
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
    <div v-if="gasDayIsShow">
      <el-table
        v-loading="loading"
        border
        class="container-table"
        :data="ListData"
      >
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" width="200"></el-table-column>
         <el-table-column prop="stationName" label="站点名称" width="150"></el-table-column>
        <el-table-column prop="itemName" label="污染物名称"></el-table-column>
        <el-table-column prop="avgVal" label="日均实测值"></el-table-column>
        <el-table-column prop="maxVal" label="日最大实测值"></el-table-column>
        <el-table-column prop="minVal" label="日最小实测值"></el-table-column>
        <el-table-column prop="avgCvtval" label="日均折算值"></el-table-column>
        <el-table-column prop="maxCvtval" label="日最大折算值"></el-table-column>
        <el-table-column prop="minCvtval" label="日最小折算值"></el-table-column>
        <el-table-column prop="pfl" label="排放量"></el-table-column>
        <el-table-column prop="editTime" label="更新时间" width="150"></el-table-column>
      </el-table>
    </div>
    <div v-if="waterDayIsShow">
      <el-table
        v-loading="loading"
        border
        class="container-table"
        :data="ListData"
      >
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" width="230"></el-table-column>
         <el-table-column prop="stationName" label="站点名称" width="200"></el-table-column>
        <el-table-column prop="itemName" label="污染物名称"></el-table-column>
        <el-table-column prop="avgVal" label="日均实测值"></el-table-column>
        <el-table-column prop="maxVal" label="日最大实测值"></el-table-column>
        <el-table-column prop="minVal" label="日最小实测值"></el-table-column>
        <el-table-column prop="pfl" label="排放量"></el-table-column>
        <el-table-column prop="editTime" label="更新时间" width="150"></el-table-column>
      </el-table>
    </div>
    <div v-if="otherIsShow">
       <el-table
        v-loading="loading"
        border
        class="container-table"
        :data="ListData"
      >
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" width="230"></el-table-column>
         <el-table-column prop="stationName" label="站点名称" width="200"></el-table-column>
        <el-table-column prop="itemName" label="污染物名称"></el-table-column>
        <el-table-column prop="orgval" label="原始值"></el-table-column>
        <el-table-column prop="val" label="实测值"></el-table-column>
        <el-table-column prop="orgcvtval" label="原始折算值"></el-table-column>
        <el-table-column prop="cvtval" label="折算值"></el-table-column>
        <el-table-column prop="qcode" label="数据质量"></el-table-column>
        <el-table-column prop="pfl" label="排放量"></el-table-column>
        <el-table-column prop="editTime" label="更新时间" width="150"></el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getListData"
      class="pull-right"
    />
  </div>
</template>

<script>
import { t3cList,t3centerpriseList,t3cSubstationList } from "@/api/dataCenter/centerTopic";
import { _dateFormat } from "@/utils/dateFormat";
export default {
  name: "waterSx",
  data() {
    return {
      value1:"",
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        type: 1,
        enterpriseCode: "",
        stationId:"",
        timeType: "3",
        startDate: "",
        endDate: "",
      },
      total: 1,
      loading: true,
      ListData: [],
      enterpriseList:[],
      stationList:[],
      gasDayIsShow:true,
      waterDayIsShow:false,
      otherIsShow:false,
    };
  },
  props: {
    type:Number
  },
  filters: {
    _dateFormat(time) {
      let date = new Date(time);
      return _dateFormat(date, "yyyy-MM-dd hh:mm");
    },
  },
 async created() {
    this.queryParams.type = this.type
    await this.getT3centerpriseList()
    this.getListData();
    this.show()
  },
  methods: {
    async getListData() {
      this.loading = true;
      console.log(this.queryParams)
      const reponse = await t3cList(this.queryParams);
      console.log(reponse);
      this.ListData = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
    },
    //获取企业列表
    async getT3centerpriseList() {
      const reponse = await t3centerpriseList({type:this.queryParams.type});
      // console.log(reponse);
      this.enterpriseList = reponse.data;
      this.queryParams.enterpriseCode = reponse.data[0].enterpriseCode
      this.morenT3cSubstationList()
      // console.log(reponse.data[0].enterpriseCode)
    },

    // 默认站点
    morenT3cSubstationList(){
     t3cSubstationList({enterpriseCode:this.queryParams.enterpriseCode}).then(res =>{
        this.stationList = res.data
        this.queryParams.stationId = res.data[0].stationId
      })
    },

    //获取站点列表
  getT3cSubstationList(){
     t3cSubstationList({enterpriseCode:this.queryParams.enterpriseCode}).then(res =>{
        console.log(res)
        this.stationList = res.data

      })
  },
  change(){
    this.queryParams.stationId = ""
    this.getT3cSubstationList()
  },

    show(){
       if(this.queryParams.type == 1 && this.queryParams.timeType == "1"){
          this.gasDayIsShow = true;
          this.waterDayIsShow = false;
          this.otherIsShow = false
        }
        if(this.queryParams.type == 2 && this.queryParams.timeType == "1"){
          this.waterDayIsShow = true;
          this.gasDayIsShow = false;
          this.otherIsShow = false;
        }
        if(this.queryParams.timeType !== "1" && (this.queryParams.type == 1 || this.queryParams.type == 2)){
          this.otherIsShow = true;
          this.waterDayIsShow = false;
          this.gasDayIsShow = false;
        }
        },
     dateChange(){
      if(this.value1){
      this.queryParams.startDate = this.value1[0]
      this.queryParams.endDate = this.value1[1]
      console.log(this.queryParams)
      }
    },
    handleQueryWater() {
      this.queryParams.pageNum = 1;
      this.getListData();
      this.show()
    },
    resetHandle(){
      this.queryParams.pageNum = 1,
      this.pageSize = 15,
      this.queryParams.type = this.type,
      this.queryParams.timeType = "1"
      this.queryParams.enterpriseCode = "",
      this.queryParams.stationId = "",
      this.queryParams.startDate = "",
      this.queryParams.endDate = "",
      this.value1 = "",
      this.getListData();
      this.show()
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
::v-deep .el-range-separator {
    width: 28px;
  }
</style>
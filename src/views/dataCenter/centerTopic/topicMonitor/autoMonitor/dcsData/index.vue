<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="queryParams"
      :inline="true"
    >
        <el-form-item label="所属单位：" style="margin-right:30px">
            <treeselect
              v-model="queryParams.parentId"
              :options="officeListData"
              :disableBranchNodes="false"
              :normalizer="normalizer"
              noChildrenText="无"
              @close="deptClose"
              placeholder="请选择所属单位"
            />
          </el-form-item>
          <el-form-item label="模型分类:" prop="metricId" style="margin-right:30px">
        <el-select
          v-model="queryParams.metricId"
          style="width: 250px"
          placeholder="请选择模型"
        >
          <el-option
          v-for="(v,i) in modelList"
          :key="i" :value="v.id"
          :label="v.modelName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间:" style="width:420px">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
  
        <el-table v-loading="loading" border class="container-table" :data="ListData">
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNo - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="officeId" label="所属单位"></el-table-column>
        <el-table-column prop="modelName" label="模型名称"></el-table-column>
        <el-table-column prop="metricId" label="点位名称"></el-table-column>
        <el-table-column prop="metricValue" label="数值"></el-table-column>
        <el-table-column prop="createdTime" label="时间"></el-table-column>
      </el-table>
    

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
import {dcsPlcMetricList,dcsPlcDataPage } from "@/api/dataCenter/centerTopic";
import { officeList } from "@/api/styem/dept";
import { _dateFormat } from "@/utils/dateFormat";
export default {
  name: "WqzhhjglptUiIndex",
  data() {
    return {
      value1:"",
      queryParams: {
        pageNo: 1,
        pageSize: 15,
        metricId: "",
        startDate: "",
        endDate: "",
        parentId: undefined
      },
      total: 1,
      loading: true,
      officeListData:[],
      ListData: [],
      modelList:[],
      normalizer(node) {
        return {
          label: node.name,
        };
      },
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
    this.getOfficeList();
  },
  methods: {
    deptClose(companyId) {
      console.log(companyId)
      if (companyId == undefined) {
        this.modelList = [];
        return;
      }
      this.getmodelList(companyId);
    },
    //获取企业列表
    async getOfficeList() {
      const reponse = await officeList();
      const menu = this.handleTree(
        reponse.data,
        "id",
        "parentId",
        "children",
        "0"
      );
      this.officeListData = menu;
    },
    //获取列表数据
    async getListData() {
      this.loading = true;
      const reponse = await dcsPlcDataPage(this.queryParams);
       console.log(reponse);
      this.ListData = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
    },
    //获取模型列表
    async getmodelList(val) {
      const reponse = await dcsPlcMetricList({componyId:val});
      console.log(reponse);
      this.modelList = reponse.data;
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
      this.queryParams.metricId = "",
      this.queryParams.parentId = "",
      this.queryParams.startDate = "",
      this.queryParams.endDate = ""
      this.value1 = "",
      this.getListData();
    }
  },
};
</script>
<style lang='scss' scoped>
::v-deep .el-form-item__content {width: 250px;}
::v-deep .el-range-separator { width: 28px;}
</style>
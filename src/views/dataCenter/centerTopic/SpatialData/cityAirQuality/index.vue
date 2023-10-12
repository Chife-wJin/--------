<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="queryParams"
      :inline="true"
      label-width="78px"
    >
      <el-form-item label="查询时间:" prop="dataTime">
        <el-date-picker
          v-model="queryParams.dataTime"
          type="date"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择时间"
        >
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
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        
        <el-table-column prop="cityName" label="城市名称" width="150"></el-table-column>
        <el-table-column prop="dataTime" label="日期"></el-table-column>
        <el-table-column prop="co" label="CO"></el-table-column>        
        <el-table-column prop="no2" label="NO2"></el-table-column>
        <el-table-column prop="o3" label="O3"></el-table-column>
        <el-table-column prop="pm10" label="PM10"></el-table-column>
        <el-table-column prop="pm25" label="PM2.5"></el-table-column>
        <el-table-column prop="so2" label="SO2"></el-table-column>
        <el-table-column prop="aqi" label="AQI" width="200"></el-table-column>
         <el-table-column prop="levelIndex" label="空气质量"></el-table-column>
         
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
import { cnemcAqiPage } from "@/api/dataCenter/centerTopic";
export default {
    name: 'WqzhhjglptUIIndex',
    data() {
        return {
        queryParams: {
            pageNum: 1,
            pageSize: 15,
            type:0,
            dataTime:""
        },
        total: 1,
        loading: true,
        ListData:[],

        };
    },

    created() { 
    this.getListData()
  },

    methods: {
      async getListData() {
        this.loading = true;
        const reponse = await cnemcAqiPage(this.queryParams);
        console.log(reponse);
        this.ListData = reponse.data.records;
        this.total = reponse.data.total;
        this.loading = false;
      },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getListData();
    },
    resetHandle(){
      this.queryParams.pageNum = 1,
      this.pageSize = 15,
      this.type = 0,
      this.queryParams.dataTime = ""
      this.getListData();
    }
    },
};
</script>

<style lang="scss" scoped>

</style>
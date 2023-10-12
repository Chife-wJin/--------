<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="queryParams"
      :inline="true"
      label-width="78px"
    >
      <el-form-item label="查询时间:" prop="tm">
        <el-date-picker
          v-model="queryParams.tm"
          type="date"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyyMMdd"
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
        <el-table-column prop="tm" label="时间" width="150"></el-table-column>
        <el-table-column prop="week" label="星期"></el-table-column>
        <el-table-column prop="city" label="城市名称" width="200"></el-table-column>
        <el-table-column prop="weather" label="天气"></el-table-column>
        <el-table-column prop="" label="最高温度">
          <template slot-scope="scope">
            {{scope.row.max}}℃
          </template>
        </el-table-column>
        <el-table-column prop="" label="最低温度">
          <template slot-scope="scope">
            {{scope.row.min}}℃
          </template>
        </el-table-column>
        <el-table-column prop="aqi" label="AQI"></el-table-column>
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
import { WeatherDay } from "@/api/dataCenter/centerTopic";
export default {
  name: "weatherData",
  data() {
    return {
     queryParams: {
        pageNum: 1,
        pageSize: 15,
        tm:""
      },
      total: 1,
      loading: true,
      ListData:[]
    };
  },
  created() { 
    this.getListData()
  },
  methods: {
    async getListData() {
      this.loading = true;
      const reponse = await WeatherDay(this.queryParams);
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
      this.queryParams.tm = ""
      this.getListData();
    }
  }
};
</script>

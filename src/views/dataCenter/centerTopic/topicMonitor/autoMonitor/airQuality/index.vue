<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="小时数据" name="first">
        <div>
          <el-form
            class="search-body"
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="78px"
          >
            <el-form-item label="站点名称:" prop="devsiteName">
              <el-input
                v-model="queryParams.devsiteName"
                size="small"
              ></el-input>
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
                @change="dateChange"
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
          <el-table
            v-loading="loading"
            border
            class="container-table"
            :data="List"
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
            <el-table-column
              prop="devsiteName"
              label="站点名称"
            ></el-table-column>
            <el-table-column prop="qcDatetime" label="时间" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.qcDatetime | _dateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="pm25" label="PM2.5"></el-table-column>
            <el-table-column prop="pm10" label="PM10"></el-table-column>
            <el-table-column prop="so2" label="SO2"></el-table-column>
            <el-table-column prop="co" label="CO"></el-table-column>
            <el-table-column prop="no2" label="NO2"></el-table-column>
            <el-table-column prop="o3" label="O3"></el-table-column>
            <el-table-column prop="tvoc" label="TVOC"></el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :pageNo.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
            class="pull-right"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="分钟数据" name="second">
        <div>
          <el-form
            class="search-body"
            :model="queryParamsMinu"
            ref="queryForm"
            :inline="true"
            label-width="78px"
          >
            <el-form-item label="站点名称:" prop="devsiteName">
              <el-input
                v-model="queryParamsMinu.devsiteName"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="时间:">
              <el-date-picker
                v-model="value2"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="dateChangeMinu"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleQueryMinu"
                >查询</el-button
              >
              <el-button
                type="primary"
                plain
                icon="el-icon-search"
                size="small"
                @click="resetHandleMinu"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            v-loading="loading"
            border
            class="container-table"
            :data="ListMinu"
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
            <el-table-column
              prop="devsiteName"
              label="站点名称"
            ></el-table-column>
            <el-table-column prop="qcDatetime" label="时间" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.qcDatetime | _dateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="pm25" label="PM2.5"></el-table-column>
            <el-table-column prop="pm10" label="PM10"></el-table-column>
            <el-table-column prop="so2" label="SO2"></el-table-column>
            <el-table-column prop="co" label="CO"></el-table-column>
            <el-table-column prop="no2" label="NO2"></el-table-column>
            <el-table-column prop="o3" label="O3"></el-table-column>
            <el-table-column prop="tvoc" label="TVOC"></el-table-column>
          </el-table>
          <pagination
            v-show="totalMinu > 0"
            :total="totalMinu"
            :pageNo.sync="queryParamsMinu.pageNo"
            :limit.sync="queryParamsMinu.pageSize"
            @pagination="getListMinu"
            class="pull-right"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { aqTableList, wzAirQualityMinPage,wzNameList } from "@/api/dataCenter/centerTopic";
import { _dateFormat } from "@/utils/dateFormat";

export default {
  name: "airQuality",
  data() {
    return {
      value1: "",
       value2: "",
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        devsiteName: "",
        startDate: "",
        endDate: "",
      },
      queryParamsMinu: {
        pageNo: 1,
        pageSize: 15,
        devsiteName: "",
        startDate: "",
        endDate: "",
      },
      total: 1,
      totalMinu: 1,
      loading: true,
      List: [],
      ListMinu:[],
      wzList: [],
      activeName: "first",
    };
  },
  filters: {
    _dateFormat(time) {
      let date = new Date(time);
      return _dateFormat(date, "yyyy-MM-dd hh:mm");
    },
  },
  created() {
    this.getList();
    this.getListMinu()
    //this.weizhanNameList()
  },
  methods: {
    async getList() {
      this.loading = true;
      const reponse = await aqTableList(this.queryParams);
      // console.log(reponse)
      this.List = reponse.data.records;
      this.total = reponse.data.total;
      this.loading = false;
    },
    async getListMinu() {
      this.loading = true;
      const reponse = await wzAirQualityMinPage(this.queryParamsMinu);
      console.log(reponse)
      this.ListMinu = reponse.data.records;
      this.totalMinu = reponse.data.total;
      this.loading = false;
    },

    
    // async weizhanNameList() {
    //   const reponse = await wzNameList();
    //   console.log(reponse)
    //   //this.wzList = reponse.data.list;
    // },
    dateChange() {
      if (this.value1) {
        this.queryParams.startDate = this.value1[0];
        this.queryParams.endDate = this.value1[1];
        console.log(this.queryParams);
      }
    },
    dateChangeMinu(){
      this.queryParamsMinu.startDate = this.value2[0];
      this.queryParamsMinu.endDate = this.value2[1];
      console.log(this.queryParamsMinu);
    },

    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleQueryMinu() {
      this.queryParamsMinu.pageNo = 1;
      this.getListMinu();
    },
    resetHandle() {
      this.queryParams.pageNum = 1,
      this.queryParams.pageSize = 15,
      this.queryParams.devsiteName = "",
      this.queryParams.startDate = "",
      this.queryParams.endDate = "",
      this.value1 = "";
      this.getList();
    },
    resetHandleMinu() {
      this.queryParamsMinu.pageNo = 1,
      this.queryParamsMinu.pageSize = 15,
      this.queryParamsMinu.devsiteName = "";
      this.queryParamsMinu.startDate = "",
      this.queryParamsMinu.endDate = ""
      this.value2 = "";
      this.getListMinu();
    },
  },
};
</script>

<style lang='scss' scoped>
::v-deep .el-range-separator {
  width: 28px;
}
</style>
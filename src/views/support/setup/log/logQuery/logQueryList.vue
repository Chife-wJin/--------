<template>
  <div class="app-container">
    <div class="box-body" v-show="showSearch">
      <el-form
        :model="geoCategoryParams"
        :inline="true"
        class="query-form"
        v-elResize
      >
        <el-form-item label="操作菜单：">
          <el-input
            placeholder="请输入操作菜单"
            v-model="geoCategoryParams.title"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="日志类型：">
          <el-select
            v-model="geoCategoryParams.type"
            placeholder="请选择日志类型"
            size="small"
          >
            <el-option label="全部" value="" size="small"></el-option>
            <el-option
              v-for="item in logTypeData"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求地址：">
          <el-input
            placeholder="请输入请求地址"
            v-model="geoCategoryParams.requestUri"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="日志时间：">
          <el-date-picker
            v-model="issueDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="issueDateChange"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            style="margin-left: 20px"
            v-model="geoCategoryParams.exception"
            >只查询异常信息</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
          >
            查询
          </el-button>
          <el-button
            size="small"
            icon="el-icon-refresh"
            @click="resetQuery"
            plain
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="10" class="mb10">
      <el-col :span="1.5" style="padding-left: 0">
        <el-button
          type="primary"
          plain
          icon="el-icon-s-marketing"
          size="small"
          @click="seeShow"
          >统计图表</el-button
        >
      </el-col>
      <Toolbar @toolbarEvent="toolbarEvent" :tableData="tableData"></Toolbar>
    </el-row>
    <el-table
      :data="spaceTableData"
      v-loading="loading"
      style="width: 100%"
      :stripe="true"
      :max-height="pageHeight - 270"
    >
      <el-table-column
        prop="title"
        min-width="200"
        :show-overflow-tooltip="true"
        label="操作菜单"
        v-if="!tableData[0].isHide"
        :fixed="tableData[0].isFixed"
        :sortable="tableData[0].isSort"
      >
      </el-table-column>
      <el-table-column
        prop="createName"
        label="操作用户"
        v-if="!tableData[1].isHide"
        :fixed="tableData[1].isFixed"
        :sortable="tableData[1].isSort"
      ></el-table-column>
      <el-table-column
        label="类型"
        v-if="!tableData[2].isHide"
        :fixed="tableData[2].isFixed"
        :sortable="tableData[2].isSort"
      >
        <template slot-scope="scope">
          {{ typeChange(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="params"
        :show-overflow-tooltip="true"
        label="参数"
        v-if="!tableData[3].isHide"
        :fixed="tableData[3].isFixed"
        :sortable="tableData[3].isSort"
      ></el-table-column>
      <el-table-column
        prop="requestUri"
        :show-overflow-tooltip="true"
        label="请求地址"
        v-if="!tableData[4].isHide"
        :fixed="tableData[4].isFixed"
        :sortable="tableData[4].isSort"
      ></el-table-column>
      <el-table-column
        prop="exception"
        label="异常信息"
        :show-overflow-tooltip="true"
        v-if="!tableData[5].isHide"
        :fixed="tableData[5].isFixed"
        :sortable="tableData[5].isSort"
      ></el-table-column>
      <el-table-column
        prop="remoteAddr"
        label="操作者IP"
        :show-overflow-tooltip="true"
        v-if="!tableData[6].isHide"
        :fixed="tableData[6].isFixed"
        :sortable="tableData[6].isSort"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="操作时间"
        :show-overflow-tooltip="true"
        v-if="!tableData[7].isHide"
        :fixed="tableData[7].isFixed"
        :sortable="tableData[7].isSort"
      ></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="geoCategoryParams.pageNo"
      :limit.sync="geoCategoryParams.pageSize"
      @pagination="getLogList"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { logList } from "@/api/styem/log";
import Toolbar from "@/components/toolbar/index.vue";
export default {
  components: { Toolbar },
  data() {
    return {
      loading: true,
      spaceTableData: [
        { text: 1, value: 1 },
        { text: 2, value: 2 },
      ],
      total: 0,
      showSearch: true,
      columns: [1, 2, 3, 4],
      column: [],
      tableData: [
        {
          id: 0,
          label: "操作菜单",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 1,
          label: "操作用户",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 2,
          label: "类型",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 3,
          label: "参数",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 4,
          label: "请求地址",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 5,
          label: "异常信息",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 6,
          label: "操作者IP",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 7,
          label: "操作时间",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
      ],
      logTypeData: [
        { value: "LOGIN", name: "登录" },
        { value: "INSERT", name: "添加" },
        { value: "UPDATE", name: "更新" },
        { value: "DELETE", name: "删除" },
        { value: "QUERY", name: "查询" },
        { value: "PERMS", name: "权限修改" },
        { value: "ERROR", name: "错误日志" },
        { value: "OTHER", name: "其他" },
      ],
      geoCategoryParams: {
        pageNo: 1,
        pageSize: 10,
        title: undefined,
        type: undefined,
        requestUri: undefined,
        beginDate: undefined,
        endDate: undefined,
        exception: undefined,
      },
      issueDate: undefined,
    };
  },
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getLogList();
    this.createTime();
    this.resetQuery();
  },
  activated() {
    this.resetQuery();
  },
  methods: {
    createTime() {
      const end = new Date();
      const nowMonth = end.getMonth(); //当前月
      const nowYear = end.getFullYear(); //当前年
      const monthStartDate = new Date(nowYear, nowMonth, 1);
      const monthEndDate = new Date(nowYear, nowMonth + 1, 0);
      this.issueDate = [monthStartDate, monthEndDate];
      this.geoCategoryParams.beginDate = this.format(
        monthStartDate,
        "yyyy-MM-dd"
      ); //yyyy-MM-dd hh:mm:ss
      this.geoCategoryParams.endDate = this.format(monthEndDate, "yyyy-MM-dd");
    },
    async getLogList() {
      this.loading = true;
      const reponse = await logList(this.geoCategoryParams);
      this.spaceTableData = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    handleQuery() {
      if (this.geoCategoryParams.exception === true) {
        this.geoCategoryParams.exception = 1;
      } else {
        this.geoCategoryParams.exception = undefined;
      }
      this.geoCategoryParams.pageNo = 1;
      this.getLogList();
    },
    resetQuery() {
      this.geoCategoryParams.pageNo = 1;
      this.geoCategoryParams.title = undefined;
      this.geoCategoryParams.type = undefined;
      this.geoCategoryParams.requestUri = undefined;
      this.geoCategoryParams.beginDate = undefined;
      this.geoCategoryParams.endDate = undefined;
      this.geoCategoryParams.exception = undefined;
      this.issueDate = undefined;
      this.getLogList();
    },
    typeChange(val) {
      if (val === "LOGIN") {
        return "登录";
      } else if (val === "INSERT") {
        return "添加";
      }
      if (val === "UPDATE") {
        return "更新";
      }
      if (val === "DELETE") {
        return "删除";
      }
      if (val === "QUERY") {
        return "查询";
      }
      if (val === "PERMS") {
        return "权限修改";
      }
      if (val === "ERROR") {
        return "错误日志";
      } else {
        return "其他";
      }
    },
    issueDateChange(picker) {
      if (picker == null) {
        this.geoCategoryParams.beginDate = undefined;
        this.geoCategoryParams.endDate = undefined;
      } else {
        this.geoCategoryParams.beginDate = picker[0];
        this.geoCategoryParams.endDate = picker[1];
      }
    },
    seeShow() {
      this.$emit("handleSee", true);
    },
    toolbarEvent(toolbar) {
      if (toolbar.isRefresh == true) {
        this.getLogList();
      }
      this.showSearch = toolbar.isSearchShow;
      // this.tableData = toolbar.tableChange;
      this.tableData.forEach((item, index) => {
        if (item.isFilter) {
          // let a = item.label
          console.log(item.label);
          // this.$refs[item.label].setAttribute(":filters",this.column)
          // this.$refs[item.label].setAttribute(":filters-method",this.filterHandler)
          // console.log(this.$refs[item.label]);
        }
      });
      // :filters="tableData[0].isFilter?'column':false"
      // :filter-method="tableData[0].isFilter?'filterHandler':false"
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__icon {
  line-height: 24px !important;
}
/deep/.el-table th.el-table__cell {
  padding: 10px 0;
  background-color: #f8f8f9 !important;
  border-right: none;
}
/deep/.el-table th.el-table__cell > .cell {
  border: none;
  padding: 0 10px;
  font-weight: 600;
  color: #515a6e;
  font-size: 13px;
}
/deep/.el-table .el-table__cell {
  border-right: none !important;
}
.mb10 {
  margin-bottom: 8px;
}
</style>

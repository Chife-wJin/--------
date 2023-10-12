<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="formParams"
      ref="queryForm"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="评估时间:" prop="datePicker">
        <el-date-picker
          v-model="formParams.datePicker"
          type="datetimerange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          size="small"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" border class="container-table" :data="List">
      <el-table-column type="index" width="50" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="exceDatetime" label="评估时间"></el-table-column>
      <el-table-column prop="excePartition" label="评估分区">
        <template slot-scope="{ row }">
          {{ row.exceDatetime === 1 ? "部分数据" : "全部数据" }}
        </template>
      </el-table-column>
      <el-table-column prop="estimateTotal" label="评估总数"></el-table-column>
      <el-table-column prop="passRate" label="合格率"></el-table-column>
      <el-table-column prop="qualityScore" label="质量评分"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="text"
            @click="handleAssessmentReport(row)"
          >
            评估报告
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 评估报告弹窗 -->
    <el-dialog
      append-to-body
      v-if="reportDialogVisible"
      title="评估报告查看"
      :visible.sync="reportDialogVisible"
      :show-close="true"
      width="1200px"
    >
      <assessment-report :id="reportId"></assessment-report>
    </el-dialog>
  </div>
</template>

<script>
import { getShowLogList } from "@/api/dataCenter/dataGovernance";
import AssessmentReport from "./AssessmentReport";
export default {
  name: "HistoryResults",
  components: { AssessmentReport },
  props: {
    taskListId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      loading: true,
      queryParams: {
        endDate: "",
        startDate: "",
        taskListId: this.taskListId,
      },
      formParams: {
        datePicker: [],
      },
      List: [],
      reportId: undefined,
      reportDialogVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {
    this.getList();
  },
  methods: {
    handleQuery() {
      this.queryParams.startDate = this.formParams.datePicker[0];
      this.queryParams.endDate = this.formParams.datePicker[1];
      this.getList();
    },
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    handleAssessmentReport(row) {
      this.reportId = row.id;
      this.reportDialogVisible = true;
    },

    async getList() {
      this.loading = true;
      const { data } = await getShowLogList(this.queryParams);
      if (data) {
        this.List = data;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

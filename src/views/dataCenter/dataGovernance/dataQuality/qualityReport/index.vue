<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="模型名称:" prop="ruleTableName">
        <el-input
          v-model="queryParams.ruleTableName"
          size="small"
          style="width: 180px"
        ></el-input>
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
        <el-button icon="el-icon-refresh" plain type="primary" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" border class="container-table" :data="List">
      <el-table-column type="index" width="50" label="序号">
        <template slot-scope="scope">
          {{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ruleTableName"
        label="评估模型"
        show-overflow-tooltip
      />
      <el-table-column prop="exceDatetime" label="评估时间" width="180" />
      <el-table-column prop="excePartition" label="评估分区">
        <template slot-scope="{ row }">
          {{ row.exceDatetime === 1 ? "部分数据" : "全部数据" }}
        </template>
      </el-table-column>
      <el-table-column prop="estimateTotal" label="评估总数" />
      <el-table-column prop="estimateQualified" label="合格条数" />
      <el-table-column prop="estimateUnqualified" label="不合格条数" />
      <el-table-column prop="passRate" label="合格率" />
      <el-table-column prop="qualityScore" label="质量评分" />
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="text"
            @click="handleAssessmentReport(row)"
          >
            评估报告
          </el-button>
          <el-button size="mini" type="text" @click="handleHistoryResults(row)">
            历史结果
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNum.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      class="pull-right"
    />
    <!-- 历史结果弹窗 -->
    <el-dialog
      v-if="historyDialogVisible"
      title="历史结果查看"
      :visible.sync="historyDialogVisible"
      :show-close="true"
      width="1200px"
    >
      <history-results :taskListId="taskListId"></history-results>
    </el-dialog>
    <!-- 评估报告弹窗 -->
    <el-dialog
      v-if="reportDialogVisible"
      title="评估报告查看"
      :visible.sync="reportDialogVisible"
      :show-close="true"
      width="1200px"
    >
      <assessment-report :id="id" :taskListId="taskListId"></assessment-report>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskResultsPage } from "@/api/dataCenter/dataGovernance";
import HistoryResults from "./components/HistoryResults";
import AssessmentReport from "./components/AssessmentReport";
export default {
  name: "QualityReport",
  components: { HistoryResults, AssessmentReport },
  data() {
    return {
      loading: true,
      queryParams: {
        ruleTableName: undefined,
        pageNum: 1,
        pageSize: 15,
      },
      total: 0,
      List: [],
      historyDialogVisible: false,
      reportDialogVisible: false,
      id: undefined,
    };
  },
  computed: {},
  mounted() {
    this.getList();
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    handleHistoryResults(row) {
      this.taskListId = row.taskListId;
      this.historyDialogVisible = true;
    },
    handleAssessmentReport(row) {
      this.id = row.id;
      this.taskListId = row.taskListId;
      this.reportDialogVisible = true;
    },
    async getList() {
      this.loading = true;
      const res = await getTaskResultsPage(this.queryParams);
      if (res.code == 200) {
        const { total, records } = res.data;
        this.total = total;
        this.List = records;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

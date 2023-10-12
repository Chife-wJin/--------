<template>
  <div class="app-container" v-loading="loading">
    <div class="title">总体质量情况</div>
    <el-table border class="container-table" :data="List">
      <el-table-column
        prop="ruleTableName"
        label="评估模型"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="exceDatetime" label="评估时间"></el-table-column>
      <el-table-column prop="excePartition" label="评估分区">
        <template slot-scope="{ row }">
          {{ row.exceDatetime === 1 ? "部分数据" : "全部数据" }}
        </template>
      </el-table-column>
      <el-table-column prop="estimateTotal" label="评估总数"></el-table-column>
      <el-table-column
        prop="estimateQualified"
        label="合格条数"
      ></el-table-column>
      <el-table-column
        prop="estimateUnqualified"
        label="不合格条数"
      ></el-table-column>
      <el-table-column prop="passRate" label="合格率"></el-table-column>
      <el-table-column prop="qualityScore" label="质量评分"></el-table-column>
    </el-table>
    <el-row :gutter="20" class="module">
      <el-col :span="12">
        <div id="pie" style="width: 100%; height: 300px"></div>
      </el-col>
      <el-col :span="12">
        <div id="bar" style="width: 100%; height: 300px"></div>
      </el-col>
    </el-row>
    <div id="line" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script>
import {
  getTaskResultsInfoById,
  getBrokenLine,
  getAnalysisByField,
  getAnalysisByType,
} from "@/api/dataCenter/dataGovernance";
export default {
  name: "AssessmentReport",
  props: {
    id: {
      type: Number,
      default: undefined,
    },
    taskListId:{
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      loading: true,
      queryParams: {
        id: this.id,
      },
      List: [],
      qualityScore: [],
      passRate: [],
      Xdata: [],
      attributeList: [],
      ruleList: [],
      attrTotal: 0,
      ruleTotal: 0,
    };
  },

  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.getInfo(),
        this.getLineInfo(),
        this.getField(),
        this.getType(),
      ]);
      this.$nextTick(() => {
        this.drawPieChart();
        this.drawBarChart();
        this.drawLineChart();
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      console.log(error, "error");
    }
  },
  methods: {
    // 质量报告-评估报告明细
    async getInfo() {
      const { data } = await getTaskResultsInfoById(this.queryParams);
      if (data) {
        this.List = [data];
      }
    },
    // 质量报告-质量评估结果趋势图
    async getLineInfo() {
      const { data } = await getBrokenLine({taskListId:this.taskListId});
      if (data) {
        this.Xdata = data.Xdata;
        this.qualityScore = data.qualityScore;
        this.passRate = data.passRate;
      }
    },
    // 质量报告-执行报告分析图-按照字段分析
    async getField() {
      const { data } = await getAnalysisByField(this.queryParams);
      if (data) {
        this.attributeList = Object.keys(data).map((item) => {
          this.attrTotal += data[item].sum;
          return { name: item, value: data[item].sum };
        });
      }
    },

    // 质量报告-执行报告分析图-按照规则类型
    async getType() {
      const { data } = await getAnalysisByType(this.queryParams);
      if (data) {
        this.ruleList = Object.keys(data).map((item) => {
          this.ruleTotal += data[item].sum;
          return { name: item, value: data[item].sum };
        });
      }
    },
    drawPieChart() {
      this.circleCharts = echarts.init(document.getElementById("pie"));
      this.circleCharts.setOption({
        title: {
          text: "不合格数据按属性分布",
          left: "center",
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "60%"],
            data: this.attributeList,
            label: {
              show: true,
              position: "center",
              formatter: `合计\n\n${this.attrTotal}个`,
            },
          },
        ],
      });
    },

    drawBarChart() {
      this.circleCharts = echarts.init(document.getElementById("bar"));
      this.circleCharts.setOption({
        title: {
          text: "不合格数据按规则分布",
          left: "center",
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "60%"],
            data: this.ruleList,
            label: {
              show: true,
              position: "center",
              formatter: `合计\n\n${this.ruleTotal}个`,
            },
          },
        ],
      });
    },
    drawLineChart() {
      this.circleCharts = echarts.init(document.getElementById("line"));
      this.circleCharts.setOption({
        title: {
          text: "质量评估结果趋势图",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["合格率", "质量评分"],
          bottom: 10,
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 40,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.Xdata,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "合格率",
            type: "line",
            
            data: this.passRate,
          },
          {
            name: "质量评分",
            type: "line",
            
            data: this.qualityScore,
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.module {
  margin: 40px 0 20px 0;
}
</style>

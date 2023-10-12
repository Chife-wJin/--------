<template>
  <div class="app-container">
    <el-tag class="tips">
      flowKey: 流程标识key, 用来传给后台确定此业务表单所要用的流程
    </el-tag>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="表单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="List"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="age" />
      <el-table-column label="调整原因" align="center" prop="edu" />
      <el-table-column label="当前节点" align="center" prop="status" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-view"
            @click="processDetail(scope.row)"
            >流程追踪</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDel(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 新增弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="detailDialog"
      width="800px"
      append-to-body
    >
      <form1
        v-if="detailDialog"
        :flowKey="flowKey"
        :formData="formData"
        :showOnly="false"
        :btnIsShow="['save', 'submit']"
      />
    </el-dialog>
    <!-- 查看详细流程 -->
    <el-dialog title="查看流程" :visible.sync="flowDialog" width="1200px">
      <flow :flowData="flowData" />
      <process-detail :flowRecordList="flowRecordList" />
    </el-dialog>
  </div>
</template>

<script>
import { getFormList, delFormList } from "@/api/oa/task/specialForms";
import form1 from "./form1";
import flow from "@/views/support/oa/task/todo/detail/flow";
import processDetail from "@/views/support/oa/components/processDetail";
import { flowXmlAndNode } from "@/api/oa/flowable/definition";
import { flowRecord } from "@/api/oa/task/finished";
import Bus from "@/utils/vueBus";
export default {
  name: "SpecialForms",
  components: {
    form1,
    flow,
    processDetail,
  },
  data() {
    return {
      loading: false,
      // 每个写死表单对应的流程标识key是写死的
      flowKey: "oa_test_audit",
      showSearch: true,
      queryParams: {
        id: undefined,
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      List: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      total: 0,
      detailDialog: false,
      formData: {},
      dialogTitle: "",
      rules: {
        name: [{ required: true, message: "请输入表单名称", trigger: "blur" }],
        formUrl: [
          { required: true, message: "请输入表单url", trigger: "blur" },
        ],
      },
      flowDialog: false, // 流程图弹窗
      flowData: {}, // 流程图数据
      flowRecordList: [], // 流程流转记录
    };
  },
  created() {
    Bus.$off("ProcessSuccess");
    this.getList();
  },
  mounted() {
    Bus.$on("ProcessSuccess", () => {
      this.detailDialog = false;
      this.getList();
    });
  },
  methods: {
    // 搜索相关 start
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.queryParams.id = undefined;
      this.dialogTitle = "新增";
      this.detailDialog = true;
    },
    // 搜索相关 end

    // 表格相关 start
    getList() {
      this.loading = true;
      getFormList(this.queryParams).then((response) => {
        const { code, data } = response;
        if (code == 200) {
          this.List = data.records;
          this.total = data.total;
        }
        this.loading = false;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.procInsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleDetail(row) {
      this.queryParams.id = row.id;
      this.dialogTitle = "查看";
      this.detailDialog = true;
      this.formData = row;
    },
    handleDel(row) {
      const ids = row.id || this.ids; // 暂不支持删除多个流程
      this.$confirm("是否确认删除该条数据", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delFormList({ id: ids }).then((res) => {
          const { code, data } = res;
          if (code == 200) {
            this.getList();
            this.$message.success("删除成功");
          }
        });
      });
    },
    processDetail(row) {
      const params = {
        deployId: row.deployId,
        procInsId: row.procInsId,
      };
      flowXmlAndNode(params).then((res) => {
        this.flowDialog = true;
        this.$nextTick(() => {
          this.flowData = res.data;
        });
      });
      // 流程流转记录
      const params2 = { procInsId: row.procInsId, deployId: row.deployId };
      flowRecord(params2).then((res) => {
        this.flowRecordList = res.data.flowList;
      });
    },

    // 表格相关 end
  },
};
</script>

<style lang="scss" scoped>
.tips {
  margin: 10px 0;
  font-size: 16px;
}
</style>
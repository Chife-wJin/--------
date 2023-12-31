<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="deployTime">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.deployTime"
          type="date"
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
          >新增流程</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="myProcessList"
      border
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
      <el-table-column
        label="实例编号"
        align="center"
        prop="procInsId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="流程名称"
        align="center"
        :show-overflow-tooltip="true"
        min-width="160px"
      >
        <template slot-scope="scope">
          {{
            isEmpty(scope.row.procInstanceName)
              ? scope.row.procDefName
              : scope.row.procInstanceName
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="流程类别"
        align="center"
        prop="category"
        width="100px"
      />
      <el-table-column label="流程版本" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag size="medium">v{{ scope.row.procDefVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="提交时间"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column label="流程状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.finishTime == null" size="small"
            >进行中</el-tag
          >
          <el-tag
            type="success"
            v-if="scope.row.finishTime != null"
            size="small"
            >已完成</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="耗时"
        align="center"
        prop="duration"
        width="100"
      />
      <el-table-column label="当前节点" align="center" prop="taskName" />
      <el-table-column label="办理人" align="center">
        <template slot-scope="scope">
          <label v-if="scope.row.assigneeName"
            >{{ scope.row.assigneeName }}
            <el-tag type="info" size="small">{{
              scope.row.deptName
            }}</el-tag></label
          >
          <label v-if="scope.row.candidate">{{ scope.row.candidate }}</label>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleFlowRecord(scope.row)"
            type="text"
            size="small"
            >详情</el-button
          >
          <el-button @click="handleStop(scope.row)" type="text" size="small"
            >取消申请</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 发起流程 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form
        :model="queryProcessParams"
        ref="queryProcessForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryProcessParams.name"
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
            @click="handleProcessQuery"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="small"
            @click="resetProcessQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table v-loading="processLoading" fit :data="definitionList" border>
        <el-table-column label="流程名称" align="center" prop="name" />
        <el-table-column label="流程版本" align="center">
          <template slot-scope="scope">
            <el-tag size="medium">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="流程分类" align="center" prop="category" />
        <el-table-column
          label="操作"
          align="center"
          width="300"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit-outline"
              @click="handleStartProcess(scope.row)"
              >发起流程</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="processTotal > 0"
        :total="processTotal"
        :page.sync="queryProcessParams.pageNum"
        :limit.sync="queryProcessParams.pageSize"
        @pagination="listDefinition"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeployment,
  delDeployment,
  addDeployment,
  updateDeployment,
  exportDeployment,
  flowRecord,
} from "@/api/oa/task/finished";
import { myProcessList, stopProcess } from "@/api/oa/task/myProcess";
import { listDefinition } from "@/api/oa/flowable/definition";
import isEmpty from "@/utils/isEmpty";
export default {
  name: "Deploy",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      processLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      processTotal: 0,
      // 我发起的流程列表数据
      myProcessList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      src: "",
      definitionList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null,
      },
      // 查询参数
      queryProcessParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    isEmpty,
    /** 查询流程定义列表 */
    getList() {
      this.loading = true;
      myProcessList(this.queryParams).then((response) => {
        this.myProcessList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null,
      };
      this.resetFieldsTap("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleProcessQuery() {
      this.queryProcessParams.pageNum = 1;
      this.listDefinition();
    },
    /** 重置按钮操作 */
    resetProcessQuery() {
      this.resetFieldsTap("queryProcessForm");
      this.handleProcessQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.procInsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "发起流程";
      this.listDefinition();
    },
    listDefinition() {
      listDefinition(this.queryProcessParams).then((response) => {
        this.definitionList = response.data.records;
        this.processTotal = response.data.total;
        this.processLoading = false;
      });
    },
    /**  发起流程申请 */
    handleStartProcess(row) {
      // this.$router.push({ path: '/task/myProcess/send/index',
      //   query: {
      //     deployId: row.deploymentId,
      //     procDefId: row.id
      //     }
      // })
      const params = {
        is: "launch",
        deployId: row.deploymentId,
        procDefId: row.id,
        flowKey: row.flowKey,
      };
      this.$emit("cut", params);
    },
    /**  取消流程申请 */
    handleStop(row) {
      const params = {
        instanceId: row.procInsId,
      };
      stopProcess(params).then((res) => {
        this.$message.success(res.msg);
        this.getList();
      });
    },
    /** 流程流转记录 */
    handleFlowRecord(row) {
      // this.$router.push({
      //   path: "/task/myProcess/detail/index",
      //   query: {
      //     procInsId: row.procInsId,
      //     deployId: row.deployId,
      //     taskId: row.taskId,
      //   },
      // });
      const params = {
        is: "launch",
        procInsId: row.procInsId,
        deployId: row.deployId,
        taskId: row.taskId,
      };
      this.$emit("cut", params);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDeployment(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程定义";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDeployment(this.form).then((response) => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDeployment(this.form).then((response) => {
              this.$message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.procInsId || this.ids; // 暂不支持删除多个流程
      this.$confirm(
        '是否确认删除流程定义编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          return delDeployment(ids);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有流程定义数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return exportDeployment(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>


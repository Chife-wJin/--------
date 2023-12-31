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
      :data="finishedList"
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
        label="任务编号"
        align="center"
        prop="taskId"
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
      <el-table-column label="任务节点" align="center" prop="taskName" />
      <el-table-column label="流程发起人" align="center">
        <template slot-scope="scope">
          <label
            >{{ scope.row.startUserName }}
            <el-tag type="info" size="small">{{
              scope.row.startDeptName
            }}</el-tag></label
          >
        </template>
      </el-table-column>
      <el-table-column
        label="接收时间"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column
        label="审批时间"
        align="center"
        prop="finishTime"
        width="180"
      />
      <el-table-column
        label="耗时"
        align="center"
        prop="duration"
        width="180"
      />
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-tickets"
            @click="handleFlowRecord(scope.row)"
            >流转记录</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-refresh-left"
            @click="handleRevoke(scope.row)"
            >撤回
          </el-button>
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
  </div>
</template>

<script>
import {
  finishedList,
  getDeployment,
  delDeployment,
  addDeployment,
  updateDeployment,
  exportDeployment,
  revokeProcess,
} from "@/api/oa/task/finished";
import isEmpty from "@/utils/isEmpty";

export default {
  name: "Deploy",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 已办任务列表数据
      finishedList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      src: "",
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
      finishedList(this.queryParams).then((response) => {
        const deployId = sessionStorage.getItem("deployId");
        // 根据当前所在页面绑定的模型id(deployId), 筛选出对应的任务
        if (deployId == null) {
          // deployId为null代表当前页面为在线办公中的已办任务, 应该显示所有任务
          this.finishedList = Object.assign([], response.data.records);
        } else {
          this.finishedList = response.data.records.filter((item) => {
            return item.deployId == deployId;
          });
        }
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
    setIcon(val) {
      if (val) {
        return "el-icon-check";
      } else {
        return "el-icon-time";
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418";
      } else {
        return "#b3bdbb";
      }
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.procInsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流程定义";
    },
    /** 流程流转记录 */
    handleFlowRecord(row) {
      // this.$router.push({ path: '/task/finished/detail/index',
      //   query: {
      //     procInsId: row.procInsId,
      //     deployId: row.deployId,
      //     taskId: row.taskId,
      // }})
      const params = {
        is: "launch",
        procInsId: row.procInsId,
        deployId: row.deployId,
        taskId: row.taskId,
      };
      this.$emit("cut", params);
    },
    /** 撤回任务 */
    handleRevoke(row) {
      const params = {
        instanceId: row.procInsId,
      };
      revokeProcess(params).then((res) => {
        this.$message.success(res.msg);
        this.getList();
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.procInsId || this.ids;
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
      const ids = row.procInsId || this.ids;
      this.$confirm(
        '是否确认删除流程定义编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
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
        .then(function () {
          return exportDeployment(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>


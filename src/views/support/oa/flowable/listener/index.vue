<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="监听类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择监听类型"
          clearable
        >
          <el-option
            v-for="dict in typeList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="small"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="small"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="listenerList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="监听类型" align="center" prop="type">
        <template slot-scope="scope">
          {{ setDicSee(1, scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="事件类型" align="center" prop="eventType" />
      <el-table-column label="值类型" align="center" prop="valueType">
        <!-- <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_listener_value_type" :value="scope.row.valueType"/>
        </template> -->
      </el-table-column>
      <el-table-column label="执行内容" align="center" prop="value" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改流程监听对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="监听类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择监听类型">
            <el-option
              v-for="dict in typeList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="事件类型"
          prop="eventType"
          v-if="form.type === '1'"
        >
          <el-select v-model="form.eventType" placeholder="请选择事件类型">
            <el-option
              v-for="dict in taskListenerEventList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType" v-else>
          <el-select v-model="form.eventType" placeholder="请选择事件类型">
            <el-option
              v-for="dict in executionListenerEventList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值类型" prop="valueType">
          <el-radio-group v-model="form.valueType">
            <el-radio
              v-for="dict in dictValue"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行内容" prop="value">
          <el-input v-model="form.value" placeholder="请输入执行内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listListener,
  getListener,
  delListener,
  addListener,
  updateListener,
} from "@/api/oa/flowable/listener";
import { dictListType } from "@/api/styem/dict/type";

export default {
  name: "Listener",
  // dicts: ['sys_listener_value_type', 'sys_listener_type', 'common_status', 'sys_listener_event_type'],
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
      // 流程监听表格数据
      listenerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        type: null,
        eventType: null,
        valueType: null,
        value: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      taskListenerEventList: [
        { label: "create", value: "create" },
        { label: "assignment", value: "assignment" },
        { label: "complete", value: "complete" },
        { label: "delete", value: "delete" },
      ],
      executionListenerEventList: [
        { label: "start", value: "start" },
        { label: "end", value: "end" },
        { label: "take", value: "take" },
      ],
      typeList: [],
      dictValue: [],
    };
  },
  created() {
    this.getDicList();
    this.getList();
  },
  methods: {
    /** 获取字典 */
    async getDicList() {
      const { code: code1, data: data1 } = await dictListType({
        type: "sys_listener_value_type",
      });
      if (code1 == 200) {
        this.dictValue = data1;
      }
      const { code: code2, data: data2 } = await dictListType({
        type: "sys_listener_type",
      });
      if (code2 == 200) {
        this.typeList = data2;
      }
    },
    /** 回显字典 */
    setDicSee(type, key) {
      let str = "";
      if (type == 1) {
        this.typeList.forEach((item) => {
          if (item.value == key) {
            str = item.label;
          }
        });
      }
    },
    /** 查询流程监听列表 */
    getList() {
      this.loading = true;
      listListener(this.queryParams).then((response) => {
        const { code, data } = response;
        if (code == 200) {
          this.listenerList = data.list;
          this.total = data.count;
          this.loading = false;
        }
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
        type: null,
        eventType: null,
        valueType: null,
        value: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
        status: null,
        remark: null,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流程监听";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getListener(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程监听";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateListener(this.form).then((response) => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addListener(this.form).then((response) => {
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
      const ids = row.id || this.ids;

      this.$confirm(
        '是否确认删除流程监听编号为"' + ids + '"的数据项？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delListener(ids);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/listener/export",
        {
          ...this.queryParams,
        },
        `listener_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

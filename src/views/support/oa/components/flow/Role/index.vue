<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
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

    <el-table
      v-show="checkType === 'multiple'"
      ref="dataTable"
      v-loading="loading"
      :data="roleList"
      @selection-change="handleMultipleRoleSelect"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="角色名称"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="英文名称"
        prop="enname"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="归属机构"
        prop="officeName"
        :show-overflow-tooltip="true"
        min-width="240"
      />
      <el-table-column label="数据范围" prop="dataScopeName"> </el-table-column>
    </el-table>
    <el-table
      v-show="checkType === 'single'"
      v-loading="loading"
      :data="roleList"
      @current-change="handleSingleRoleSelect"
    >
      <el-table-column width="55" align="center">
        <template slot-scope="scope">
          <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
          <el-radio v-model="radioSelected" :label="scope.row.id"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="英文名称"
        prop="enname"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="归属机构"
        prop="officeName"
        :show-overflow-tooltip="true"
        min-width="240"
      />
      <el-table-column label="数据范围" prop="dataScopeName"> </el-table-column>
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
import { roleList } from "@/api/oa/flowable/role";

export default {
  name: "FlowRole",
  dicts: ["sys_normal_disable"],
  // 接受父组件的值
  props: {
    // 回显数据传值
    selectValues: {
      type: [Number, String, Array],
      default: null,
      required: false,
    },
    checkType: {
      type: String,
      default: "multiple",
      required: false,
    },
  },
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        name: undefined,
        roleKey: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      radioSelected: null, // 单选框传值
      selectRoleList: null, // 回显数据传值
    };
  },
  watch: {
    selectValues: {
      handler(newVal) {
        if (newVal instanceof Number || newVal instanceof String) {
          this.radioSelected = newVal;
        } else {
          this.selectRoleList = newVal;
        }
      },
      immediate: true,
    },
    roleList: {
      handler(newVal) {
        if (newVal && this.selectRoleList) {
          this.$nextTick(() => {
            this.$refs.dataTable.clearSelection();
            this.selectRoleList?.split(",").forEach((key) => {
              this.$refs.dataTable.toggleRowSelection(
                newVal.find((item) => key == item.id),
                true
              );
            });
          });
        }
      },
      immediate: true, // 立即生效
      deep: true, //监听对象或数组的时候，要用到深度监听
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      roleList(this.queryParams).then((response) => {
        const { code, data } = response;
        if (code == 200) {
          this.roleList = data;
          // this.total = response.total;
        }
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleMultipleRoleSelect(selection) {
      if(selection.length == 0 || selection.includes(undefined)) {
        return false;
      }
      const idList = selection.map((item) => item.id);
      const nameList = selection.map((item) => item.name);
      this.$emit("handleRoleSelect", idList.join(","), nameList.join(","));
    },
    // 单选框选中数据
    handleSingleRoleSelect(selection) {
      this.radioSelected = selection.id;
      const name = selection.name;
      this.$emit("handleRoleSelect", this.radioSelected.toString(), name);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery();
    },
  },
};
</script>
<style>
/*隐藏radio展示的label及本身自带的样式*/
/*.el-radio__label{*/
/*  display:none;*/
/*}*/
</style>

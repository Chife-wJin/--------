<template>
  <div>
    <el-form ref="form" :model="queryParams" :inline="true" label-width="82px">
      <el-form-item label="归属单位：">
        <el-cascader
          filterable
          clearable
          placeholder="请选择归属单位"
          v-model="queryParams.companyId"
          :options="companyOptions"
          :props="casProps"
          size="small"
          @change="deptClose"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="归属部门：">
        <el-cascader
          clearable
          filterable
          placeholder="请选择归属部门"
          v-model="queryParams.officeId"
          :options="branchOptions"
          :props="casProps"
          size="small"
          @change="officeClose"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="登录名：">
        <el-input
          placeholder="请输入登录名"
          size="small"
          v-model="queryParams.loginName"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input
          size="small"
          placeholder="请输入姓名"
          v-model="queryParams.name"
        ></el-input>
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
      :data="userList"
      @selection-change="handleMultipleUserSelect"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="归属单位"
        align="center"
        key="companyName"
        prop="companyName"
      />
      <el-table-column
        label="归属部门"
        align="center"
        key="officeName"
        prop="officeName"
      />
      <el-table-column
        label="登录名"
        align="center"
        key="loginName"
        prop="loginName"
      />
      <el-table-column label="姓名" align="center" key="name" prop="name" />
      <el-table-column label="电话" align="center" key="phone" prop="phone" />
      <el-table-column label="手机" align="center" key="mobile" prop="mobile" />
    </el-table>
    <el-table
      v-show="checkType === 'single'"
      v-loading="loading"
      :data="userList"
      @current-change="handleSingleUserSelect"
    >
      <el-table-column width="55" align="center">
        <template slot-scope="scope">
          <el-radio v-model="radioSelected" :label="scope.row.id">
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        label="归属单位"
        align="center"
        key="companyName"
        prop="companyName"
      />
      <el-table-column
        label="归属部门"
        align="center"
        key="officeName"
        prop="officeName"
      />
      <el-table-column
        label="登录名"
        align="center"
        key="loginName"
        prop="loginName"
      />
      <el-table-column label="姓名" align="center" key="name" prop="name" />
      <el-table-column label="电话" align="center" key="phone" prop="phone" />
      <el-table-column label="手机" align="center" key="mobile" prop="mobile" />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { officeTreeData } from "@/api/styem/dept.js";
import { listUser } from "@/api/styem/user";
// import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "FlowUser",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  // components: { Treeselect },
  // 接受父组件的值
  props: {
    // 回显数据传值
    selectValues: {
      type: [Number, String, Array],
      required: false,
    },
    // 表格类型
    checkType: {
      type: String,
      default: "multiple",
      required: true,
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 归属单位树数据
      deptOptions: [],
      // 归属单位下拉框数据
      companyOptions: [],
      // 下拉框字段映射
      casProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      // 归属部门下拉框数据
      branchOptions: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 5,
        companyId: undefined,
        officeId: undefined,
        loginName: undefined,
        name: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      radioSelected: null, // 单选框传值
      selectUserList: null, // 回显数据传值
    };
  },
  watch: {
    selectValues: {
      handler(newVal) {
        if (!newVal) {
          this.radioSelected = null;
          this.selectUserList = null;
        } else if (this.checkType == "single") {
          this.radioSelected = newVal;
        } else if (this.checkType == "multiple") {
          this.selectUserList = newVal;
        }
      },
      immediate: true,
    },
    userList: {
      handler(newVal) {
        if (newVal && this.selectUserList) {
          this.$nextTick(() => {
            this.$refs.dataTable.clearSelection();
            this.selectUserList?.split(",").forEach((key) => {
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
    this.getofficeTreeData();
    this.getList();
  },
  methods: {
    /** 查询单位树数据 */
    async getofficeTreeData(companyId = undefined) {
      const reponse = await officeTreeData({ companyId, type: 2 });
      if (this.deptOptions.length == 0) {
        this.deptOptions = this.handleTree(reponse.data, "id");
        this.setCompanyOptions();
      } else {
        this.branchOptions = this.handleTree(
          reponse.data,
          "id",
          "pId",
          "children",
          "1"
        );
      }
    },
    /** 筛选出归属单位下拉框数据 */
    setCompanyOptions() {
      this.companyOptions = [];
      const newVObj = JSON.parse(JSON.stringify(this.deptOptions));
      for (const key in newVObj) {
        delete newVObj[key].children;
        this.companyOptions.push(newVObj[key]);
      }
    },
    /** 归属单位下拉框选择事件 */
    deptClose(value) {
      if (!value || value[0] == undefined) {
        this.branchOptions = [];
        this.queryParams.officeId = undefined;
        return;
      }
      this.queryParams.companyId = value[0];
      this.getofficeTreeData(value[0]);
    },
    /** 归属部门下拉框选择事件 */
    officeClose(value) {
      if (!value) {
        this.queryParams.officeId = undefined;
      }
      this.queryParams.officeId = value[0];
    },
    /** 查询用户列表 */
    async getList() {
      this.loading = true;
      const reponse = await listUser(this.queryParams);
      this.userList = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    // 多选框选中数据
    handleMultipleUserSelect(selection) {
      const select = selection.filter((item) => {
        return item != undefined;
      });
      this.$emit("handleUserSelect", select);
    },
    // 单选框选中数据
    handleSingleUserSelect(selection) {
      this.radioSelected = selection?.id; //点击当前行时,radio同样有选中效果
      this.$emit("handleUserSelect", selection);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.radioSelected = null;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetFieldsTap("queryForm");
      this.$refs.tree.setCurrentKey(null);
      this.queryParams.pageNo = 1;
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

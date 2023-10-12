<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="公司名称:" prop="searchVal">
        <el-input
          v-model="queryParams.searchVal"
          clearable
          placeholder="项目名称"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh"  type="primary" plain size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8 container-state">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      class="container-table"
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="项目描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="所属用户" align="center">
        <template slot-scope="scope">{{ scope.row.userName }} </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="180"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >
            修改
          </el-button>
          <el-button
            v-if="row.status !== 'deleted'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="delete-state-btn"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      class="pull-right"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      center
      width="700px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="ruleForm"
        size="small"
        label-width="98px"
        class="dialog-form"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目名称：" prop="name">
              <el-input v-model="ruleForm.name" placeholder="项目名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目描述：" prop="description">
              <el-input v-model="ruleForm.description" placeholder="项目描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">
          返回
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as jobProjectApi from "@/api/datax/datax-job-project";
import waves from "@/directive/waves";

export default {
  name: "JobProject",
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        searchVal: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "项目管理修改",
        create: "项目管理添加",
      },
      rules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入项目描述", trigger: "blur" },
        ],
      },
      ruleForm: {
        id: undefined,
        name: "",
        description: "",
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //搜索相关start
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    handleUpdate(row) {
      this.ruleForm = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //搜索相关
    // 弹窗相关 start
    handleAdd() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.resetFieldsTap("dataForm");
      });
    },
    // 弹窗相关 end
    // 表格相关 start
    getList() {
      this.listLoading = true;
      jobProjectApi.list(this.queryParams).then((response) => {
        const { records } = response.data;
        const { total } = response.data;
        this.total = total;
        this.list = records;
        this.listLoading = false;
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          jobProjectApi.created(this.ruleForm).then(() => {
            this.getList();
            this.dialogFormVisible = false;
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.ruleForm);
          jobProjectApi.updated(tempData).then(() => {
            this.getList();
            this.dialogFormVisible = false;
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("是否确认删除选中的数据项？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const idList = [];
          idList.push(row.id);
          jobProjectApi.deleted({ idList: row.id }).then((response) => {
            this.getList();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {});
    },
    // 表格相关 end
  },
};
</script>

<template>
  <!-- 数据源维护 -->
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      class="query-form"
      v-elResize
    >
      <el-form-item label="数据源名称：" prop="datasourceName">
        <el-input v-model="queryParams.datasourceName" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
        >
          查询
        </el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="resetQuery"
          plain
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="middle-style">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="small"
        @click="handleAdd"
      >
        新增
      </el-button>

      <right-toolbar @queryTable="getList" class="middle-right"></right-toolbar>
    </div>
    <el-table
      :data="List"
      border
      style="width: 100%"
      v-loading="loading"
      stripe
      :max-height="pageHeight - 270"
    >
      <el-table-column label="序号" width="50" type="index"> </el-table-column>
      <el-table-column label="数据源名称" min-width="120">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.datasourceName" />
        </template>
      </el-table-column>
      <el-table-column label="数据源类型" min-width="120">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.datasource" />
        </template>
      </el-table-column>
      <el-table-column label="jdbcUrl" min-width="240">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.jdbcUrl" />
        </template>
      </el-table-column>
      <el-table-column label="数据库名" min-width="120">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.databaseName" />
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="120">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.jdbcUsername" />
        </template>
      </el-table-column>
      <el-table-column label="密码" width="180">
        <template>
          <tooltip-view :value="'********'" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="small" type="text" @click="handleTest(row)">
            <SvgIcon iconClass="cese" />
            测试
          </el-button>
          <el-button
            size="small"
            type="text"
            class="el-icon-edit"
            @click="handleEdit(row)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            size="small"
            class="el-icon-delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增、编辑、查看 -->
    <el-dialog
      :title="dialogTitle"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :show-close="true"
      width="1200px"
    >
      <configDialog
        :detail="detail"
        :dialogTitle="dialogTitle"
        @handleTest="handleTest"
        @getTableData="getList"
        @handleCloseDialog="handleCloseDialog"
      ></configDialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import configDialog from "./components/configDialog.vue";
import {
  genJdbcDatasourceDelete,
  genJdbcDatasourceList,
  testConnection,
} from "@/api/styem/develop";
import { SvgIcon } from "@/components";

export default {
  name: "DataSource",
  components: {
    configDialog,
    SvgIcon,
  },
  data() {
    return {
      List: [],
      tim: [],
      loading: false,
      queryParams: {
        datasourceName: undefined,
      },
      detail: {},
      dialogVisible: false,
      dialogTitle: "",
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    // 获取列表数据
    async getList() {
      this.loading = true;
      let { data } = await genJdbcDatasourceList(this.queryParams);
      if (data) {
        this.List = data || [];
      }
      this.loading = false;
    },

    // 新增
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      this.detail = {};
    },
    // 编辑、查看
    handleEdit(row) {
      this.dialogVisible = true;
      this.dialogTitle = "修改";
      this.detail = row;
    },
    // 关闭弹框
    handleCloseDialog() {
      this.dialogVisible = false;
    },
    // 删除
    handleDelete(row) {
      this.$confirm("是否确认删除选中的数据项？数据确定删除后不可恢复", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { code } = await genJdbcDatasourceDelete({ ids: row.id });
          if (code == 200) {
            this.$message.success("删除成功");
            this.getList();
          }
        })
        .catch((e) => e);
    },
    // 测试
    async handleTest(row) {
      await testConnection({
        datasource: row.datasource,
        jdbcUrl: row.jdbcUrl,
        databaseName: row.databaseName,
        jdbcUsername: row.jdbcUsername,
        jdbcPassword: row.jdbcPassword,
      });
      this.$message.success("数据源在线");
    },
    //查询
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    // 重置
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 0;
}
</style>

<template>
  <!-- 应用维护 -->
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      class="query-form"
      v-elResize
    >
      <el-form-item label="应用名称：" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="应用标识：" prop="appKey">
        <el-input v-model="queryParams.appKey" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="应用类型：" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{
            (queryParams.pageNo - 1) * queryParams.pageSize + scope.$index + 1
          }}
        </template>
      </el-table-column>
      <el-table-column label="应用名称" min-width="340">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.name" />
        </template>
      </el-table-column>
      <el-table-column label="应用标识" min-width="120">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.appKey" />
        </template>
      </el-table-column>
      <el-table-column label="应用版本" min-width="120">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.version" />
        </template>
      </el-table-column>
      <el-table-column label="应用类型" width="150">
        <template slot-scope="{ row }">
          <div class="success-box" v-if="row.type == 10">自建应用</div>
          <div class="primary-box" v-else>第三方应用</div>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="120">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.sort" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="{ row }">
          <tooltip-view :value="row.createTime" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            size="small"
            type="text"
            class="el-icon-edit"
            @click="handleEdit(row, 'edit')"
          >
            修改
          </el-button>
          <el-button
            size="small"
            type="text"
            class="el-icon-view"
            @click="handleEdit(row, 'view')"
          >
            查看
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

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 新增、编辑、查看 -->
    <el-dialog
      :title="dialogTitle"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :show-close="true"
      width="700px"
    >
      <configDialog
        :detail="detail"
        :dialogTitle="dialogTitle"
        :typeOptions="typeOptions"
        @getTableData="getList"
        @handleCloseDialog="handleCloseDialog"
      ></configDialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import configDialog from "./components/configDialog.vue";
import { sysApplicationList, sysApplicationDelete } from "@/api/styem/menu";
export default {
  name: "ApplicationMaintain",
  components: {
    configDialog,
  },
  data() {
    return {
      List: [],
      loading: false,
      total: 10,
      queryParams: {
        pageSize: 10,
        pageNo: 1,
        appKey: undefined,
        name: undefined,
        type: undefined,
      },
      detail: {},
      dialogVisible: false,
      dialogTitle: "",
      typeOptions: [
        { value: 10, label: "自建应用" },
        { value: 20, label: "第三方应用" },
      ],
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
      let { data } = await sysApplicationList(this.queryParams);
      if (data) {
        this.List = data.records || [];
        this.total = data.total || 0;
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
    handleEdit(row, type) {
      this.dialogVisible = true;
      this.dialogTitle = type == "edit" ? "修改" : "查看";
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
          const { code } = await sysApplicationDelete({ ids: row.id });
          if (code == 200) {
            this.$message.success("删除成功");
            this.getList();
          }
        })
        .catch((e) => e);
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

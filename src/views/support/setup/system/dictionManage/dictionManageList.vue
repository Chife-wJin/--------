<template>
  <div class="app-container">
    <el-form
      :model="geoCategoryParams"
      :inline="true"
      class="query-form"
      v-elResize
    >
      <el-form-item label="字典类型：">
        <el-select
          v-model="geoCategoryParams.type"
          placeholder="请选择数据类型"
          filterable
          size="small"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in typeListArry"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input
          v-model="geoCategoryParams.description"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="onSubmit"
          >查询</el-button
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
          @click="handleEdit(1)"
          >修改</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="spaceTableData"
      v-loading="loading"
      :stripe="true"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      :max-height="pageHeight - 220"
    >
      <el-table-column type="selection" width="60" />
      <el-table-column prop="value" label="键值"> </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="scope">
          <div class="linStyle">
            {{ scope.row.label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template v-slot="scope">
          <div class="linStyle" @click="handleSort(scope.row)">
            {{ scope.row.type }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        :show-overflow-tooltip="true"
        label="描述"
      ></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="name" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(2, scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            class="el-icon-delete"
            @click="handleDelete(2, scope.row)"
            >删除</el-button
          >
          <el-button size="small" type="text" @click="handleValueAdd(scope.row)"
            >添加键值</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-plus"
            @click="handleAddLower(scope.row)"
            >添加下级键值</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dictList, dictDelete, dictTypeList } from "@/api/styem/log";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      loading: true,
      spaceTableData: [],
      typeListArry: [],
      total: 0,
      ids: [],
      single: true,
      geoCategoryParams: {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        description: undefined,
      },
    };
  },
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getSpaceList();
    this.getTypeList();
  },
  methods: {
    async getTypeList() {
      const reponse = await dictTypeList();
      this.typeListArry = reponse.data;
    },
    async getSpaceList() {
      this.loading = true;
      const reponse = await dictList(this.geoCategoryParams);
      const menu = this.handleTree(
        reponse.data || [],
        "id",
        "parentId",
        "children",
        "0"
      );
      this.spaceTableData = menu;
      this.loading = false;
    },
    onSubmit() {
      this.geoCategoryParams.pageNo = 1;
      this.getSpaceList();
    },
    handleEdit(type, row) {
      let id;
      if (type == "1") {
        id = this.ids[0];
      } else {
        id = row.id;
      }
      this.$emit("handleSeeAmend", { tabState: "amend" });
      this.$nextTick(() => {
        Bus.$emit("outComeId", {
          state: "amend",
          id,
        });
      });
    },
    handleSort(row) {
      const { type } = row;
      this.geoCategoryParams.type = type;
      this.getSpaceList();
    },
    handleValueAdd(row) {
      const { id } = row;
      this.$emit("handleSeeAmend", { tabState: "add" });
      this.$nextTick(() => {
        Bus.$emit("outComeId", {
          state: "addKey",
          id,
        });
      });
    },
    handleAddLower(row) {
      const { id } = row;
      this.$emit("handleSeeAmend", { tabState: "add" });
      this.$nextTick(() => {
        Bus.$emit("outComeId", {
          state: "addNext",
          id,
        });
      });
    },
    handleDelete(type, row) {
      let dictId;
      if (type == "1") {
        dictId = this.ids;
      } else {
        dictId = row.id;
      }
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dictDelete({ dictId }).then((reponse) => {
            if (reponse.code == 200) {
              this.geoCategoryParams.pageNo = 1;
              this.getSpaceList();
            }
          });
        })
        .catch((e) => e);
    },
    // 新增按钮操作
    handleAdd() {
      this.$emit("handleSeeAmend", { tabState: "add" });
      this.$nextTick(() => {
        Bus.$emit("outComeId", "");
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-table th.el-table__cell {
  padding: 10px 0;
  background-color: #f8f8f9 !important;
  border-right: none;
}
/deep/.el-table th.el-table__cell > .cell {
  border: none;
  padding: 0 10px;
  font-weight: 600;
  color: #515a6e;
  font-size: 13px;
}
/deep/.el-table .el-table__cell {
  border-right: none !important;
}
.box-body {
  padding: 0;
  padding-left: 8px;
  background-color: #fff;
  margin: 0;
}

.el-form-item {
  margin-right: 30px !important;
  margin-bottom: 6px !important;
}
.mb10 {
  margin-bottom: 8px;
}
</style>

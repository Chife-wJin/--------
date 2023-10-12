<template>
  <div class="tab-list-content">
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
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="small"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="menuListData"
      v-if="refreshTable"
      v-loading="loading"
      style="width: 100%"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
    >
      <el-table-column
        label="菜单名称"
        min-width="160"
        :show-overflow-tooltip="true"
        class-name="table-td-left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="href"
        label="链接"
        class-name="table-td-left"
        :show-overflow-tooltip="true"
        min-width="160"
      ></el-table-column>
      <el-table-column prop="sort" label="排序">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            class="sort-input"
            placeholder
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="可见" width="100">
        <template slot-scope="scope">{{
          isShowChange(scope.row.isShow)
        }}</template>
      </el-table-column>
      <el-table-column
        prop="permission"
        label="权限标识"
        :show-overflow-tooltip="true"
        width="200"
      ></el-table-column>
      <el-table-column prop="name" label="操作" min-width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(2, scope.row)"
            >修改</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(2, scope.row)"
            >删除</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-plus"
            @click="handleAddLower(scope.row)"
            >添加下级菜单</el-button
          >
          <el-button size="small" type="text" @click="handleSort(scope.row)"
            >排序</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { menuUpdateSort, menuDelete } from "@/api/styem/menu";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  props: {
    menuListData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: true,
      isExpandAll: false,
      refreshTable: true,
      ids: [],
      single: true,
    };
  },
  watch: {
    menuListData: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.length != 0) {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    isShowChange(val) {
      if (val === "1") {
        return "显示";
      } else {
        return "隐藏";
      }
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
        Bus.$emit("outMentComeId", {
          state: "amend",
          id,
        });
      });
    },
    handleDelete(type, row) {
      let menuId;
      if (type == "1") {
        menuId = this.ids;
      } else {
        menuId = row.id;
      }
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          menuDelete({ menuId }).then((reponse) => {
            if (reponse.code == 200) {
              this.$emit("backHandle", "update");
            }
          });
        })
        .catch((e) => e);
    },
    handleAddLower(row) {
      const { id } = row;
      this.$emit("handleSeeAmend", { tabState: "add" });
      this.$nextTick(() => {
        Bus.$emit("outMentComeId", {
          state: "addNext",
          id,
        });
      });
    },
    async handleSort(row) {
      const { id, sort } = row;
      const reponse = await menuUpdateSort({ id, sort });
      if (reponse.code === 200) {
        this.$emit("backHandle", "update");
      }
    },
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    handleAdd() {
      this.$emit("handleSeeAmend", { tabState: "add" });
      this.$nextTick(() => {
        Bus.$emit("outMentComeId", "");
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-list-content {
  /deep/.table-td-left .cell {
    text-align: left !important;
  }
  /deep/.sort-input .el-input__inner {
    height: 28px;
    text-align: center;
  }
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
  .mb10 {
    margin-bottom: 8px;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
  //未展开父级增加图标
  /deep/.el-table__expand-icon + span::before {
    font-family: element-icons !important;
    content: "\e78a";
    margin-right: 5px;
    color: rgb(253, 160, 3);
  }
  //已展开父级增加图标
  /deep/.el-table__expand-icon--expanded + span::before {
    font-family: element-icons !important;
    content: "\e784";
    margin-right: 5px;
    color: rgb(253, 160, 3);
  }

  // 无子级项增加图标
  /deep/.el-table__row:not([class*="el-table__row--level"])
    td:first-child
    .cell
    span:before {
    font-family: element-icons !important;
    content: "\e785";
    color: rgb(208, 208, 9);
    margin-left: 5px;
  }

  //修改子目录前图标
  /deep/.el-table
    [class*="el-table__row--level"]
    .el-table__placeholder:before {
    font-family: element-icons !important;
    content: "\e785";
    color: rgb(208, 208, 9);
  }
  /deep/.el-table [class*="el-table__row--level"] .el-table__placeholder {
    margin-left: 8px;
  }
}
</style>

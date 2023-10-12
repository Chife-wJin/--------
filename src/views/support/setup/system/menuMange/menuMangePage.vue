<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb10" v-elResize>
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
      :max-height="pageHeight - 200"
    >
      <el-table-column
        label="菜单名称"
        min-width="300"
        :show-overflow-tooltip="true"
        class-name="table-td-left"
      >
        <template slot-scope="{ row }">
          <span class="menu-tree-btn">
            <el-button
              type="warning"
              size="small"
              plain
              v-if="row.menuType == 'A'"
            >
              应用
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              v-if="row.menuType == 'D'"
            >
              目录
            </el-button>
            <el-button
              type="success"
              size="small"
              plain
              v-if="row.menuType == 'M'"
            >
              菜单
            </el-button>
            <el-button type="info" size="small" plain v-if="row.menuType == 'B'">
              按钮
            </el-button>
            <span>{{ row.name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="href"
        label="链接"
        class-name="table-td-left"
        :show-overflow-tooltip="true"
        min-width="150"
      ></el-table-column>
      <el-table-column prop="sort" label="排序" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示状态" width="200">
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
        <template slot-scope="{ row }">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            v-if="row.menuType !== 'A'"
            @click="handleEdit(2, row)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            size="small"
            class="el-icon-delete"
            v-if="row.menuType !== 'A'"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-plus"
            @click="handleAddLower(row)"
            >添加下级菜单</el-button
          >
          <!-- <el-button size="small" type="text" @click="handleSort(row)">
            排序
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="tabState == 'edit' ? '菜单修改' : '菜单添加'"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
      width="800px"
    >
      <menu-mange-amend
        :tabState="tabState"
        :detail="detail"
        @handleDialogClose="handleDialogClose"
        @getMenuList="getMenuList"
      ></menu-mange-amend>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { menuUpdateSort, menuDelete, menuList } from "@/api/styem/menu";
import { MessageBox } from "element-ui";
import menuMangeAmend from "./menuMangeAmend";

export default {
  components: {
    menuMangeAmend,
  },
  props: {},
  data() {
    return {
      loading: true,
      isExpandAll: false,
      refreshTable: true,
      ids: [],
      single: true,
      dialogFormVisible: false,
      menuListData: [],
    };
  },
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      const res = await menuList();
      this.menuListData = res.data || [];
      this.loading = false;
    },
    // 编辑
    handleEdit(type, row) {
      console.log("🚀 ~ file: menuMangePage.vue:182 ~ handleEdit ~ row:", row);
      let id;
      if (type == "1") {
        id = this.ids[0];
      } else {
        id = row.id;
      }
      this.dialogFormVisible = true;
      this.tabState = "edit";
      this.detail = row;
    },
    // 新增下一步
    handleAddLower(row) {
      this.dialogFormVisible = true;
      this.tabState = "addNext";
      this.detail = row;
    },
    // 新增
    handleAdd() {
      this.dialogFormVisible = true;
      this.tabState = "add";
      this.detail = {};
    },
    // 删除
    handleDelete(row) {
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          menuDelete({ menuId: row.id }).then((res) => {
            this.getMenuList();
          });
        })
        .catch((e) => e);
    },
    handleDialogClose() {
      this.dialogFormVisible = false;
    },
    isShowChange(val) {
      if (val === "1") {
        return "显示";
      } else {
        return "隐藏";
      }
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
  },
};
</script>

<style lang="scss" scoped>
.app-container {
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
}
</style>

<template>
  <div>
    <div class="tab-list-content">
      <!-- <div class="box-body">
        <el-form :model="queryParams" label-width="100px">
          <el-row>
            <el-form-item class="pull-right">
              <el-button type="primary" icon="el-icon-search"
              size="small" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div> -->
      <el-row :gutter="10" class="mb10">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="onSubmit"
            >查询</el-button
          >
        </el-col>
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
        :data="testTreeData"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="name" min-width="180px">
          <template v-slot="scope">
            <div
              class="linStyle"
              style="padding-left: 20px"
              @click="handleEdit(scope.row)"
              min-width="180px"
            >
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateDate"
          label="update_date"
        ></el-table-column>
        <el-table-column prop="remarks" label="remarks"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-if="permissionBolean" slot-scope="scope">
            <el-button size="small" @click="handleEdit(2, scope.row)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(2, scope.row)"
              >删除</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleAddLower(scope.row)"
              ><i class="el-icon-plus" style="margin-right: 5px"></i
              >添加下级机构</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { dictListType } from "@/api/styem/dict/type.js";
import { testTreeList, testTreeDelete } from "@/api/case/tree";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      queryParams: {},
      testTreeData: [],
      delFlagArry: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      normalizer(node) {
        return {
          label: node.name,
        };
      },
    };
  },
  created() {
    this.getList();
    this.getDictList();
  },
  mounted() {
    this.handlePermission(["tree:testTree:edit"]);
  },
  methods: {
    handlePermission(permissionsFlag) {
      const permissionBolean = this.hasPermission(permissionsFlag);
      this.permissionBolean = permissionBolean;
    },
    async getDictList() {
      const delFlagReponse = await dictListType({ type: "del_flag" });
      this.delFlagArry = delFlagReponse.data;
    },
    async getList() {
      this.loading = true;
      const reponse = await testTreeList();
      if (reponse.code === 500 && reponse.msg === "操作权限不足") {
        this.$emit("handleSeeAmend", { tabState: "noListLimits" });
        return;
      }
      this.$emit("handleSeeAmend", {
        tabState: "ListLimits",
        name: this.permissionBolean,
      });
      if (!reponse.data) {
        this.testTreeData = [];
        return;
      }
      const menu = this.handleTree(
        reponse.data,
        "id",
        "parentId",
        "children",
        "0"
      );
      this.testTreeData = menu;
    },
    onSubmit() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    handleEdit(type, row) {
      let id;
      if (type == "1") {
        id = this.ids[0];
      } else {
        id = row.id;
      }
      Bus.$emit("outComeId", {
        state: "amend",
        id,
        buttonShow: this.permissionBolean,
      });
      this.$emit("handleSeeAmend", { tabState: "amend", name: "add" });
    },
    handleAddLower(row) {
      const { id } = row;
      Bus.$emit("outComeId", {
        state: "addNext",
        id,
      });
      this.$emit("handleSeeAmend", { tabState: "add", name: "add" });
    },
    handleDelete(type, row) {
      let id;
      if (type == "1") {
        id = this.ids;
      } else {
        id = row.id;
      }
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        testTreeDelete({ id }).then((reponse) => {
          if (reponse.code == 200) {
            this.queryParams.pageNo = 1;
            this.getList(this.queryParams);
          }
        });
      });
    },
    handleAdd() {
      Bus.$emit("outComeId", "");
      this.$emit("handleSeeAmend", { tabState: "add" });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      // this.multiple = !selection.length
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .cell {
  display: flex;
  justify-content: center;
}
/deep/.el-table__expand-icon {
  margin-right: -20px !important;
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
/deep/.el-button--mini {
  margin-left: 20px;
}
</style>

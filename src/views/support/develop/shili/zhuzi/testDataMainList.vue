<template>
  <div>
    <div class="app-container">
      <el-form :model="queryParams" class="query-form" :inline="true">
        <el-form-item label="归属用户：">
          <treeselect
            v-model="queryParams.user"
            :options="userOptions"
            :load-options="loadOptions"
            :disable-branch-nodes="true"
            noChildrenText="无"
            :autoLoadRootOptions="false"
            :searchable="false"
            placeholder="请选择归属用户"
            size="small"
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="名称：">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            size="small"
            style="width: 240px"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别：">
          <el-select
            v-model="queryParams.sex"
            placeholder="请选择性别"
            size="small"
            style="width: 240px"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in sexArry"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="queryParams.createDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间"
            size="small"
            style="width: 240px"
          ></el-date-picker>
        </el-form-item>

        <el-form-item class="pull-right">
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
        v-loading="loading"
        :data="testDataMainData"
        style="width: 100%"
        :stripe="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column prop="user.name" label="归属用户"></el-table-column>
        <el-table-column label="名称" min-width="180px">
          <template v-slot="scope">
            <div
              class="linStyle"
              style="padding-left: 20px"
              @click="handleSee(scope.row)"
              min-width="180px"
            >
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="更新时间"></el-table-column>
        <el-table-column prop="remarks" label="备注信息"></el-table-column>
        <el-table-column label="操作">
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
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :pageNo.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { dictListType } from "@/api/styem/dict/type.js";
import { testDataMainList, testDataMainDelete } from "@/api/case/master";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { officeTreeData } from "@/api/styem/dept";
import { userTreeData } from "@/api/styem/user";
import { officeList } from "@/api/styem/dept";
import { areaTreeData } from "@/api/styem/dept";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      queryParams: {
        user: undefined,
        name: undefined,
        sex: undefined,
        createDate: undefined,
        pageNo: 1,
        pageSize: 10,
      },
      loading: true,
      testDataMainData: [],
      total: 0,
      userOptions: [],
      officeOptions: [],
      areaOptions: [],
      sexArry: [],
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
    this.getUserOfficeTree();
    this.getOfficeTree();
    this.getAreaTree();
  },
  mounted() {
    this.handlePermission(["zhuzi:testDataMain:edit"]);
  },
  methods: {
    handlePermission(permissionsFlag) {
      const permissionBolean = this.hasPermission(permissionsFlag);
      this.permissionBolean = permissionBolean;
    },
    async getDictList() {
      const sexReponse = await dictListType({ type: "sex" });
      this.sexArry = sexReponse.data;
      const delFlagReponse = await dictListType({ type: "del_flag" });
      this.delFlagArry = delFlagReponse.data;
    },
    async getList() {
      this.loading = true;
      const reponse = await testDataMainList(this.queryParams);
      if (reponse.code === 500 && reponse.msg === "操作权限不足") {
        this.$emit("handleSeeAmend", { tabState: "noListLimits" });
        return;
      } else {
        this.$emit("handleSeeAmend", {
          tabState: "ListLimits",
          name: this.permissionBolean,
        });
      }
      this.testDataMainData = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    async getUserOfficeTree() {
      const reponse = await officeTreeData({ type: 2 });
      const userOptions = [];
      for (const item in reponse.data) {
        const subject = reponse.data[item];
        const temp = {
          id: subject.id,
          label: subject.name,
          children: null,
        };
        userOptions.push(temp);
      }
      this.userOptions = userOptions;
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        userTreeData({ officeId: parentNode.id }).then((reponse) => {
          const userOptions = [];
          for (const item in reponse.data) {
            const subject = reponse.data[item];
            const temp = {
              id: subject.id,
              label: subject.name,
            };
            userOptions.push(temp);
          }
          parentNode.children = userOptions;
          callback();
        });
      }
    },
    async getOfficeTree() {
      const reponse = await officeList();
      const menu = this.handleTree(
        reponse.data,
        "id",
        "parentId",
        "children",
        "0"
      );
      this.officeOptions = menu;
    },
    async getAreaTree() {
      const reponse = await areaTreeData();
      const menu = this.handleTree(reponse.data, "id", "pId", "children", "0");
      this.areaOptions = menu;
    },
    onSubmit() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    handleSee(row) {
      const { id } = row;
      Bus.$emit("outComeSeeId", id);
      this.$emit("handleSeeAmend", { tabState: "see", name: "see" });
    },
    handleEdit(type, row) {
      let id;
      if (type == "1") {
        id = this.ids[0];
      } else {
        id = row.id;
      }
      Bus.$emit("outComeId", id);
      this.$emit("handleSeeAmend", { tabState: "amend", name: "add" });
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
        testDataMainDelete({ id }).then((reponse) => {
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
/deep/.el-form-item__label {
  line-height: 32px;
}
/deep/.el-form-item__content {
  line-height: 32px;
}
/deep/.vue-treeselect__control {
  height: 32px;
}
/deep/.vue-treeselect__placeholder,
.vue-treeselect__single-value {
  line-height: 30px;
  font-size: 13px;
  padding-left: 10px;
}
/deep/.el-form-item__content {
  justify-content: flex-end;
  margin-left: 0px !important;
}
/deep/.el-link--inner {
  font-weight: bold;
  color: red;
}
/deep/.el-input__icon {
  line-height: 24px !important;
}
/deep/.el-button--mini {
  margin-left: 20px;
}
// /deep/.el-form-item__content
</style>

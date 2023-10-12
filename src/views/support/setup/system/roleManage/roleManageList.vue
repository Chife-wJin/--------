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
      :data="roleListData"
      v-loading="loading"
      style="width: 100%"
      :stripe="true"
      @selection-change="handleSelectionChange"
      :max-height="pageHeight - 200"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <div class="linStyle">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="enname" label="英文名称"></el-table-column>
      <el-table-column
        prop="officeName"
        label="归属机构"
        :show-overflow-tooltip="true"
        min-width="240"
      ></el-table-column>
      <el-table-column prop="dataScopeName" label="数据范围"></el-table-column>
      <el-table-column prop="name" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-plus"
            @click="handleAddLower(scope.row)"
            >分配</el-button
          >
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { roleList, roleDelete } from "@/api/styem/role";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      loading: true,
      total: 0,
      roleListData: undefined,
      ids: [],
      single: true,
    };
  },
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const reponse = await roleList();
      this.roleListData = reponse.data;
      this.loading = false;
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
        Bus.$emit("outComeId", id);
      });
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
      })
        .then(() => {
          roleDelete({ id }).then((reponse) => {
            if (reponse.code == 200) {
              this.$emit("backHandle", "update");
            }
          });
        })
        .catch((e) => e);
    },
    handleAddLower(row) {
      const { id } = row;
      this.$emit("handleSeeAmend", { tabState: "see" });
      this.$nextTick(() => {
        Bus.$emit("outComeAllotId", id);
      });
    },
    handleAdd() {
      this.$emit("handleSeeAmend", { tabState: "add" });
      this.$nextTick(() => {
        Bus.$emit("outComeId", "");
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
</style>

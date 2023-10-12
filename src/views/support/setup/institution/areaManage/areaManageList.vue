<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb10" v-elResize>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleNew"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="small"
          @click="handleEdit(1)"
          :disabled="
              multipleSelection.length > 1 || multipleSelection.length == 0
            "
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="small"
          :disabled="
              multipleSelection.length > 1 || multipleSelection.length == 0
            "
          @click="handleDelete(1)"
        >删除</el-button>
      </el-col>-->
    </el-row>
    <!-- @selection-change="handleSelectionChange" -->
    <el-table
      :data="areaListData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      v-loading="loading"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :max-height="pageHeight - 200"
    >
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column
        label="区域名称"
        class-name="table-td-left"
        min-width="240"
      >
        <template slot-scope="scope">
          <span @click="handleEdit(2, scope.row)">{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="区域编码" width="240"></el-table-column>
      <el-table-column
        prop="typeName"
        label="区域类型"
        width="240"
      ></el-table-column>
      <el-table-column prop="name" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(2, scope.row)"
            icon="el-icon-edit"
            type="text"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            class="el-icon-delete"
            @click="handleDelete(2, scope.row)"
            >删除</el-button
          >
          <el-button
            size="small"
            @click="handleAddLower(scope.row)"
            icon="el-icon-plus"
            type="text"
            >添加下级区域</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { areaTreeNew, officeDelete } from "@/api/styem/dept";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      multipleSelection: [],
      loading: true,
      total: 0,
      areaListData: undefined,
      geoCategoryParams: {
        pageNo: 1,
        pageSize: 10,
        geoCategory: undefined,
        name: undefined,
        dataType: undefined,
        version: undefined,
        year: undefined,
      },
    };
  },
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getAreaList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleEdit(type, row) {
      let id;
      if (type == "1") {
        id = this.multipleSelection[0].id;
      } else {
        id = row.id;
      }
      this.$emit("handleSeeAmend", {
        state: "amend",
        id,
      });
    },
    handleNew() {
      this.$emit("handleSeeAmend", "");
    },
    async getAreaList() {
      const reponse = await areaTreeNew();
      this.areaListData = reponse.data;
      this.loading = false;
    },
    async load(tree, treeNode, resolve) {
      const reponse = await areaTreeNew({ parentId: tree.id });
      resolve(reponse.data);
    },
    handleDelete(type, row) {
      let id;
      if (type == "1") {
        id = this.multipleSelection[0].id;
      } else {
        id = row.id;
      }
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          officeDelete({ officeId: id }).then((reponse) => {
            if (reponse.code == 200) {
              this.$emit("backHandle", "update");
            }
          });
        })
        .catch((e) => e);
    },
    handleAddLower(row) {
      const { id } = row;
      Bus.$emit("outAreaComeId", {
        state: "addNext",
        id,
      });
      this.$emit("handleSeeAmend", { tabState: "add", name: "add" });
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

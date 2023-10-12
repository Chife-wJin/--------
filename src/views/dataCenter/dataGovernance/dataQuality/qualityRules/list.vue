<template>
  <div class="app-container">
    <div class="form-container">
      <el-row
        :gutter="10"
        class="mb8 container-state"
        type="flex"
        justify="space-between"
      >
        <el-col :span="1.5" >
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            @click="handleDeleteAll"
            >批量删除</el-button
          >
          <el-button
            type="primary"
            plain
            size="small"
            @click="handleWeightsSetting"
            >权重设置</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-form
            class="search-body"
            :model="queryParams"
            :inline="true"
            label-width="120px"
          >
            <el-form-item label="" prop="name">
              <el-input
                v-model="queryParams.name"
                size="small"
                style="width: 180px"
                placeholder="请输入规则名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="fieldContent">
              <el-input
                v-model="queryParams.fieldContent"
                size="small"
                style="width: 180px"
                placeholder="请输入属性名称"
              ></el-input>
            </el-form-item>
            <el-form-item prop="type">
              <el-select
                v-model="queryParams.type"
                size="small"
                style="width: 180px"
                placeholder="请选择规范类型"
              >
                <el-option
                  v-for="(item, i) in canonicalTypeData"
                  :key="i"
                  :label="item.title"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleQuery"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="table-container list">
      <el-table
        v-loading="loading"
        border
        class="container-table"
        :stripe="true"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" label="选择">
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称"></el-table-column>
        <el-table-column prop="fieldName" label="属性名称"></el-table-column>
        <el-table-column prop="fieldContent" label="中文名称"></el-table-column>
        <el-table-column prop="type_text" label="规则类型"></el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              v-model="checkAlla"
              @click.native="checkAll1(checkAlla)"
              style="font-weight: bold"
              >已有数据评估{{ scope.row }}</el-checkbox
            >
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked1"
              @change="checkItem1"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              v-model="checkAllb"
              @click.native="checkAll2(checkAllb)"
              style="font-weight: bold"
              >数据入库校验{{ scope.row }}</el-checkbox
            >
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked2"
              @change="checkItem2"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="couValue" label="操作" min-width="80">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              v-show="scope.row.type !== 1 && scope.row.type !== 2"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="text"
              class="delete-state-btn"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :pageNo.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        class="pull-right"
      />
    </div>
  </div>
</template>
<script>
import {
  accessRulesDelete,
  dictListType,
  accessRulesContent,
} from "@/api/dataCenter/dataGovernance";

export default {
  name: "List",
  data() {
    return {
      loading: true,
      false: true,
      tableData: [],
      checkAlla: false,
      checkAllb: false,
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        assessTableId: "",
        fieldContent: "",
        name: "",
      },
      delIds: "",
      total: 0,
      canonicalTypeData: undefined,
      assessTable: {
        databaseName: "",
        datasourceId: "",
        tableContent: "",
        tableName: "",
      },
      id: 1,
    };
  },
  props: {
    treeId: Number,
    treeData: Object,
  },
  created() {
    console.log(this.treeId);
    this.queryParams.assessTableId = this.treeId;
    this.getList();
    this.datacenterDictList();
  },
  watch: {
    treeId(newV, oldV) {
      console.log(newV);
      this.queryParams.assessTableId = newV;
      // this.getList()
    },
  },
  methods: {
    handleQuery() {
      this.getList();
    },
    checkAll1(status) {
      console.log(status);
      //let self = this;
      this.tableData.forEach((item) => {
        item.checked1 = !status;
      });
    },
    checkItem1() {
      this.checkAlla = this.tableData.every((item) => item.checked1);
    },
    checkAll2(status) {
      console.log(status);
      let self = this;
      self.tableData.forEach((item) => {
        item.checked2 = !status;
      });
    },
    checkItem2() {
      this.checkAllb = this.tableData.every((item) => item.checked2);
    },

    async datacenterDictList() {
      const canonicalTypeReponse = await dictListType({ type: "range" });
      this.canonicalTypeData = canonicalTypeReponse.data;
    },
    handleSelectionChange(val) {
      // console.log(val);
      let idsArr = [];
      idsArr = val.map((item) => item.id);
      //  console.log(idsArr);
      this.delIds = idsArr.toString();
      // console.log(this.delIds);
    },
    handleDeleteAll() {
      console.log(this.delIds);
      this.$confirm("是否要删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          accessRulesDelete({ ids: this.delIds }).then((reponse) => {
            if (reponse.code == 200) {
              this.$message.success("已删除");
              this.getList();
            }
          });
        })
        .catch((err) => err);
    },
    handleDelete(row) {
      let id = row.id;
      this.$confirm("确认要删除该元数据信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          accessRulesDelete({ ids: id }).then((reponse) => {
            if (reponse.code == 200) {
              this.$message({
                message: reponse.msg,
                type: "success",
              });
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },
    handleWeightsSetting() {
      this.$emit("weightsSetting", this.tableData);
    },
    handleAdd: function () {
      console.log(this.treeId);
      if (this.treeId) {
        this.$emit("changeCom", "new", "新增", "step2");
      } else {
        this.$emit("changeCom", "new", "新增", "step1");
      }
    },
    handleEdit: function (row) {
      this.$emit("editBtn", row);
    },
    async getList() {
      //  console.log(this.queryParams.assessTableId)
      // console.log(this.queryParams)
      this.loading = true;
      const reponse = await accessRulesContent(this.queryParams);
      // console.log(reponse)
      this.tableData = reponse.data.records.length ? reponse.data.records : [];
      this.tableData.map((val, key) => {
        this.$set(val, "checked1", false);
      });
      this.tableData.map((val, key) => {
        this.$set(val, "checked2", false);
      });
      this.tableData.map((item) => {
        switch (item.type) {
          case 1:
            item.type_text = "唯一";
            break;
          case 2:
            item.type_text = "非空";
            break;
          case 3:
            item.type_text = "组合唯一";
            break;
          case 4:
            item.type_text = "一致";
            break;
          case 5:
            item.type_text = "核准";
            break;
          case 6:
            item.type_text = "规范";
            break;
          case 7:
            item.type_text = "正则";
            break;
          case 9:
            item.type_text = "阈值";
            break;
          case 10:
            item.type_text = "多字段";
            break;
          case 11:
            item.type_text = "快速创建";
            break;
        }
      });
      this.total = reponse.data.total;
      console.log(this.tableData);
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding-top: 10px !important;
}
a {
  color: rgb(64, 158, 255);
}
.platform-layout-main .platform-layout-content .app-container .search-body {
  padding-top: 0;
}
.platform-layout-main
  .platform-layout-content
  .app-container
  .search-body
  .el-form-item {
  margin-bottom: 5px;
}
::v-deep .el-checkbox .el-checkbox__label {
  font-size: 15px;
  color: #333;
}

.container-state .el-button{margin-top: 5px;}

::v-deep .el-form-item{margin-bottom: 0;}
// /deep/ .el-button {
//   margin-bottom: 5px;
// }
// ::v-deep .el-table .cell {
//   display: flex;
//   justify-content: center;
// }
// ::v-deep .sort-input .el-input__inner {
//   height: 28px;
//   text-align: center;
// }
// ::v-deep .el-table__expand-icon {
//   margin-right: -20px !important;
// }
// ::v-deep .el-table th.el-table__cell {
//   padding: 10px 0;
//   background-color: #f8f8f9 !important;
//   border-right: none;
// }
// ::v-deep .el-table th.el-table__cell > .cell {
//   border: none;
//   padding: 0 10px;
//   font-weight: 600;
//   color: #515a6e;
//   font-size: 13px;
// }
// ::v-deep .el-table .el-table__cell {
//   border-right: none !important;
// }
</style>
<template>
  <div>
    <div class="app-container">
      <div class="box-body">
        <el-form
          ref="form"
          :model="geoCategoryParams"
          :inline="true"
          class="query-form"
        >
          <el-form-item label="表名：">
            <el-input
              placeholder="请输入表名"
              v-model="geoCategoryParams.nameLike"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="说明：">
            <el-input
              placeholder="请输入说明"
              size="small"
              v-model="geoCategoryParams.comments"
            ></el-input>
          </el-form-item>
          <el-form-item label="父表表名：">
            <el-input
              placeholder="请输入父表表名"
              size="small"
              v-model="geoCategoryParams.parentTable"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="onSubmit"
            >
              查询
            </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="clear" plain>
              重置
            </el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb10">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="small"
              @click="handleNew"
            >
              新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="small"
              @click="handleEdit(1)"
              :disabled="
                multipleSelection.length > 1 || multipleSelection.length == 0
              "
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="small"
              @click="handleDelete(1)"
              :disabled="
                multipleSelection.length > 1 || multipleSelection.length == 0
              "
              >删除</el-button
            >
          </el-col>
        </el-row>
      </div>

      <el-table
        v-loading="loading"
        :data="businsessData"
        border
        style="width: 100%"
        :stripe="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="表名">
          <template v-slot="scope">
            <div
              class="linStyle"
              style="padding-left: 20px"
              @click="handleEdit(2, scope.row)"
            >
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="comments" label="说明"></el-table-column>
        <el-table-column prop="className" label="类名"></el-table-column>
        <el-table-column prop="parentTable" label="父表"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              class="el-icon-edit"
              @click="handleEdit(2, scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              class="el-icon-delete"
              @click="handleDelete(2, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :pageNo.sync="geoCategoryParams.pageNo"
        :limit.sync="geoCategoryParams.pageSize"
        @pagination="getGenTableList"
      />
    </div>
  </div>
</template>

<script>
import { genTableList, genTableDelete } from "@/api/styem/develop";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      multipleSelection: [],
      geoCategoryParams: {
        nameLike: undefined,
        comments: undefined,
        parentTable: undefined,
        pageNo: 1,
        pageSize: 10,
      },
      loading: true,
      businsessData: undefined,
      total: 0,
    };
  },
  created() {
    this.getGenTableList();
  },
  methods: {
    clear: function () {
      for (let i in this.geoCategoryParams) {
        if (!["pageNo", "pageSize"].includes(i)) {
          this.$set(this.geoCategoryParams, i, undefined);
        }
      }
    },
    handleNew() {
      this.$emit("handleSeeAmend", {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async getGenTableList() {
      this.loading = true;
      const reponse = await genTableList(this.geoCategoryParams);
      this.businsessData = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },

    async onSubmit() {
      this.geoCategoryParams.pageNo = 1;
      this.getGenTableList(this.geoCategoryParams);
    },
    handleEdit(type, row) {
      let id;
      if (type == "1") {
        row = this.multipleSelection[0];
      }
      this.$emit("handleSeeAmend", row);
    },
    handleDelete(type, row) {
      let ids;
      if (type == "1") {
        ids = this.multipleSelection[0].id;
      } else {
        ids = row.id;
      }
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        genTableDelete({ id: ids }).then((reponse) => {
          if (reponse.code == 200) {
            this.getGenTableList(this.geoCategoryParams);
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  justify-content: flex-start;
  height: 60px;
  padding-right: 10px;
  align-items: center;
  .filter-item {
    margin-right: 20px;
  }
  .btn {
    width: 12%;
    height: 48px;

    padding-left: 20px;
    display: flex;
    align-items: flex-start;
    /deep/ .el-button--small {
      padding: 8px 13px;
    }
  }
}
.option-bar {
  display: flex;
  justify-content: flex-start;
  padding: 0 10px;
}
/deep/.el-form-item__content {
  justify-content: flex-end;
}
/deep/.el-link--inner {
  font-weight: bold;
  color: red;
}
</style>

<template>
  <div class="box">
    <el-dialog
      :visible="true"
      v-if="true"
      width="900px"
      append-to-body
      :before-close="handleDialogClose"
    >
      <div class="app-container">
        <el-form
          class="search-body"
          :model="params"
          ref="queryForm"
          :inline="true"
          label-width="80px"
        >
          <el-form-item label="服务名称:" prop="company">
            <el-input
              v-model="params.company"
              size="small"
              placeholder="输入搜索关键词"
              style="width: 180px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <div class="information-body">
          <el-table
            :data="tableData"
            height="180"
            style="width: 100%; margin-bottom:40px"
            row-key="id"
            :stripe="true"
            border
            @selection-change="handleSelectionChange"
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column type="selection" />
            <el-table-column
              type="index"
              width="50"
              label="序号"
            ></el-table-column>
            <el-table-column label="服务名称" prop="resSerName"> </el-table-column>
            <el-table-column prop="remark" label="数据类别"> </el-table-column>
            <el-table-column prop="createDate" label="创建时间"> </el-table-column>
          </el-table>
        </div>
        <!-- <pagination
          v-show="total > 0"
          :total="total"
          :pageNo.sync="params.pageNo"
          :limit.sync="params.pageSize"
          @pagination="getList"
          class="pull-right"
        /> -->

        <el-table
          height="180"
          :data="multipleSelection"
          style="width: 100%"
          row-key="id"
          :stripe="true"
          border
          @selection-change="handleSelectionChange"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
        >
          <el-table-column type="selection" />
          <el-table-column
            type="index"
            width="50"
            label="序号"
          ></el-table-column>
          <el-table-column label="服务名称" prop="resSerName"> </el-table-column>
          <el-table-column prop="remark" label="数据类别"> </el-table-column>
          <el-table-column prop="createDate" label="创建时间"> </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">保 存</el-button>
          <el-button @click="handleDialogClose">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  SaveServicelist
} from "@/api/dataCenter/metaData.js";
export default {
  name: "SearchTable",
  data() {
    return {
      tableData: [],
      checkedData: undefined,
      multipleSelection: [],
    };
  },

  props: {
    // title: String,
    type: String,
    SelectedServiceData:Array
  },
  created() {
    this.getList();
    console.log(this.SelectedServiceData)
    this.tableData = this.SelectedServiceData
    console.log(this.tableData)
  },
  computed: {
    params: function () {
      if (this.type == "jg") {
        return {
          company: "",
          company2: "",
          pageNo: 1,
          pageSize: 15,
        };
      } else {
        return {
          company: "",
          company2: "",
          pageNo: 1,
          pageSize: 15,
        };
      }
    },
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    async getList() {
      // const reponse = await onlineList(this.params);
      const reponse = {
        data: {
          count: 3,
          list: [
            {
              id: 2,
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄",
            },
            {
              id: 3,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄",
            },
            {
              id: 4,
              date: "2016-05-03",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1516 弄",
            },
          ],
        },
      };
      this.tableData = reponse.data.count ? reponse.data.list : [];
      this.total = reponse.data.count;
      this.loading = false;
    },
    handleQuery() {
      this.params.pageNo = 1;
      this.getList();
    },

    handleSubmit: function () {
      this.$emit("getCheckedData", this.checkedData);

    },
    handleNodeClick: function (data, node, p) {
      this.checkedData = data;
    },
    handleDialogClose: function () {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  padding-top: 14px;
  overflow: auto;
  .el-input {
    margin-bottom: 14px;
  }
  .el-tree {
    height: 280px;
    overflow: auto;
  }
  ::v-deep .el-dialog__body {
    padding-bottom: 0;
  }

}
</style>

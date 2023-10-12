<template>
  <div class="box">
    <el-dialog
      :visible="true"
      v-if="true"
      width="900px"
      append-to-body
      :before-close="handleDialogClose"
    >
      <div class="app-container" v-if="type == 'jg'">
        <el-form
          class="search-body"
          :model="params"
          ref="queryForm"
          :inline="true"
          label-width="80px"
        >
          <el-form-item label="机构名称:" prop="company">
            <el-input
              v-model="params.company"
              size="small"
              placeholder="输入搜索关键词"
              style="width: 180px"
            ></el-input>
          </el-form-item>
          <el-form-item label="机构代码:" prop="company">
            <el-input
              v-model="params.company2"
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
        <div class="information-body jgCon">
          <el-table
            :data="tableData"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            :stripe="true"
            border
            @current-change="handleSelectChange"
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column
              label="选择"
              width="55"
              align="center"
              fixed="left"
            >
              <template slot-scope="scope">
                <el-radio v-model="tableradio" :label="scope.row"
                  ><i
                /></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              label="序号"
            ></el-table-column>
            <el-table-column label="机构名称" prop="name"> </el-table-column>
            <el-table-column prop="code" label="机构代码"> </el-table-column>
            <el-table-column prop="name" label="机构简称"> </el-table-column>
            <el-table-column prop="legalDirector" label="负责人姓名"> </el-table-column>
            <el-table-column prop="address" label="责任方地址"> </el-table-column>
            <el-table-column prop="name" label="责任方邮编"> </el-table-column>
            <el-table-column prop="name" label="责任方联系电话	">
            </el-table-column>
            <el-table-column prop="email" label="责任方电子邮箱">
            </el-table-column>
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
      </div>
      <div class="app-container" v-else-if="type == 'code'">
        <el-form
          class="search-body"
          :model="params"
          ref="queryForm"
          :inline="true"
          label-width="80px"
        >
          <el-form-item label="分类标准:" prop="company">
            <el-input
              v-model="params.company"
              size="small"
              placeholder="输入搜索关键词"
              style="width: 180px"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类名称:" prop="company">
            <el-input
              v-model="params.company2"
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
            style="width: 100%; margin-bottom: 10px"
            row-key="id"
            :stripe="true"
            border
            @current-change="handleSelectChange"
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column
              label="选择"
              width="55"
              align="center"
              fixed="left"
            >
              <template slot-scope="scope">
                <el-radio v-model="tableradio" :label="scope.row"
                  ><i
                /></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              label="序号"
            ></el-table-column>
            <el-table-column label="分类标准代码" prop="date">
            </el-table-column>
            <el-table-column prop="name" label="分类标准名称">
            </el-table-column>
            <el-table-column prop="name" label="分类编码"> </el-table-column>
            <el-table-column prop="name" label="分类名称"> </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          :pageNo.sync="params.pageNo"
          :limit.sync="params.pageSize"
          @pagination="getList"
          class="pull-right"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleDialogClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { searchTableData } from "@/api/dataCenter/metaData.js";
export default {
  name: "SearchTable",
  data() {
    return {
      tableData: [],
      checkedData: undefined,
      tableradio: "",
    };
  },

  props: {
    // title: String,
    type: String,
    showType:String
  },
  created() {
    this.getList();
  },
  computed: {
    params: function () {
      // if (this.type == "jg") {
      //   return {
      //     company: "",
      //     company2: "",
      //     pageNo: 1,
      //     pageSize: 15,
      //   };
      // } else {
      //   return {
      //     company: "",
      //     company2: "",
      //     pageNo: 1,
      //     pageSize: 15,
      //   };
      // }
      return {
          company: "",
          company2: "",
          pageNo: 1,
          pageSize: 15,
        };
    },
  },
  methods: {
    handleSelectChange(currentRow) {
      this.checkedData = currentRow;
    },
    async getList() {
      console.log(this.showType)
       const reponse = await searchTableData(this.showType);
    //   console.log(reponse)
      // const reponse = {
      //   data: {
      //     count: 3,
      //     list: [
      //       {
      //         id: 2,
      //         date: "2016-05-04",
      //         name: "王小虎1",
      //         address: "上海市普陀区金沙江路 1517 弄",
      //       },
      //       {
      //         id: 3,
      //         date: "2016-05-01",
      //         name: "王小虎2",
      //         address: "上海市普陀区金沙江路 1519 弄",
      //       },
      //       {
      //         id: 4,
      //         date: "2016-05-03",
      //         name: "王小虎3",
      //         address: "上海市普陀区金沙江路 1516 弄",
      //       },
      //     ],
      //   },
      // };
       this.tableData = reponse.data.data ? reponse.data.data : [];
      // console.log(this.tableData)
      // this.total = reponse.data.count;
       this.loading = false;
    },
    handleQuery() {
      this.params.pageNo = 1;
      this.getList();
    },

    handleSubmit: function () {
      this.$emit("getCheckedData", this.checkedData);
    },
    // handleNodeClick: function (data, node, p) {
    //   this.checkedData = data;
    // },
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
}
.jgCon{height: 400px; overflow: auto;}
</style>

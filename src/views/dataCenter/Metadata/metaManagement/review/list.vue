<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="params"
      ref="queryForm"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="元数据名称:" prop="name">
        <el-input
          v-model="params.name"
          size="small"
          placeholder="输入搜索关键词"
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据类型:" prop="resCat">
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('resCat')"
          :searchValue="params.resCat"
        />
      </el-form-item>
      <el-form-item label="数据提供方:" prop="cntProvider">
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('cntProvider')"
          :searchValue="params.cntProvider"
        />
      </el-form-item>
      <el-form-item label="数据共享范围:" prop="getShareExt">
        <el-select v-model="params.getShareExt" size="small" style="width: 180px">
          <el-option
            v-for="item in shareExtentCodeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" type="primary"
          plain
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8 container-state">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-upload2"
          size="mini"
          v-if="status == '02'"
          @click="returnAll"
          :disabled="multipleSelection.length == 0"
          >批量退回</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          @click="passAll"
          v-if="status == '01'"
          :disabled="multipleSelection.length == 0"
          >批量通过</el-button
        >
      </el-col>

      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>
    <div class="information-body">
      <el-table
        :data="tableData"
        class="container-table"
        row-key="id"
        :stripe="true"
        border
        @selection-change="handleSelectionChange"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="name" label="元数据名称">
          <template slot-scope="scope">
            <a
              class="linStyle"
              style="padding-left: 20px"
              @click="handleView(scope.row)"
            >
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="resCat.classifyName" label="数据类别">
        </el-table-column>
        <el-table-column prop="cntProvider.name" label="数据提供方">
        </el-table-column>
        <el-table-column prop="provideWay" label="数据共享范围">
        </el-table-column>
        <el-table-column prop="auditState" label="审核状态">
        </el-table-column
        ><el-table-column prop="applyBy" label="提交人">
        </el-table-column
        ><el-table-column prop="createDate" label="提交时间">
        </el-table-column>
        <el-table-column
          prop="auditBy"
          label="审核人"
          v-if="status == '02' || status == '03'"
        >
        </el-table-column
        ><el-table-column
          prop="auditDate"
          label="审核时间"
          v-if="status == '02' || status == '03'"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          min-width="80"
          fixed="right"
          v-if="status == '01'"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-top-right"
              @click="handlePass(scope.row)"
              >通过</el-button
            >
            <!-- <el-button
            v-if="status == '02'"
              size="mini"
              type="text"
              icon="el-icon-top-left"
              class="delete-state-btn"
              @click="handleReturn(scope.row)"
              >退回</el-button
            > -->
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          min-width="80"
          fixed="right"
          v-if="status == '02'"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-top-left"
              class="delete-state-btn"
              @click="handleReturn(scope.row)"
              >退回</el-button
            >
          </template>
        </el-table-column>
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
     <SearchBox
      v-if="isSearchBoxShow"
      title="选择父id"
      :data="data"
      :showType="seacherBarType"
      @getCheckedData="getCheckedData"
      @close="close"
    />
  </div>
</template>
<script>
import {
  getListAudit,
  RecordPass,
  BatchPass,
  getResourceDirectoryTree,
  getprovideTree,
  getDatalist
  
} from "@/api/dataCenter/metaData.js";
import SearchBar from "../../components/searchBar.vue";
import SearchBox from "../../components/searchBox.vue";
export default {
  name: "List",
  data() {
    return {
      seacherBarType:"",
      tableData: [],
      total: 0,
      isSearchBoxShow: false,
      curValue: "",
      params: {
        name: "",
        resCat: "",
        cntProvider: "",
        getShareExt: "",
        pageNo: 1,
        pageSize: 15,
      },
      multipleSelection: [],
      shareExtentCodeList: [],
      data: []
    };
  },
  props: {
    status: String,
  },
  created: function () {
    this.getList();
    this.getDataTypeList("shareExtentCode");
  },
  components: {
    SearchBar,
    SearchBox,
  },

  methods: {
    close: function () {
      this.isSearchBoxShow = false;
    },
       handleView: function (row) {
      this.$emit("changeCom", "view", "元数据元素查看", row.id);
    },
    getDataTypeList: function (type) {
      getDatalist({
        type,
      }).then((res) => {
        let str = `${type}List`;
        this[str] = res.data;
      });
    },
    getCheckedData: function (data) {
      console.log(data)
      if(this.curValue == "cntProvider"){
        this.params[this.curValue] = data.label;
        this[this.curValue] = data.label;
      }else{
        this.params[this.curValue] = data.name;
        this[this.curValue] = data.name;
      }
      this.isSearchBoxShow = false;
    },
    handleSearch: function (value) {
      if (value == "resCat") {
        this.seacherBarType = "resCat"
        this.getResourceDirectoryTree();
      } else if ((value = "cntProvider")) {
        this.seacherBarType = "cntProvider"
        this.getprovideTree();
      }
      //console.log(value)
      this.curValue = value;
      this.isSearchBoxShow = true;
    },
    getResourceDirectoryTree() {
      getResourceDirectoryTree().then((res) => {
        console.log(res)
        this.data = res.data.length ? res.data : [];
      });
    },
    getprovideTree() {
      getprovideTree().then((res) => {
        this.data = res.data.length ? res.data : [];
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
     // this.multipleSelection = multipleSelection.map(item => item.id)
      //console.log(this.multipleSelection)
    },

    handleQuery() {
      this.params.pageNo = 1;
      this.getList();
    },
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    returnAll(type, row) {
      let ids = this.getSetletedData();
      this.$confirm("是否要批量退回？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        BatchPass({ 
          ids,
          auditState:"02",
          isPass:"1"
         }).then((reponse) => {
          if (reponse.code == 200) {
           this.getList();
          }
        });
      });
    },
    getSetletedData: function () {
      let ids;
      let arr = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.id);
      });
      ids = arr.join(",");
      return ids;
    },
    passAll(type, row) {
      let ids = this.getSetletedData();
      this.$confirm("是否要批量通过？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        BatchPass({ 
          ids,
          auditState:"01",
          isPass:"0"
         }).then((reponse) => {
          if (reponse.code == 200) {
           this.getList();
          }
        });
      });
    },

    async getList() {
      this.params.auditState = this.status
      const reponse = await getListAudit(this.params);
      this.tableData = reponse.data.page.count ? reponse.data.page.list : [];
      console.log(this.tableData)
      this.total = reponse.data.page.count;
      this.loading = false;
    },

    handlePass: function (row) {
      this.$confirm("是否通过审核？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          RecordPass({ 
            id:row.id,
            auditState:row.auditState,
            isPass:"0"
             }).then((reponse) => {
            if (reponse.code == 200) {
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },
    handleReturn: function (row) {
      this.$confirm("确认要【退回】该元数据信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          RecordPass({ 
            id:row.id,
            auditState:"02",
            isPass:"1"
          }).then((reponse) => {
            if (reponse.code == 200) {
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
.ellipsis {
  @include textOmit;
}

a {
  color: rgb(64, 158, 255);
}
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
.container-state {
  padding-bottom: 10px;
}
</style>
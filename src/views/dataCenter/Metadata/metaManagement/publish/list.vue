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
          type="success"
          plain
          size="mini"
          v-if="status == '11'"
          @click="publishAll"
          :disabled="multipleSelection.length == 0"
          >批量发布</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="returnAll"
          v-if="status == '12'"
          :disabled="multipleSelection.length == 0"
          >批量撤回</el-button
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
        <el-table-column prop="releaseState" label="发布状态">
        </el-table-column
        ><el-table-column prop="applyBy" label="提交人">
        </el-table-column
        ><el-table-column prop="applyDate" label="提交时间">
        </el-table-column>
        <el-table-column
          prop="auditBy"
          label="审核人"
          v-if="status == '12' || status == '13'"
        >
        </el-table-column
        ><el-table-column
          prop="auditDate"
          label="审核时间"
          v-if="status == '12' || status == '13'"
        >
        </el-table-column>
        <el-table-column
          prop="releaseBy"
          label="发布人"
          v-if="status == '12'"
        >
        </el-table-column>
        <el-table-column
          prop="releaseDate"
          label="发布时间"
          v-if="status == '12'"
        ></el-table-column>
        <el-table-column
          prop="unreleaseBy"
          label="撤销人"
          v-if="status == '13'"
        >
        </el-table-column>
        <el-table-column
          prop="unreleaseDate"
          label="撤销时间"
          v-if="status == '13'"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          min-width="80"
          fixed="right"
          v-if="status == '11'"
        >
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-paperclip"
              @click="selectService(scope.row)"
              >关联服务</el-button
            > -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-files"
              class="success-state-btn"
              @click="publish(scope.row)"
              >发布</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              class="warnning-state-btn"
              @click="review(scope.row)"
              >预览</el-button> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          min-width="80"
          fixed="right"
          v-if="status == '12'"
        >
          <template slot-scope="scope">
	    <el-button
              size="mini"
              type="text"
              icon="el-icon-paperclip"
              @click="selectService(scope.row)"
              >关联服务</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-files"
              class="success-state-btn"
              @click="cancelPublish(scope.row)"
              >撤销发布</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              class="warnning-state-btn"
              @click="handleReturn(scope.row)"
              >预览</el-button
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
    <SelectedService
      v-if="isSelectedServiceShow"
      @getCheckedData="getCheckedData2"
      :SelectedServiceData="SelectedServiceData"
      @close="close2"
    />
   <SearchBox
      v-if="isSearchBoxShow"
      title="选择父id"
      :showType="seacherBarType"
      :data="data"
      @getCheckedData="getCheckedData"
      @close="close"
    />
  </div>
</template>
<script>
import {
  getMetaDataRelease,
  Release,
  BatchRelease,
  getResourceDirectoryTree,
  getprovideTree,
  getDatalist,
  ListServiceCheck  
} from "@/api/dataCenter/metaData.js";
import SearchBar from "../../components/searchBar.vue";
import SearchBox from "../../components/searchBox.vue";
import SelectedService from "../../components/selectedService.vue";
export default {
  name: "List",
  data() {
    return {
      seacherBarType:"",
      tableData: [],
      total: 0,
      isSearchBoxShow: false,
      isSelectedServiceShow: false,
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
      fwList: [
        {
          value: "1",
          label: "fffggg",
        },
      ],
      data:[],
      SelectedServiceData:[]
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
    SelectedService,
  },
  methods: {
    close2: function () {
      this.isSelectedServiceShow = false;
    },
    close: function () {
      this.isSearchBoxShow = false;
    },
    getCheckedData2: function () {
      //ksksks
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
        this[this.curValue] = data.id;
      }else{
        this.params[this.curValue] = data.name;
        this[this.curValue] = data.id;
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
      console.log(value)
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
      this.multipleSelection = val;
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "元数据元素查看", row.id);
    },
    handleQuery() {
      console.log(1)
      console.log(this.params)
      this.params.pageNo = 1;
      this.getList();
    },
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    publishAll: function () {
      let ids = this.getSetletedData();
      this.$confirm("是否要批量发布？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        BatchRelease({ 
          ids,
          releaseState:"11",
          isRelease:"0"
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
    returnAll(type, row) {
      let ids = this.getSetletedData();
      this.$confirm("是否要批量撤回？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        BatchRelease({
          ids,
          releaseState:"12",
          isRelease:"1"
         }).then((reponse) => {
          if (reponse.code == 200) {
            this.getList();
          }
        });
      });
    },
    async getList() {
      this.params.releaseState = this.status
      console.log(this.params.releaseState )
       const reponse = await getMetaDataRelease(this.params);
       console.log(reponse)
      this.tableData = reponse.data.page.count ? reponse.data.page.list : [];
      this.total = reponse.data.page.count;
      this.loading = false;
    },

    publish: function (row) {
      this.$confirm("确认要【发布】该元数据信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Release({
             id:row.id,
             releaseState:"11",
             isRelease:"0"
             }).then((reponse) => {
            if (reponse.code == 200) {
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },
    review: function () {
      //预览暂时先不做
    },
    cancelPublish: function (row) {
      this.$confirm("确认要【撤销】该元数据信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Release({ 
            id:row.id,
            releaseState:"12",
            isRelease:"1"
           }).then((reponse) => {
            if (reponse.code == 200) {
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },
    selectService: function (row) {
      this.isSelectedServiceShow = true;
      ListServiceCheck({
             id:row.id,
             }).then((reponse) => {
            if (reponse.code == 200) {
              this.SelectedServiceData = reponse.data.page.count ? reponse.data.page.list : [];
              console.log(this.SelectedServiceData)
            }
          });
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
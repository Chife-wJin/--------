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
        <!-- <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('resCat')"
          :searchValue="params.resCat"
        /> -->
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('resCat')"
          :searchValue="resCat"
        />
      </el-form-item>
      <el-form-item label="数据提供方:" prop="cntProvider">
        <!-- <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('cntProvider')"
          :searchValue="params.cntProvider"
        /> -->
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('cntProvider')"
          :searchValue="cntProvider"
        />
      </el-form-item>
      <el-form-item label="数据共享范围:" prop="getShareExt">
        <el-select
          v-model="params.getShareExt"
          size="small"
          style="width: 180px"
        >
          <el-option
            v-for="item in shareExtentCodeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态:" prop="auditState">
        <el-select
          v-model="params.auditState"
          size="small"
          style="width: 180px"
        >
          <el-option
            v-for="item in record_statusList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select> </el-form-item
      ><el-form-item label="发布状态:" prop="releaseState">
        <el-select
          v-model="params.releaseState"
          size="small"
          style="width: 180px"
        >
          <el-option
            v-for="item in record_status_releaseList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
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
          type="primary"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDeleteAll"
          :disabled="
            multipleSelection.length == 1 || multipleSelection.length == 0
          "
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleNew"
          >创建</el-button
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
        default-expand-all
        @selection-change="handleSelectionChange"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="元数据名称">
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
        <el-table-column prop="resCat.classifyName" label="数据类别" >
        </el-table-column>
        <el-table-column prop="cntProvider.name" label="数据提供方">
        </el-table-column>
        <el-table-column prop="provideWay" label="数据共享范围">
        </el-table-column>
        <el-table-column prop="auditState" label="审核状态">
        </el-table-column
        ><el-table-column prop="releaseState" label="发布状态">
        </el-table-column
        ><el-table-column prop="createDate" label="创建时间">
        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              class="delete-state-btn"
              @click="handleDelete(scope.row)"
              >删除</el-button
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
    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :auto-upload="false"
        :http-request="httpRequest"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
        </div> -->
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
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
  getMetaList,
  getDatalist,
  getResourceDirectoryTree,
  getprovideTree,
  metaRecordDelete,
  metaRecordBatchDelete,
  uploadFile,

} from "@/api/dataCenter/metaData.js";
import {
 dictListType
} from "@/api/dataCenter/dataGovernance.js";
import { getToken } from "@/utils/auth";
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
      resCat: "",
      cntProvider: "",
      params: {
        name: "",
        resCat: "",
        cntProvider: "",
        getShareExt: "",
        auditState: "",
        releaseState: "",
        pageNo: 1,
        pageSize: 15,
      },
      multipleSelection: [],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/center/sys/user/import",
      },
      releaseStateList: [
        {
          value: "1",
          label: "pk",
        },
      ],
      record_statusList: [],
      record_status_releaseList: [],
      shareExtentCodeList: [],
      data: [],
    };
  },
  created: function () {
    this.getList();
     this.getDataTypeList("shareExtentCode");
    this.getRecordDict()
  },
  components: {
    SearchBar,
    SearchBox,
  },
  methods: {
    getDataTypeList: function (type) {
      getDatalist({
        type,
      }).then((res) => {
        let str = `${type}List`;
        this[str] = res.data;
      });
    },
   async getRecordDict() {
      const record_statusListReponse = await dictListType({ type: "record_status" });
      this.record_statusList = record_statusListReponse.data;
     // console.log(this.record_statusList)
      const record_status_releaseListReponse = await dictListType({ type: "record_status_release" });
      this.record_status_releaseList = record_status_releaseListReponse.data;
   },
    close: function () {
      this.isSearchBoxShow = false;
    },
    getCheckedData: function (data) {
      console.log(this.curValue)
      if(this.curValue == "cntProvider"){
        // this.params[this.curValue] = data.label;
        // this[this.curValue] = data.id;
        this.params[this.curValue] = data.id;
        this[this.curValue] = data.label;
      }else{
        // this.params[this.curValue] = data.name;
        // this[this.curValue] = data.id;
        this.params[this.curValue] = data.id;
        this[this.curValue] = data.name;
      }
      this.isSearchBoxShow = false;
    },
    handleSearch: function (value) {
      if (value == "resCat") {
        this.seacherBarType = "resCat"
        this.getResourceDirectoryTree();
      } else if ((value == "cntProvider")) {
        this.seacherBarType = "cntProvider"
        this.getprovideTree();
      }
      this.curValue = value;
      this.isSearchBoxShow = true;
    },
    getResourceDirectoryTree() {
      getResourceDirectoryTree().then((res) => {
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
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    // handleFileSuccess(response, file, fileList) {
    //   this.upload.open = false;
    //   this.upload.isUploading = false;
    //   this.$refs.upload.clearFiles();
    //   this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
    //  // this.getUserListb();
    // },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //文件上传成功处理
    httpRequest (params) {
        console.log(params.file)//拿到上传的文件
        var formdata = new FormData()
        formdata.append('file', params.file)
        uploadFile(formdata).then((res) => {
         // console.log(res)
          if (res.code === 200) {
            this.$message.success('文件导入成功')
            this.upload.open = false;
          }else{
            this.$message.error('文件导入失败')
          }
        })
      },
    handleQuery() {
      this.params.pageNo = 1;
      this.getList();
      console.log(this.params)
    },
     resetQuery() {
      this.resetFieldsTap("queryForm");
      this.resCat = ""
      this.cntProvider = ""
      this.handleQuery();
      // console.log(this.params)
    },

    handleDeleteAll(type, row) {
      let ids;
      let arr = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.id);
      });
      ids = arr.join(",");
      //console.log(ids)
      this.$confirm("确认要删除选择的元数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        metaRecordBatchDelete({ ids }).then((reponse) => {
          if (reponse.code == 200) {
            this.$message({
              message: reponse.msg,
              type: "success",
            });
            this.getList();
          }
        });
      });
    },
    handleDelete(row) {
      let id = row.id
      this.$confirm("确认要删除该元数据信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          metaRecordDelete({ id }).then((reponse) => {
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
    async getList() {
      const reponse = await getMetaList(this.params);
      // console.log(reponse)
      this.tableData = reponse.data.page.count ? reponse.data.page.list : [];
      this.total = reponse.data.page.count;
      this.loading = false;
    },
    handleNew: function () {
      this.$emit("changeCom", "new", "元数据添加");
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "元数据修改", row.id);
     // console.log(row.id)
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "元数据查看", row.id);
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
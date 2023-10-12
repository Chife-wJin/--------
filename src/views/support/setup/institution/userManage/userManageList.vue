<template>
  <div>
    <div class="app-container">
      <el-form
        ref="form"
        :model="geoCategoryParams"
        :inline="true"
        class="query-form"
        v-elResize
      >
        <el-form-item label="归属单位：">
          <!-- <el-cascader
            filterable
            clearable
            placeholder="请选择归属单位"
            v-model="geoCategoryParams.companyId"
            :options="companyOptions"
            :props="casProps"
            size="small"
            @change="deptClose"
          ></el-cascader> -->
          <treeselect
            v-model="geoCategoryParams.companyId"
            :options="companyOptions"
            :disable-branch-nodes="true"
            :normalizer="normalizer"
            noChildrenText="无"
            :disableBranchNodes="false"
            @close="deptClose"
            placeholder="请选择归属单位"
          />
        </el-form-item>
        <el-form-item label="归属部门：">
          <!-- <el-cascader
            clearable
            filterable
            placeholder="请选择归属部门"
            v-model="geoCategoryParams.officeId"
            :options="branchOptions"
            :props="casProps"
            size="small"
            @change="officeClose"
          ></el-cascader> -->
          <treeselect
            v-model="geoCategoryParams.officeId"
            :options="companyOptions"
            :disable-branch-nodes="true"
            :normalizer="normalizer"
            noChildrenText="无"
            :disableBranchNodes="false"
            @close="officeClose"
            placeholder="请选择归属部门"
          />
        </el-form-item>
        <el-form-item label="登录名：">
          <el-input
            placeholder="请输入登录名"
            size="small"
            v-model="geoCategoryParams.loginName"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input
            size="small"
            placeholder="请输入姓名"
            v-model="geoCategoryParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
          >
            查询
          </el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <avue-crud
        ref="crud"
        :data="userList"
        :option="option"
        :table-loading="loading"
        @refresh-change="refresh"
        @selection-change="handleSelectionChange"
        @search-change="handleQuery"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="small"
            @click="handleNew"
            >新增</el-button
          >
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
          ><el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            @click="handleDelete(1)"
            :disabled="
              multipleSelection.length > 1 || multipleSelection.length == 0
            "
            >删除</el-button
          ><el-button
            type="warning"
            plain
            icon="el-icon-upload2"
            size="small"
            @click="handleImport"
            >导入</el-button
          ><el-button
            type="info"
            plain
            icon="el-icon-download"
            size="small"
            @click="handleExport"
            >导出</el-button
          >
        </template>
        <template slot="menu" slot-scope="scope">
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
        </template>
      </avue-crud>
      <!-- <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
        :stripe="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <template v-for="(item, index) in headerList">
          <el-table-column
            v-bind:key="index"
            :prop="item.prop"
            :label="item.name"
            v-if="!item.hide"
            :fixed="item.fixed"
            :sortable="item.sort"
            :filters="handleFilters()"
            :filter-method="filterHandler"
          ></el-table-column>
        </template>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(2, scope.row)"
              icon="el-icon-edit"
              type="text"
              >修改</el-button
            >
            <el-button
              size="small"
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(2, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->
      <pagination
        v-show="total > 0"
        :total="total"
        :pageNo.sync="geoCategoryParams.pageNo"
        :limit.sync="geoCategoryParams.pageSize"
        @pagination="getUserListb"
      />
    </div>
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
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
          <el-link
            type="info"
            style="font-size: 12px; color: #red; font-weight: bold"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  userDelete,
  userTemplate,
  userExport,
} from "@/api/styem/user";
import { officeTreeData } from "@/api/styem/dept";
import { MessageBox } from "element-ui";
import { getToken } from "@/utils/auth";
import { downLoadZip } from "@/utils/zipdownload";
import Bus from "@/utils/vueBus";
export default {
  props: {
    deptId: {
      type: Object,
      default: () => {},
    },
    deptOptions: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      testTable: [],
      option: {
        delBtn: false, // 行删除按钮
        editBtn: false, // 行编辑按钮
        selection: true,
        refreshBtn: true, // 刷新按钮
        addBtn: false, //添加按钮
        searchBtn: true,
        column: [
          {
            prop: "companyName",
            label: "归属单位",
            hide: false,
            fixed: false,
            sort: false,
            filter: false,
          },
          {
            prop: "officeName",
            label: "归属部门",
            hide: false,
            fixed: false,
            sort: false,
            filter: false,
          },
          {
            prop: "loginName",
            label: "登录名",
            hide: false,
            fixed: false,
            sort: false,
            filter: false,
          },
          {
            prop: "name",
            label: "姓名",
            hide: false,
            fixed: false,
            sort: false,
            filter: false,
          },
          {
            prop: "phone",
            label: "电话",
            hide: false,
            fixed: false,
            sort: false,
            filter: false,
          },
          {
            prop: "mobile",
            label: "手机",
            hide: false,
            fixed: false,
            sort: false,
            filter: false,
          },
        ],
      },
      arr: [
        { text: "家", value: "家" },
        { text: "公司", value: "公司" },
      ],
      multipleSelection: [],
      casProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      geoCategoryParams: {
        deptName: undefined,
        id: undefined,
        companyId: null,
        officeId: null,
        loginName: undefined,
        name: undefined,
        pageNo: 1,
        pageSize: 10,
      },
      loading: true,
      userList: undefined,
      total: 0,
      companyOptions: [],
      branchOptions: [],
      normalizer(node) {
        return {
          label: node.name,
        };
      },
      // 用户导入参数
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
    };
  },
  created() {
    this.getUserList(this.geoCategoryParams);
    // this.tableHeaderInit();
  },
  computed: {
    headerList() {
      return this.$store.state.tableSetting.headerList;
    },
  },
  watch: {
    deptOptions: {
      handler(newVal) {
        // const newVObj = JSON.parse(JSON.stringify(newVal));
        // for (const key in newVObj) {
        //   delete newVObj[key].children;
        //   this.companyOptions.push(newVObj[key]);
        // }
        this.companyOptions = newVal || [];
      },
      deep: true,
      immediate: true,
    },
    deptId: {
      handler(deptObj) {
        if (deptObj) {
          const { id } = deptObj.value;
          let param = JSON.parse(JSON.stringify(this.geoCategoryParams));
          param.officeId = id;
          this.getUserList(param);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    refresh: function () {
      this.getUserList(this.geoCategoryParams);
    },
    resetQuery: function () {
      for (let i in this.geoCategoryParams) {
        if (!["pageNo", "pageSize"].includes(i)) {
          this.$set(this.geoCategoryParams, i, undefined);
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deptClose(value) {
      // if (!value) {
      //   this.branchOptions = [];
      //   return;
      // }
      // this.getOfficeTreeData(this.geoCategoryParams.companyId);
    },
    officeClose(value) {
      if (!value) {
        this.geoCategoryParams.officeId = undefined;
      }
    },
    async getOfficeTreeData(companyId) {
      const reponse = await officeTreeData({ companyId, type: 2 });
      const menu = this.handleTree(reponse.data, "id", "pId", "children", "1");
      this.branchOptions = menu;
    },
    async getUserList(param) {
      this.loading = true;
      const reponse = await listUser(param);
      this.userList = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    async getUserListb() {
      this.loading = true;
      const reponse = await listUser(this.geoCategoryParams);
      this.userList = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    async handleQuery() {
      this.geoCategoryParams.pageNo = 1;
      this.getUserList(this.geoCategoryParams);
    },
    handleEdit(type, row) {
      let id;
      if (type == "1") {
        id = this.multipleSelection[0].id;
      } else {
        console.log(row);
        id = row.id;
      }
      this.$emit("handleSeeAmend", id);
    },
    handleNew() {
      this.$emit("handleSeeAmend", "");
    },
    handleDelete(type, row) {
      let ids;
      if (type == "1") {
        let arr = [];
        this.multipleSelection.forEach((item) => {
          arr.push(item.id);
        });
        ids = arr.join(",");
      } else {
        ids = row.id;
      }
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        userDelete({ ids }).then((reponse) => {
          if (reponse.code == 200) {
            this.getUserList(this.geoCategoryParams);
          }
        });
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.geoCategoryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        downLoadZip("/center/sys/user/export", queryParams);
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      downLoadZip("/center/sys/user/import/template");
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getUserListb();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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
    height: 40px;
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
  position: relative;
  top: 39px;
  z-index: 1000;
}
/deep/ .el-form-item {
  margin-bottom: 10px;
}
/deep/.el-link--inner {
  font-weight: bold;
}
/deep/ .el-form-item__label {
  padding: 0;
}
/deep/ .el-checkbox__inner {
  border: 1px solid #dcdfe6;
}
/deep/ .vue-treeselect__control {
  width: 180px;
}
</style>

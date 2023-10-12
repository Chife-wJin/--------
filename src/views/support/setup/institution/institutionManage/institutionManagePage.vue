<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" v-elResize>
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
    </el-row>
    <el-table
      :data="officeListData"
      v-loading="loading"
      border
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :max-height="pageHeight - 200"
    >
      <el-table-column
        label="机构名称"
        class-name="table-td-left"
        show-overflow-tooltip
        min-width="300"
      >
        <template slot-scope="scope">
          <span @click="handleEdit(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="areaName" label="归属区域" width="180" align="center"></el-table-column>
        <el-table-column prop="code" label="机构编码" width="180"></el-table-column> -->
      <el-table-column label="组织类型" width="200">
        <template slot-scope="scope">
          <dict-tag :options="orgTypeArray" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="320">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.row)"
            icon="el-icon-edit"
            type="text"
            >修改</el-button
          >
          <el-button
            size="small"
            icon="el-icon-plus"
            type="text"
            @click="handleAddLower(scope.row)"
            >添加下级机构</el-button
          >
          <el-button
            @click="handleDelete(scope.row)"
            type="text"
            size="small"
            class="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTxt"
      :visible.sync="open"
      width="1200px"
      :before-close="handleDialogCheckClose"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="dialog-form"
        label-width="136px"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="上级单位：">
              <treeselect
                v-model="form.parentId"
                :options="officeListData"
                :disableBranchNodes="false"
                :normalizer="normalizer"
                noChildrenText="无"
                placeholder="请选择上级单位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属区域：" prop="areaId">
              <treeselect
                v-model="form.areaId"
                :options="areaListOptions"
                :load-options="loadAreaOptions"
                :disable-branch-nodes="true"
                noChildrenText="无"
                :autoLoadRootOptions="false"
                :searchable="false"
                :disableBranchNodes="false"
                placeholder="请选择归属区域"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="机构名称：" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构编码：" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="机构类型：" prop="type">
              <el-select v-model="form.type">
                <el-option
                  v-for="item in orgTypeArray"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构级别：" prop="grade">
              <el-select v-model="form.grade">
                <el-option
                  v-for="item in officeGradeArray"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <!-- <el-col :span="12">
            <el-form-item label="单位名称：" prop="companyId">
              <el-select v-model="form.companyId">
                <el-option
                  v-for="item in companyList"
                  :value="item.id"
                  :label="item.companyName"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="排序：" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                class="inputNum"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否可用：" prop="useable">
              <el-select v-model="form.useable">
                <el-option
                  v-for="item in yesNoArray"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span class="help-inline" style="color: #aaa; display: block"
                >“是”代表此账号允许登陆，“否”则表示此账号不允许登陆</span
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系地址：" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- <el-row :gutter="24" :span="12">
          <el-form-item label="备注：" prop="remarks">
            <el-input type="textarea" v-model="form.remarks"></el-input>
          </el-form-item>
        </el-row> -->
        <!-- <el-row :gutter="24">
        <el-form-item class="tab-list-state">
          <el-button type="primary" @click="onSubmit('form')"  v-formScroll
          >保存</el-button>
          <el-button @click="handleBackClick">返回</el-button>
        </el-form-item>
      </el-row> -->
        <el-row>
          <el-form-item class="dialog-footer">
            <el-button
              size="medium"
              type="primary"
              @click="onSubmit('form')"
              v-formScroll
              >保存</el-button
            >
            <el-button size="medium" @click="handleDialogCheckClose"
              >取消</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { officeList, officeDelete } from "@/api/styem/dept";
import { dictListType } from "@/api/styem/dict/type.js";
import {
  officeSave,
  areaTreeNew,
  officeGetOfficeById,
  areaByPidAndType,
} from "@/api/styem/dept";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      loading: true,
      open: false,
      dialogTxt: "新增",
      form: {
        id: undefined,
        parentId: undefined,
        areaId: undefined,
        name: undefined,
        code: undefined,
        sort: undefined,
        // companyId: undefined,
        type: undefined,
        grade: undefined,
        useable: "1",
        // address: undefined,
        // remarks: undefined,
      },
      areaId: "",
      normalizer(node) {
        return {
          label: node.name,
        };
      },
      officeListData: [],
      areaListOptions: [],
      // companyList: [],
      orgTypeArray: [],
      officeGradeArray: [],
      // yesNoArray: [],
      rules: {
        name: [{ required: true, message: "输入名称", trigger: "blur" }],
        code: [{ required: true, message: "输入组织编码", trigger: "blur" }],
        type: [{ required: true, message: "选择机构类型", trigger: "change" }],
        grade: [{ required: true, message: "选择机构级别", trigger: "change" }],
        sort: [{ required: true, message: "输入序号", trigger: "blur" }],
        areaId: [{ required: true, message: "请选择区域", trigger: "change" }],
      },
    };
  },
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getOfficeList();
    this.getdictList1();
    this.getdictList2();
    // this.getdictList3();
    this.getAreaList();
  },
  methods: {
    async getOfficeList() {
      this.loading = true;
      const reponse = await officeList();
      const menu = this.handleTree(
        reponse.data,
        "id",
        "parentId",
        "children",
        "0"
      );
      this.officeListData = menu;
      this.loading = false;
    },
    async getdictList1() {
      const reponse = await dictListType({ type: "sys_office_type" });
      this.orgTypeArray = reponse.data;
    },
    async getdictList2() {
      const reponse = await dictListType({
        type: "sys_office_grade",
      });
      this.officeGradeArray = reponse.data;
    },
    // async getdictList3() {
    //   const reponse = await dictListType({ type: "yes_no" });
    //   this.yesNoArray = reponse.data;
    // },
    handleNew() {
      this.open = true;
      this.dialogTxt = "新增";
      this.handleClearForm();
      this.form.useable = "1";
      this.form.type = "1";
    },
    handleAddLower(row) {
      this.handleClearForm();
      const { id } = row;
      this.open = true;
      this.dialogTxt = "修改";
      this.form.parentId = id;
      this.form.useable = "1";
      this.form.type = "1";
    },
    handleEdit(row) {
      const { id } = row;
      this.open = true;
      this.dialogTxt = "修改";
      this.getOfficeGetOffice(id);
    },
    handleDelete(row) {
      const ids = row.id;
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          officeDelete({ ids }).then((reponse) => {
            if (reponse.code == 200) {
              this.getOfficeList();
            }
          });
        })
        .catch((e) => e);
    },
    async getAreaList() {
      const reponse = await areaTreeNew();
      const areaListOptions = [];
      for (const item in reponse.data) {
        const subject = reponse.data[item];
        const temp = {
          id: subject.id,
          label: subject.label,
          children: null,
        };
        areaListOptions.push(temp);
      }
      this.areaListOptions = areaListOptions;
    },
    loadAreaOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        areaTreeNew({ parentId: parentNode.id }).then((reponse) => {
          const userOptions = [];
          for (const item in reponse.data) {
            const subject = reponse.data[item];
            const temp = {
              id: subject.id,
              label: subject.label,
              children: null,
            };
            userOptions.push(temp);
          }
          parentNode.children = userOptions;
          callback();
        });
      }
    },
    async getOfficeGetOffice(id) {
      const reponse = await officeGetOfficeById({ id });
      const subject = reponse.data;
      this.form.id = subject.id;
      this.form.parentId = subject.parentId;
      this.form.areaId = subject.areaName;
      this.areaId = subject.areaId;
      this.form.name = subject.name;
      this.form.code = subject.code;
      this.form.sort = subject.sort;
      // this.form.companyId = subject.companyId;
      this.form.type = subject.type;
      this.form.grade = subject.grade;
      this.form.useable = subject.useable;
      // this.form.address = subject.address;
      // this.form.remarks = subject.remarks;
      if (subject.parentId == 0) {
        this.form.parentId = undefined;
      }
    },
    onSubmit(formName) {
      if (!this.form.parentId) {
        this.form.parentId = 0;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (isNaN(this.form.areaId)) {
            this.form.areaId = this.areaId;
          }
          officeSave(this.form).then((reponse) => {
            if (reponse.code == 200) {
              this.open = false;
              this.getOfficeList();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDialogCheckClose() {
      this.open = false;
      this.handleClearForm();
    },
    handleClearForm() {
      this.handleformClear("form");
      this.form.id = undefined;
      this.form.parentId = undefined;
      this.form.areaId = undefined;
      this.form.name = undefined;
      this.form.code = undefined;
      // this.form.companyId = undefined;
      this.form.type = undefined;
      this.form.grade = undefined;
      this.form.useable = "1";
      this.form.sort = undefined;
      // this.form.address = undefined;
      // this.form.remarks = undefined;
    },
    setUrlPath(file) {
      this.form[file.fromKey] = file.fileId;
    },
    deleteServeFile(file) {
      this.form[file.fromKey] = undefined;
    },
    handleformClear(formName) {
      this.$nextTick(() => {
        this.resetFieldsTap(formName);
      });
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
  .mb8 {
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

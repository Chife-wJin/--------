<template>
  <div class="new">
    <el-form
      ref="userManageform"
      :model="form"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="资源目录id：" prop="companyId" label-width="120px">
            <el-select
              v-model="form.resourceId"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in tDicResources"
                :key="item.id"
                :label="item.classifyStandardName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="上级父id：" prop="companyId" label-width="120px">
            <SearchBar
              @handleSearch="handleSearch"
              :searchValue="form.parent"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="分类名称：" prop="companyId" label-width="120px">
            <el-input v-model="form.classifyName" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="分类编码：" prop="name" label-width="120px">
            <el-input v-model="form.classifyCode" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="排序：" prop="loginName" label-width="120px">
            <el-input v-model="form.sort" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="描述：" prop="email" label-width="120px">
            <el-input
              v-model="form.remarks"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm" v-if="type != 'view'">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <SearchBox
      v-if="isSearchBoxShow"
      title="选择父id"
      :data="data"
      :currentKey="currentKey"
      @getCheckedData="getCheckedData"
      @close="close"
    />
  </div>
</template>

<script>
import {
  saveResourceDirectory,
  getTDicResources,
  getResourceDirectoryInfoById,
  getResourceDirectoryTree,
} from "@/api/dataCenter/metaData.js";
// import { dictListType } from "@/api/styem/dict/type.js";

import SearchBar from "../../components/searchBar.vue";
import SearchBox from "../../components/searchBox.vue";
import { _dateFormat } from "@/utils/dateFormat.js";
export default {
  data() {
    return {
      isRequesting: false,
      isSearchBoxShow: false,
      form: {
        classifyName: "",
        resourceId: "",
        classifyCode: "",
        sort: "",
        remarks: "",
        parent: "",
      },
      tDicResources: [],
      currentKey: "",
      data: [],
    };
  },
  props: {
    id: String,
    type: String,
  },
  created() {
    if (this.type == "edit" || this.type == "view") {
      this.getData();
    }
    this.getTDicResources();
    this.getData1()
  },
  components: {
    SearchBar,
    SearchBox,
  },
  methods: {
    goBack(){
      this.$emit("goBack")
    },
    getTDicResources: function () {
      getTDicResources().then((res) => {
        this.tDicResources = res.data;
      });
    },
    getData: function () {
      getResourceDirectoryInfoById({
        id: this.id,
      }).then((res) => {
        this.form.classifyName = res.data.clsName;
        this.form.resourceId = res.data.tDicResourceId;
        this.form.classifyCode = res.data.clsCode;
        this.form.classifyName = res.data.clsName;
        this.form.sort = res.data.sort;
        this.form.remarks = res.data.describe;
        this.form.parent = res.data.parentId;
        this.currentKey = res.data.parentId;
      });
    },
    getData1: function () {
      getResourceDirectoryInfoById({
        id: this.id,
      }).then((res) => {
        this.form.parent = res.data.parentId;
      });
    },
    submitForm: function () {
      if (this.type == "edit") {
        this.form.id = this.id;
      }
      if (this.isRequesting) {
        return;
      }
      // this.$refs.userManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      saveResourceDirectory(this.form)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
            this.$emit("save");
          } else {
            this.$notify({
              title: "系统提示",
              message: "保存失败",
              showClose: false,
            });
          }
        })
        .finally(() => {
          this.isRequesting = false;
        });
      loading.close();
      // } else {
      //   return false;
      // }
      // });
    },
    handleSearch: function (value) {
      this.getResourceDirectoryTree();
      this.isSearchBoxShow = true;
    },
    getCheckedData: function (data) {
      this.form.parent = data.id;
      this.isSearchBoxShow = false;
    },
    getResourceDirectoryTree() {
      getResourceDirectoryTree().then((res) => {
        this.data = res.data.length ? res.data : [];
      });
    },
    close: function () {
      this.isSearchBoxShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.new {
  padding-top: 20px;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-date-editor {
  width: 100%;
}
::v-deep .el-cascader {
  width: 100%;
}
::v-deep label {
  font-weight: 400;
}
.btn {
  display: flex;
  justify-content: center;
  padding-top: 26px;
}
</style>
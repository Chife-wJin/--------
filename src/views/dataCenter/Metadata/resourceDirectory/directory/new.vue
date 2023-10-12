<template>
  <div class="new">
    <el-form
      ref="userManageform"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="分类标准名称：" prop="companyId">
            <el-input
              v-model="form.classifyStandardName"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="分类标准编码：" prop="name">
            <el-input
              v-model="form.classifyStandardCode"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="描述：" prop="email">
            <el-input
              v-model="form.remarks"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="btn" v-if="type != 'view'">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="clear">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <SearchBox
      v-if="isSearchBoxShow"
      title="选择父id"
      @getCheckedData="getCheckedData"
      @close="close"
    />
  </div>
</template>

<script>
import {
  saveResourceDirectory2,
  getResourceDirectoryInfoById2,
} from "@/api/dataCenter/metaData.js";
// import { dictListType } from "@/api/styem/dict/type.js";

import SearchBox from "../../components/searchBox.vue";
import { _dateFormat } from "@/utils/dateFormat.js";
export default {
  data() {
    return {
      isRequesting: false,
      isSearchBoxShow: false,
      form: {
        classifyStandardName: "",
        classifyStandardCode: "",
        remarks: "",
      },
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
  },
  components: {
    SearchBox,
  },
  methods: {
    clear: function () {
      for (let i in this.form) {
        this.$set(this.form, i, undefined);
      }
    },

    getData: function () {
      getResourceDirectoryInfoById2({
        id: this.id,
      }).then((res) => {
        this.form.classifyStandardCode = res.data.classifyStandardCode;
        this.form.classifyStandardName = res.data.classifyStandardName;
        this.form.remarks = res.data.describe;
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
      saveResourceDirectory2(this.form)
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
      this.isSearchBoxShow = true;
    },
    getCheckedData: function (data) {
      this.form.Pid = data.id;
      this.isSearchBoxShow = false;
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
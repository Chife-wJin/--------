<template>
  <div class="dialog-form">
    <el-form
      ref="addForm"
      :rules="addRules"
      label-width="140px"
      :model="addForm"
      style="margin-top: 15px"
      :inline="true"
      :disabled="dialogTitle == '查看'"
    >
      <el-form-item label="应用标识：" prop="appKey">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.appKey"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="应用名称：" prop="name">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.name"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="应用图标：" prop="icon">
        <upload
          ref="uploadfileExcel"
          :limit="1"
          accept=".jpg, jpeg, .png"
          :fileId="addForm.icon"
          fromKey="icon"
          :uneditable="dialogTitle == '查看'"
          @setUrlPath="setUrlPath"
          @deleteServeFile="deleteServeFile"
        ></upload>
      </el-form-item>
      <el-form-item label="应用版本：" prop="version">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.version"
          placeholder="请输入"
        />
      </el-form-item>

      <el-form-item label="应用类型：" prop="type">
        <el-select v-model="addForm.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介：" prop="profile">
        <el-input
          maxlength="300"
          show-word-limit
          v-model="addForm.profile"
          type="textarea"
          placeholder="请输入内容"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          maxlength="300"
          show-word-limit
          v-model="addForm.remarks"
          type="textarea"
          placeholder="请输入内容"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="应用地址：" prop="address">
        <el-input v-model="addForm.address" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number :min="1" v-model="addForm.sort" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button
        type="primary"
        size="medium"
        style="margin-right: 10px"
        @click="submitForm"
        v-if="dialogTitle != '查看'"
        class="save-button"
        v-formScroll
        >保存</el-button
      >
      <el-button
        size="medium"
        plain
        @click="handleDialogclose"
        class="close-button"
        >关闭</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  sysApplicationSave,
  sysApplicationGetInfoById,
} from "@/api/styem/menu";
export default {
  name: "DataSourceConfigDialog",
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
    dialogTitle: {
      type: String,
      default: "",
    },
    typeOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      jckOptions: [],
      addForm: {},
      addRules: {
        appKey: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        version: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        name: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        type: {
          required: true,
          message: "请选择",
          trigger: "change",
        },
      },
    };
  },
  created() {
    this.getInfoById();
  },
  methods: {
    async getInfoById() {
      let id = undefined;
      if (this.detail.applicationId) {
        id = this.detail.applicationId;
      } else if (this.detail.id) {
        id = this.detail.id;
      }
      if (!!id) {
        let res = await sysApplicationGetInfoById({ id });
        this.addForm = res.data;
      }
    },
    submitForm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = await sysApplicationSave(this.addForm);
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.$emit("getTableData");
            this.$emit("handleCloseDialog");
          } else {
            this.$message.error("保存失败");
          }
        }
      });
    },
    setUrlPath(file) {
      this.addForm[file.fromKey] = file.fileId;
    },
    deleteServeFile(file) {
      this.addForm[file.fromKey] = undefined;
    },
    handleDialogclose() {
      this.$emit("handleCloseDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item {
    width: 550px !important;
  }
  .el-input__inner,
  .el-textarea__inner {
    width: 380px !important;
  }
}
</style>

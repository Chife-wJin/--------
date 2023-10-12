<template>
  <div class="new">
    <el-form
      ref="userManageform"
      :model="form"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="名称：" prop="companyId" label-width="120px">
            <el-input v-model="form.name" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="版本号：" prop="companyId" label-width="120px">
            <el-input v-model="form.version" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="使用标识：" prop="companyId" label-width="120px">
            <el-input v-model="form.isUse" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="22">
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
  </div>
</template>

<script>
import {
  saveTemplate,
  getTemplateInfoById,
} from "@/api/dataCenter/metaData.js";
import { _dateFormat } from "@/utils/dateFormat.js";
export default {
  data() {
    return {
      isRequesting: false,
      // isSearchBoxShow: false,
      curValue: "",
      form: {
        version: "",
        name: "",
        isUse: "",
        remarks: "",
      },
      isUses: [
        {
          label: "是",
          value: "0",
        },
        {
          label: "否",
          value: "1",
        },
      ],
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

  methods: {
    goBack(){
      this.$emit("goBack")
    },

    getData: function () {
      getTemplateInfoById({
        id: this.id,
      }).then((res) => {
        this.form.version = res.data.version;
        this.form.name = res.data.name;
        this.form.remarks = res.data.remarks;
        this.form.isUse = res.data.isUse;
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
      saveTemplate(this.form)
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

::v-deep .el-row {
  margin-bottom: 16px;
}
</style>
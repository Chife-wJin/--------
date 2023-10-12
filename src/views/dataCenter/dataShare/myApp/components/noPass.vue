<template>
  <div class="new">
    <div style="margin-bottom:30px">确认该应用未通过吗？</div>
    <el-form
      ref="noPassform"
      :model="form"
    >
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item prop="errorinfo">
            <el-input v-model="form.errorinfo" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
         <el-col :span="24" class="branch-name">
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
         </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
 import {
  donotapprove,
 } from "@/api/dataCenter/dataShare.js";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      curValue: "",
      form: {
          errorinfo:""
      },
    };
  },

  props: {
    id: String,
  },
  created() {
    
  },

  methods: {
    submitForm: function () {
      if (this.isRequesting) {
        return;
      }
      // this.$refs.serviceManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      donotapprove({id:this.id,errorinfo:this.errorinfo})
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("您提交的结论为：" + this.form.errorinfo);
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
          this.$emit("hidden")
        });
      loading.close();
      // } else {
      //   return false;
      // }
      // });
    },
    cancel(){
        this.$emit('hidden')
    }
  },
};
</script>

<style lang="scss" scoped>
.new {
  padding-top: 20px;
}
.chooseService:hover{color: rgb(31, 169, 224);}
.ps{line-height: 20px; font-size: 12px; color: #999;}
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
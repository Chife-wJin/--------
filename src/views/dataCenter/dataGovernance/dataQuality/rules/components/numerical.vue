<template>
  <div class="new">
    <el-form
      ref="numericalform"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="form.ruleName" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="最大值" prop="maxInt">
             <el-input v-model="form.maxInt" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="最小值" prop="minInt">
            <el-input v-model="form.minInt" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="primary" @click="goBack" plain>取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  ruleSave,
  getInfoById,
 } from "@/api/dataCenter/dataGovernance";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      form: {
        ruleName:"",
        maxInt:"",
        minInt:""
      },
      isShowAlert:false,
      visible:true,
      rules: {
        ruleName:[
            { required: true, message: '请输入规则名称', trigger: 'blur' },
          ]
      }
    };
  },
  props: {
    id: Number,
    type: String,
    ruleType: String,
  },
  created() {
    if (this.type == "edit") {
      this.getData();
    }
  },

  methods: {
    btnShow(){
      this.isBtnShow = false
    },

    example(){
        this.isShowAlert = true
    },
    check(){},

    getData: function () {
      getInfoById({
        id: this.id,
      }).then((res) => {
          console.log(res)
         this.form.ruleName =  res.data.ruleName
         this.form.maxInt =  res.data.maxInt
         this.form.minInt =  res.data.minInt
         this.form.id =  res.data.id
         console.log(res.data)
        
      });
    },
    submitForm: function () {
      if (this.type == "") {
        this.form.ruleType = this.ruleType;
      }
      if (this.isRequesting) {
        return;
      }
      this.$refs.numericalform.validate(async (valid) => {
        if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      ruleSave(this.form)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
            this.$emit("getList")
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
          this.$emit("goBack")
        });
      loading.close();
      } else {
        return false;
      }
      });
    },
    close(){
      this.isShowAlert = false;
    },
    goBack(){
      this.$emit("goBack")
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
::v-deep .btn .el-form-item__content{  margin-left: 0; margin-right: 120px;}
</style>
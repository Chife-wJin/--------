<template>
  <div class="new">
    <el-form
      ref="regularRulesform"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="form.ruleName" size="small" style="width:92%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="约束表达式" prop="constraintExpression">
            <el-input v-model="form.constraintExpression" type="textarea" :rows="3" style="width:90%; margin-right:10px"></el-input>
            <el-button type="primary" @click="example" size="mini">参考</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="测试数据" prop="testString">
            <el-input v-model="testString" size="small" style="width:90%; margin-right:10px"></el-input>
            <el-button type="primary" @click="check"  size="mini">校验</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="primary" @click="goBack" plain>返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog
      title=""
      v-if="isShowAlert"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      >
      <ExampleView @close="close"/>
    </el-dialog>
  </div>
</template>

<script>
 import {
  ruleSave,
  getInfoById,
  rulesTest
 } from "@/api/dataCenter/dataGovernance";
 import ExampleView from "./example.vue";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      form: {
        ruleName: "",
        constraintExpression: "",
      },
      isShowAlert:false,
      visible:true,
      testString:"",
      rules: {
        ruleName:[
          { required: true, message: '请输入规则名称', trigger: 'blur' },
        ],
        constraintExpression:[
          { required: true, message: '请输入表达式', trigger: 'blur' },
        ],
      }
    };
  },
  props: {
    id: Number,
    type: String,
    ruleType: String,
  },
  components: {
      ExampleView
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
    check(){
        rulesTest({
          constraintExpression:this.form.constraintExpression,
          testString:this.testString
          }).then(res => {
            console.log(res)
        })
    },

    getData: function () {
      getInfoById({
        id: this.id,
      }).then((res) => {
          console.log(res)
         this.form.ruleName = res.data.ruleName
         this.form.constraintExpression = res.data.constraintExpression
         this.form.id =  res.data.id
      });
    },
    submitForm: function () {
      if (this.type == "") {
        this.form.ruleType = this.ruleType;
      }
      if (this.isRequesting) {
        return;
      }
      console.log(this.form)
      this.$refs.regularRulesform.validate(async (valid) => {
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
    handleDialogClose() {
      this.isShowAlert = false;
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
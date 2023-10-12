<template>
  <div class="new">
    <el-form
      ref="canonicalRulesForm"
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
          <el-form-item label="规范类型" prop="specificationType">
            <el-select
                v-model="form.specificationType"
                size="small"
                style="width: 180px"
                placeholder="请选择"
                >
                <el-option
                    v-for="(item,i) in specificationTypeData"
                    :key="i"
                    :label="item.title"
                    :value="item.code"
                ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="规范值" prop="specificationValue">
            <el-input v-model="form.specificationValue" size="small"></el-input>
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
  dictListType
 } from "@/api/dataCenter/dataGovernance";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      form: {
        ruleName:"",
        specificationType:"",
        specificationValue:""
      },
      isShowAlert:false,
      visible:true,
      specificationTypeData:undefined,
      rules: {
      ruleName:[
            { required: true, message: '请输入规则名称', trigger: 'blur' },
          ],
      specificationType:[
            { required: true, message: '请输入规范类型', trigger: 'blur' },
          ],
      specificationValue:[
            { required: true, message: '请输入规范值', trigger: 'blur' },
          ],
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
    this.datacenterDictList() 

  },

  methods: {
    btnShow(){
      this.isBtnShow = false
    },
    // clear: function () {
    //   for (let i in this.form) {
    //     this.$set(this.form, i, undefined);
    //   }
    // },
    example(){
        this.isShowAlert = true
    },
    check(){},
    async datacenterDictList() {
      const specificationTypeReponse = await dictListType({ type: "range" });
      this.specificationTypeData = specificationTypeReponse.data
    },
    getData: function () {
      getInfoById({
        id: this.id,
      }).then((res) => {
        //this.form =  res.data
        this.form.ruleName = res.data.ruleName
        this.form.specificationType = res.data.specificationType
        this.form.specificationValue = res.data.specificationValue
        this.form.id = res.data.id
      });
    },
    submitForm: function () {
      if (this.type == "") {
        this.form.ruleType = this.ruleType;
      }
      if (this.isRequesting) {
        return;
      }
      this.$refs.canonicalRulesForm.validate(async (valid) => {
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
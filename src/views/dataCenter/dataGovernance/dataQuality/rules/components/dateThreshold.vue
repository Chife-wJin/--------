<template>
  <div class="new">
    <el-form
      ref="dateThresholdform"
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
          <el-form-item label="最小值">
            <el-radio-group v-model="form.minDateType">
                <el-radio label="1">固定时间</el-radio>
                <el-radio label="2">当前时间</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="minDate" v-show="form.minDateType == '1'">
               <el-date-picker
                v-model="form.minDate"
                type="date"
                placeholder="选择日期"
                size="small"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd hh:mm:ss"
                style="width:300px">
                </el-date-picker>
          </el-form-item>
          
            <el-form-item label="偏移量" v-show="form.minDateType == '2'">
                <div class="cur"> 
                <el-input v-model="form.minInt" size="small" style="width:400px; margin-right:10px"></el-input>
                <el-select
                    v-model="form.minUnitType"
                    size="small"
                    style="width: 180px"
                    placeholder="请选择时间"
                    >
                    <el-option
                        v-for="(item,i) in UnitTypeData"
                        :key="i"
                        :label="item.title"
                        :value="item.code"
                    ></el-option>
                </el-select>
                </div>
            </el-form-item>
          
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="最大值">
            <el-radio-group v-model="form.maxDateType">
                <el-radio label="1">固定时间</el-radio>
                <el-radio label="2">当前时间</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="maxDate" v-show="form.maxDateType == '1'">
               <el-date-picker
                v-model="form.maxDate"
                type="date"
                placeholder="选择日期"
                size="small"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd hh:mm:ss"
                style="width:300px">
                </el-date-picker>
          </el-form-item>
          
            <el-form-item label="偏移量" v-show="form.maxDateType == '2'">
                <div class="cur"> 
                <el-input v-model="form.maxInt" size="small" style="width:400px; margin-right:10px"></el-input>
                <el-select
                    v-model="form.maxUnitType"
                    size="small"
                    style="width: 180px"
                    placeholder="请选择时间"
                    >
                    <el-option
                        v-for="(item,i) in UnitTypeData"
                        :key="i"
                        :label="item.title"
                        :value="item.code"
                    ></el-option>
                </el-select>
                </div>
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
        minDate:"",
        minInt:"",
        minUnitType:"",
        maxDate:"",
        maxInt:"",
        maxUnitType:"",
        minDateType:"1",
        maxDateType:"1",
      },
      isShowAlert:false,
      visible:true,
      rules: {
        ruleName:[
            { required: true, message: '请输入规则名称', trigger: 'blur' },
          ]
      },
      UnitTypeData:undefined
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
    example(){
        this.isShowAlert = true
    },
    check(){},
    async datacenterDictList() {
      const UnitTypeReponse = await dictListType({ type: "current" });
      this.UnitTypeData = UnitTypeReponse.data
      //console.log(UnitTypeReponse)
    },
    getData: function () {
      getInfoById({
        id: this.id,
      }).then((res) => {
          console.log(res)
         this.form.id =  res.data.id
         this.form.ruleName = res.data.ruleName
         if(res.data.maxDateType == 1){
           this.form.maxDateType = "1"
         }else if(res.data.maxDateType == 2 ){
           this.form.maxDateType = "2"
         }else{
           this.form.maxDateType = "1"
         }
         if(res.data.minDateType == 1){
           this.form.minDateType = "1"
         }else if(res.data.minDateType == 2){
           this.form.minDateType = "2"
         }else{
           this.form.minDateType = "1"
         }
          this.form.minDate =res.data.minDate
          this.form.minInt =res.data.minInt
          this.form.minUnitType =res.data.minUnitType
          this.form.maxDate =res.data.maxDate
          this.form.maxInt =res.data.maxInt
          this.form.maxUnitType =res.data.maxUnitType
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

      if(this.form.minDateType == 1){
        this.form.minInt = ""
        this.form.minUnitType = ""
      }else{
        this.form.minDate = ""
      }
       if(this.form.maxDateType == 1){
        this.form.maxInt = ""
        this.form.maxUnitType = ""
      }else{
        this.form.maxDate = ""
      }
      console.log(this.form)
      
      this.$refs.dateThresholdform.validate(async (valid) => {
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
.cur{display: flex;}
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
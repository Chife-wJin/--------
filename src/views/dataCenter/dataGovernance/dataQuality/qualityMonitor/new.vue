<template>
  <div class="new">
    <el-form
      ref="zlpgform"
      :model="form"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="任务名称：" prop="companyId" label-width="120px">
            <el-input v-model="form.taskName" size="small" style="width:400px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="选择模型：" prop="companyId" label-width="120px">
             <el-select
                v-model="form.modelValue"
                size="small"
                style="width: 400px"
                @change="handleChange"
                >
                <el-option
                    v-for="item in modelList"
                    :key="item.id"
                    :label="item.tableName"
                    :value="item.id"
                ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="cron表达式：" prop="" label-width="120px">
            <input v-model="cronVal" />
            <CzrVueCron :cron.sync="cronVal" :recent="[]"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  taskListetInfoById,
  taskListSave,
  getqualityRulesTree
} from "@/api/dataCenter/dataGovernance.js";
import CzrVueCron from 'czr-vue-cron'
export default {
  data() {
    return {
      isRequesting: false,
      form: {
        taskName:"",
        modelValue:"",
        modelName:"",
      },
      cronVal: '',
      rules:{},
      modelList:[],
    }
    
  },
  components: {
    CzrVueCron
  },
  props: {
    id:Number,
    type:String
  },
  created() {
    this.modelListData() 
    if(this.type == "edit"){
      this.getData()
    }
  },
 
  methods: {
    getData() {
      taskListetInfoById({
        id: this.id,
      }).then((res) => {
        console.log(res)
        this.form.taskName = res.data.taskName;
        this.form.modelValue = res.data.assessTable
        this.form.modelName = res.data.assessTableName
        this.cronVal = res.data.cron
      });
    },
    handleChange(value){
      this.form.modelName = this.modelList.find(item => item.id === value).tableName
    },
    goBack(){
      this.$emit("goBack")
    },
    modelListData(){
     getqualityRulesTree().then((res)=>{
       this.modelList = res.data
       console.log(this.modelList)
     })
    },
    submitForm: function () {
      let queryForm = {}
      if(this.type == "edit"){
        queryForm.id = this.id
      }
      if (this.isRequesting) {
        return;
      }
      queryForm.taskName = this.form.taskName
      queryForm.assessTable = this.form.modelValue
      queryForm.assessTableName = this.form.modelName
      queryForm.cron = this.cronVal

      console.log(queryForm)


      // this.$refs.userManageform.validate(async (valid) => {
      // if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      taskListSave(queryForm)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
            this.$emit("goBack");
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
</style>
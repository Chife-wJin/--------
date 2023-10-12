<template>
  <div class="new">
    <el-form
      ref="checkAppform"
      :model="form"
      label-width="120px"
    >
      <el-row :gutter="24">
         <el-col :span="11" class="branch-name">
          <el-form-item label="应用名称" prop="apiAppName">
            <el-input v-model="form.apiAppName" size="small" placeholder="输入应用名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="启用的服务id" prop="apiServiceprice">
            <div v-for="(v,i) in appNameList" :key="i">
              <div>{{v}} </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="ip白名单" prop="apiServiceprice">
            <el-input v-model="form.apiAppIp" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="11" class="branch-name">
          <el-form-item label="有效期间" prop="apiRequestTime">
            <el-input v-model="form.apiRequestTime" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="接口访问token" prop="apiAppToken">
            <el-input v-model="form.apiAppToken" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="11" class="branch-name">
          <el-form-item label="审批状态" prop="apiAppIsapprove">
            <el-input v-model="form.apiAppIsapprove_text" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
       <el-col :span="11" class="branch-name">
          <el-form-item label="用户编号" prop="apiUserid">
            <el-input v-model="form.apiUserid" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="11" class="branch-name">
          <el-form-item label="用户名称" prop="apiUsername">
            <el-input v-model="form.apiUsername" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
         <el-col :span="22" class="branch-name">
        <div class="btn" v-show="isBtnShow">
          <el-button type="primary" @click="goBack" plain>返回</el-button>
        </div>
         </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
 import {
  getAppById,
  apiServiceFindByIds
 } from "@/api/dataCenter/dataShare.js";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      curValue: "",
      form: {},
      isBtnShow:true,
      visible:true,
      isShowAlertServList:false,
      title:"选择服务",
      appNameList:[],
    };
  },
  props: {
    id: String,
    apiAppService: String,
  },
  created() {
      this.getData();
      this.getDataServiceList()
  },

  methods: {
    getData: function () {
      console.log(this.id)
      getAppById({
        id: this.id,
      }).then((res) => {
        console.log(res)
         this.form =  res.data
         console.log(this.form)
        this.$set(this.form, "apiAppIsapprove_text", "");
       this.form.apiAppIsapprove === '1' ? (this.form.apiAppIsapprove_text = '通过') : this.form.apiAppIsapprove === "2" ? (this.form.apiAppIsapprove_text = '未通过') : (this.form.apiAppIsapprove_text = '未审核')
      });
    },
    getDataServiceList: function () {
      console.log(this.apiAppService)
      apiServiceFindByIds({
        ids: this.apiAppService,
      }).then((res) => {
        console.log(res.data)
        var s_data = res.data
        this.appNameList = s_data.map(item=>(item[1]))
         console.log(this.appNameList)
      });
    },
    goBack(){
      this.$emit('goBack');
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
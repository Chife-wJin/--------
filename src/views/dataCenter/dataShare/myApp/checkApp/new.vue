<template>
  <div class="new">
    <el-form
      ref="checkAppform"
      :model="form"
      label-width="120px"
    >
      <el-row :gutter="24">
        <el-col :span="11" class="branch-name">
          <el-form-item label="用户编号" prop="apiUserid">
            <el-input v-model="form.apiUserid" size="small"></el-input>
            <div class="ps">用户编号为当前登陆人的编号(若管理关操作需修改为具体申请人的编号)</div>
          </el-form-item>
        </el-col>
        <el-col :span="11" class="branch-name">
          <el-form-item label="用户名称" prop="apiUsername">
            <el-input v-model="form.apiUsername" size="small"></el-input>
            <div class="ps">用户名称为当前登陆人的登陆名称(若管理关操作需手动填写)</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="11" class="branch-name">
          <el-form-item label="应用名称" prop="apiAppName">
            <el-input v-model="form.apiAppName" size="small" placeholder="输入应用名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" class="branch-name">
          <el-form-item label="有效时间" prop="apiRequestTime">
            <el-select v-model="form.apiRequestTime" placeholder="请选择Token的有效时间">
              <el-option
                  v-for="item in requesttimeData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="启用的服务id" prop="apiAppService">
            <div v-for="(v,index) in arr" :key="v.appId">
              <div>{{v.apiServicename}} <a @click="delItem(index)">×</a></div>
            </div>
            <a class="chooseService" @click="chooseService">选择服务</a>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="ip白名单" prop="apiServiceprice">
            <el-input v-model="form.apiAppIp" type="textarea" :rows="3"></el-input>
            <div class="ps"><span style="color:#c00">只有IP白名单内的服务器才能成功发起调用</span> 格式: 202.198.16.3,202.198.0.1 填写IP地址，英文半角逗号分隔如果不想对IP做任何限制，请设置为0.0.0.0/0 （谨慎使用，token如果泄露配额会被其用户消费，产生的费用需要用户自己承担，上线前可以用作Debug，线上正式token请设置合理的IP白名单）</div>
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
         <el-col :span="22" class="branch-name">
        <el-form-item class="btn" v-show="isBtnShow" label-width="0">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="goBack" type="primary" plain>返回</el-button>
        </el-form-item>
         </el-col>
      </el-row>
    </el-form>
    <el-dialog
      :title="title"
      v-if="isShowAlertServList"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><ServiceList 
      :id="id" 
      @choose="choose"
    /></el-dialog>
  </div>
</template>

<script>
 import {
  apiAppSave,
  getAppById,
  apiServiceFindByIds
 } from "@/api/dataCenter/dataShare.js";
 import { dictListType } from "@/api/styem/dict/type.js";
 import ServiceList from "./serviceList.vue";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      curValue: "",
      form: {
        apiAppService:""
      },
      isBtnShow:true,
      visible:true,
      isShowAlertServList:false,
      title:"选择服务",
      requesttimeData: undefined,
      appIdList:[],
      appNameList:[],
      iskong:true,
      arr:[]
    };
  },
  components:{ServiceList},
  props: {
    id: String,
    type: String,
    apiAppService: String,
  },
  created() {
    if (this.type == "edit" || this.type == "view") {
      this.getData();
      this.getDataServiceList()
    }
     if (this.type == "view") {
      this.isBtnShow = false;
    }
    this.getInstitutionDict();
  },

  methods: {
    chooseService(){
      this.isShowAlertServList = true
    },
    choose(chooseItem){
      this.arr = chooseItem
      console.log(this.arr)
      this.appIdList = this.arr.map(item=>(item.id))
      this.form.apiAppService = this.appIdList.toString()  
      console.log(this.form.apiAppService)
      
    },
    delItem(index){
      this.arr.splice(index, 1);
      this.appIdList = this.arr.map(item=>(item.id))
      this.form.apiAppService = this.appIdList.toString()
    },
    btnShow(){
      this.isBtnShow = false
    },
    clear: function () {
      for (let i in this.form) {
        this.$set(this.form, i, undefined);
      }
    },

    getData: function () {
      console.log(this.id)
      getAppById({
        id: this.id,
      }).then((res) => {
        console.log(res)
         this.form = res.data
      });
    },
    getDataServiceList: function () {
      console.log(this.id)
      apiServiceFindByIds({
        ids: this.apiAppService,
      }).then((res) => {
        console.log(res.data)
        var s_data = res.data
        this.appNameList = s_data.map(item=>(item[1]))
        this.appIdList = s_data.map(item=>(item[0]))
        // console.log(this.appNameList)
        // console.log(this.appIdList)
         this.appIdList.forEach(item => {
          this.arr.push({
            id: item,
            apiServicename: ''
          })
          })
          this.appNameList.forEach((item, i) => {
              this.arr[i].apiServicename = item
          })
         console.log(this.arr)
      });
    },
     async getInstitutionDict() {
      const requesttimeReponse = await dictListType({ type: "requesttime" });
      this.requesttimeData = requesttimeReponse.data;
    },
    submitForm: function () {
      if (this.type == "edit") {
        this.form.id = this.id;
        let s = this.appIdList;
        this.form.apiAppService = s.toString()
      }
      if (this.isRequesting) {
        return;
      }
      console.log(this.form)
      // this.$refs.serviceManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      apiAppSave(this.form)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
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
    handleDialogClose: function () {
      this.isShowAlertServList = false;
    },
    close: function () {
      this.isSearchBoxShow = false;
    },
    goBack(){
      this.$emit("goBack")
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
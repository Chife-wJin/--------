<template>
  <div class="new">
    <el-form
      ref="checkAppform"
      :model="form"
      label-width="120px"
    >
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form-item label="文件内容">
            <el-input v-model="content" type="textarea" :rows="25"></el-input>
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
      form: {
        content:""
      },
      isBtnShow:true,
      visible:true,
      isShowAlertServList:false,
      title:"选择服务",
      appNameList:[],
    };
  },
  props: {
    content: String
  },
  created() {
      this.getData();
      this.getDataServiceList()
      this.form.content = this.content
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
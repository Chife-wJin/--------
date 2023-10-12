<template>
  <div class="myDiv">
    <div class="title">编写文档</div>
    <div class="top">
          <div>服务名称：{{content.apiServicename}}</div>
          <div>服务url：{{content.apiServiceurl}}</div>
      </div>
      <el-form
      ref="serviceManageform"
      :model="form"
    >
      <div class="container">
        <mavon-editor
         v-model="form.docmd" 
         @change="changeData"
         />
      </div>
       <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button type="primary" @click="goBack" plain>返回</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import {
  editDocByServiceId,
  apiServiceDocSave
 } from "@/api/dataCenter/dataShare.js";
export default {
  name: 'DocWrite',
  components:{},
  props: {
    typeWrite:String,
    idWrite: String,
  },
  data(){
    return {
      content:"",     
      form:{
        docmd: "",
        serviceDoc:"",
        id:""
        },
      html:"",     
    }
  },
  methods:{
    changeData(value, render) {
      // value中是文本值,render是渲染出的html文本
      this.html = render;
    },
    getData() {
      editDocByServiceId({
        serviceId: this.idWrite,
      }).then((res) => {
          console.log(res)
          if(res.apiServiceDoc.docmd){
             this.form.docmd = res.apiServiceDoc.docmd
          }
          this.content = res
      });
    },
    goBack(){
      this.$emit("goBack")
    },
    submitForm() {
      this.form.id = this.idWrite
      this.form.serviceDoc = this.html
      if (this.isRequesting) {
        return;
      }
      // this.$refs.serviceManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,   
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      apiServiceDocSave(this.form)
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
  },
  created(){
      this.getData()
  }
}
</script>
<style lang="scss" scoped>
.myDiv{
  padding: 0 30px;
  .title{ font-size:18px}
  .top{
    display: flex;
    justify-content: space-around;
    margin: 24px auto;
   }
   
   .container{
     font-size: 16px;
     line-height: 30px;
     margin-bottom: 20px;
     padding: 10px;
   }
   .content{
     margin-bottom: 20px;
   }
   .btn{ display: flex; justify-content: center;}

  
}


</style>
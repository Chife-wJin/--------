<template>
  <div class="myDiv">
      <div class="top">
          <div>服务名称：{{content.apiServicename}}</div>
          <div>服务url：{{content.apiServiceurl}}</div>
      </div>
      <div class="container">
          <div v-loading="loading" ref="apiDocDiv" v-html="apiDocDiv" v-highlight class="markdown-body">
          </div>
      </div>
      <div class="back">
        <el-button type="primary" @click="goBack" plain>返回</el-button>
      </div>
  </div>
</template>

<script>
import {
  getDocByServiceById,
 } from "@/api/dataCenter/dataShare.js";
 import 'mavon-editor/dist/markdown/github-markdown.min.css'
 import "mavon-editor/dist/css/index.css";
export default {
  name: 'document',
  components:{},
  props: {
    idSee: String,
    typeSee: String,
  },
  data(){
    return {
        content:{},
        apiDocDiv:undefined,
        loading: true,
    }
  },
  methods:{
    getData() {
      console.log(this.idSee)
      this.loading = true;
      getDocByServiceById({
        serviceId: this.idSee,
      }).then((res) => {
        console.log(res)
         this.content =  res
         this.apiDocDiv = res.apiServiceDoc.serviceDoc
         this.loading = false;
      });
    },
    goBack(){
      this.$emit("goBack")
    }
  },
  created() {
    this.getData();
    },
}
</script>
<style lang="scss" scoped>
.myDiv{
  padding: 0 30px;
  .top{
    display: flex;
    justify-content: space-around;
    margin: 24px auto;
   }
   .container{
     font-size: 16px;
     line-height: 30px;
     margin-bottom: 20px;
     border: solid 1px #ddd;
     padding: 10px;
   }
   .content{
     margin-bottom: 20px;
   }
   .back{display: flex; justify-content: center;}
}


</style>
<template>
<div>
  <div class="settiaojian">
    <el-form
      ref="settiaojianform"
      :model="form"
      label-width="100px"
    >
    <el-row :gutter="10">
        <el-col :span="16" class="branch-name">
            <el-form-item label="规则内容" prop="guizeCon">
                <el-input v-model="form.guizeCon" size="small" type="textarea" :rows="3" style="width:80%; margin-right:10px"></el-input>
                <a style="color:#409EFF"><i class="el-icon-question"></i>语法检查</a>
            </el-form-item>
            <div class="group-div">
                <div class="group">
                    <input placeholder="请选择属性" v-model='input' class="sx-input"/>
                    <ul class="content-div">
                        <li v-for="(v,i) in chaxun" :key=i @click="shuxing(v)">{{v.name}}</li>
                    </ul>
                </div>
                <div class="group">
                    <p>选择比较符</p>
                    <ul class="content-div">
                        <li v-for="(v,i) in bjf" :key=i @click="choosebjf(v)">{{v.name}}</li>
                    </ul>
                </div>
                <div class="group">
                    <p>选择运算符</p>
                    <ul class="content-div">
                        <li v-for="(v,i) in ysf" :key=i @click="chooseysf(v)">{{v.name}}</li>
                    </ul>
                </div>
                <div class="group">
                    <p>选择系统变量</p>
                    <ul class="content-div">
                        <li v-for="(v,i) in xtbl" :key=i @click="choosextbl(v)">{{v.name}}</li>
                    </ul>
                </div>
            </div>
        </el-col>
    </el-row>

    </el-form>

     
  </div>
  <div class="pull-right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
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
           guizeCon:[],
      },
      isShowAlert:false,
      visible:true,
      testString:"",
      content:[
            {id:1,name:'苹果'},
            {id:2,name:'香蕉'},
            {id:3,name:'草莓'},
            {id:4,name:'猕猴桃'},
            {id:5,name:'葡萄'},
            {id:6,name:'橘子'},
            {id:7,name:'西瓜'},
            {id:8,name:'荔枝'},
            {id:9,name:'哈密瓜'}
        ],
        bjf:[
            {id:1,name:'苹果'},
            {id:2,name:'香蕉'},
            {id:3,name:'草莓'},
            {id:4,name:'猕猴桃'},
            {id:5,name:'葡萄'},
            {id:6,name:'橘子'},
            {id:7,name:'西瓜'},
            {id:8,name:'荔枝'},
            {id:9,name:'哈密瓜'}
        ],
        ysf:[
            {id:1,name:'苹果'},
            {id:2,name:'香蕉'},
            {id:3,name:'草莓'},
            {id:4,name:'猕猴桃'},
            {id:5,name:'葡萄'},
            {id:6,name:'橘子'},
            {id:7,name:'西瓜'},
            {id:8,name:'荔枝'},
            {id:9,name:'哈密瓜'}
        ],
        xtbl:[
            {id:1,name:'苹果'},
            {id:2,name:'香蕉'},
            {id:3,name:'草莓'},
            {id:4,name:'猕猴桃'},
            {id:5,name:'葡萄'},
            {id:6,name:'橘子'},
            {id:7,name:'西瓜'},
            {id:8,name:'荔枝'},
            {id:9,name:'哈密瓜'}
        ],
       
        input:""
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
    computed:{
        chaxun(){
            if(!this.input){
                return this.content
            } else{
                return this.content.filter(item => item.name.includes(this.input))
            }
        }
        
    },
  methods: {
    shuxing(v){
        this.form.guizeCon.push(v.name)
    },
    choosebjf(v){
        console.log(v)
        this.form.guizeCon.push(v.name)
    },
    chooseysf(v){
        console.log(v)
        this.form.guizeCon.push(v.name)
    },
    choosextbl(v){
        console.log(v)
        this.form.guizeCon.push(v.name)
    },


    
    getData: function () {
      getInfoById({
        id: this.id,
      }).then((res) => {
          console.log(res)
         this.form =  res.data
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
    prev() {
      this.$emit("closeSelf");
    },
    cancel(){
      this.$emit("cancel")
    },
    handleDialogClose() {
      this.isShowAlert = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.settiaojian {
  width: 800px;
  margin: 0 auto 50px;
  padding: 50px 0;
}
.sx-input{height: 30px; width: 150px; border: solid 1px #ccc;}
.content-div{ width: 150px; border: solid 1px #ccc; padding:10px 20px; line-height: 30px; height: 200px; overflow: auto;}
.group-div{ display: flex; justify-content: space-around; width: 800px;}
.group p{ line-height: 30px; margin: 0;}
.group li{ cursor: default;}
.group li:hover{color: #409EFF;}





</style>
<template>
<div>
  <div class="step3tiaojian">
    <el-form
      ref="tiaojianRulesform"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="16" class="branch-name">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="form.ruleName" size="small" style="width:100%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16" class="branch-name">
            <el-form-item label="条件" prop="compareObject">
                <el-input v-model="form.tiaojian" size="small" style="width:75%; margin-right:10px"></el-input>
                <el-button type="primary" @click="setToiaojian" size="mini">设置条件</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
        <el-col :span="16" class="branch-name">
            <el-form-item label="规则" prop="compareObject">
                <el-input v-model="form.tiaojian" size="small" style="width:55%;"></el-input>
                <el-dropdown size="medium" type="primary" style="margin-right:10px"   @command="handleCommand">
                  <el-button type="primary" size="mini">
                    定义规则<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <div  v-for="(v,i) in guizes" :key=i>
                      <el-dropdown-item :command="v.command">{{v.name}}</el-dropdown-item>
                    </div>
                    
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" @click="example" size="mini">编辑</el-button>
            </el-form-item>
          </el-col>
        </el-row>

    </el-form>
   
    <el-dialog
      title="设置条件"
      v-if="isShowAlertSetToiaojian"
      :before-close="handleDialogClose"
      :visible="visible"
      width="900px"
      append-to-body
      >
     <SetTiaojian  
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="closeSelf"
      />
    </el-dialog>
    <el-dialog
      :title="title"
      v-if="isShowAlertgzs"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      >
      <div v-show="feikong">
        <FeikongRules  
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
      <div v-show="weiyi">
        <WeiyiRules  
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
      <div v-show="zuheweiyi">
        <ZuheweiyiRules  
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
      <div style="padding-top:50px" v-show="yizhi">
        <YizhiRules  
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
       <div style="padding-top:50px" v-show="hezhun">
        <HezhunRules  
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
      <div style="padding-top:50px" v-show="guifan">
        <GuifanRules
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
      <div style="padding-top:50px" v-show="yuzhi">
        <YuzhiRules
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
      <div style="padding-top:50px" v-show="zhengze">
        <ZhengzeRules
        @cancel="handleDialogClose" 
        @save="save" 
        @closeSelf="handleDialogClose"
      />
      </div>
     
    </el-dialog>
     
  </div>
  <div class="pull-right">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="prev">上一步</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>

<script>
 import {
  ruleSave,
  getInfoById,
 } from "@/api/dataCenter/dataGovernance";
 import SetTiaojian from "./setTiaojians.vue";
import FeikongRules from "./step3feikongs.vue";
import WeiyiRules from "./step3weiyi.vue";
import ZuheweiyiRules from "./step3zuheweiyis.vue";
import YizhiRules from "./step3yizhi.vue";
import HezhunRules from "./step3hezhun.vue";
import GuifanRules from "./step3guifan.vue";
import YuzhiRules from "./step3yuzhis.vue";
import ZhengzeRules from "./step3zhengze.vue";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      form: {},
      isShowAlertSetToiaojian:false,
      isShowAlertgzs:false,
      visible:true,
      testString:"",
      title:"",
      rules: {
        ruleName:[
            { required: true, message: '请输入规则名称', trigger: 'blur' },
          ],
        constraintExpression:[
            { required: true, message: '请输入表达式', trigger: 'blur' },
          ],
      },
      guizes:[
        {id:1,name:"非空规则",command:"a"},
        {id:2,name:"唯一规则",command:"b"},
        {id:3,name:"组合唯一规则",command:"c"},
        {id:4,name:"一致规则",command:"d"},
        {id:5,name:"核准规则",command:"e"},
        {id:6,name:"规范规则",command:"f"},
        {id:7,name:"阈值规则",command:"g"},
        {id:8,name:"正则规则",command:"h"},
      ],
      feikong:false,
      weiyi:false,
      zuheweiyi:true,
      hezhun:false,
      yizhi:false,
      guifan:false,
      yuzhi:false,
      zhengze:false,
    };
  },
  props: {
    id: Number,
    type: String,
    ruleType: String,
  },
  components: {
SetTiaojian,
//CommonRules,
YizhiRules,
HezhunRules,
GuifanRules,
YuzhiRules,
ZhengzeRules,
FeikongRules,
WeiyiRules,
ZuheweiyiRules
    },
  created() {
    if (this.type == "edit") {
      this.getData();
    }
  },

  methods: {
    handleCommand(command) {
          console.log(command)
          switch (command) {
            case "a":
                this.isShowAlertgzs = true;
                this.title = "新增-非空规则"
                this.feikong = true
                this.weiyi = false
                this.zuheweiyi = false
                this.hezhun = false
                this.yizhi = false
                this.guifan = false
                this.yuzhi = false
                this.zhengze = false
                this.type = ""
                this.ruleType="rule01"
                break;
            case "b":
                this.isShowAlertgzs = true;
                this.title = "新增-唯一规则"
                this.weiyi = true
                this.feikong = false
                this.zuheweiyi = false
                this.yizhi = false
                this.hezhun = false
                this.guifan = false
                this.yuzhi = false
                this.zhengze = false
                this.type = ""
                this.ruleType="rule01"
                break;
            case "c":
                this.isShowAlertgzs = true;
                this.title = "新增-组合唯一规则"
                this.zuheweiyi = true
                this.weiyi = false
                this.feikong = false
                this.yizhi = false
                this.hezhun = false
                this.guifan = false
                this.yuzhi = false
                this.zhengze = false
                this.type = ""
                this.ruleType="rule03"
                break;
            case "d":
                this.isShowAlertgzs = true;
                this.title = "新增-一致规则"
                this.yizhi = true
                this.zuheweiyi = false
                this.weiyi = false
                this.feikong = false
                this.hezhun = false
                this.guifan = false
                this.yuzhi = false
                this.zhengze = false
                this.type = ""
                this.ruleType="rule04"
                break;
            case "e":
                this.isShowAlertgzs = true;
                this.title = "新增-核准规则"
                this.hezhun = true
                this.yizhi = false
                this.zuheweiyi = false
                this.weiyi = false
                this.feikong = false
                this.guifan = false
                this.yuzhi = false
                this.zhengze = false
                this.type = ""
                this.ruleType="rule04"
                break;
            case "f":
                this.isShowAlertgzs = true;
                this.title = "新增-规范规则"
                this.guifan = true
                this.hezhun = false
                this.yizhi = false
                this.zuheweiyi = false
                this.weiyi = false
                this.feikong = false
                this.yuzhi = false
                this.zhengze = false
                this.type = ""
                this.ruleType="rule04"
                break;
            case "g":
                this.isShowAlertgzs = true;
                this.title = "新增-阈值规则"
                this.yuzhi = true
                this.guifan = false
                this.hezhun = false
                this.yizhi = false
                this.zuheweiyi = false
                this.weiyi = false
                this.feikong = false
                this.zhengze = false
                this.type = ""
                this.ruleType="rule04"
                break;
            case "h":
                this.isShowAlertgzs = true;
                this.title = "新增-正则规则"
                this.zhengze = true
                this.yuzhi = false
                this.guifan = false
                this.hezhun = false
                this.yizhi = false
                this.zuheweiyi = false
                this.weiyi = false
                this.feikong = false
                this.type = ""
                this.ruleType="rule04"
                break;
            } 
        },
    // clear: function () {
    //   for (let i in this.form) {
    //     this.$set(this.form, i, undefined);
    //   }
    // },
    setToiaojian(){
        this.isShowAlertSetToiaojian = true
    },
    check(){},
    
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
    goBack(){
      this.$emit("goBack")
    },
    handleDialogClose() {
      this.isShowAlertSetToiaojian = false;
      this.isShowAlertgzs = false
    },

  },
};
</script>

<style lang="scss" scoped>
.step3tiaojian {
  width: 800px;
  height: 300px;
  margin: 0 auto 100px;
}




</style>
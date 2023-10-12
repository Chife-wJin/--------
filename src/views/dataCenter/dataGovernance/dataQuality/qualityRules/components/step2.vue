<template>
  <div class="step2">
    <div class="theSteps">
      <el-steps :active="active" align-center>
        <el-step title="选择数据库"></el-step>
        <el-step title="选择规则类型"></el-step>
        <el-step title="创建规则"></el-step>
      </el-steps>
    </div>
    <div class="rules">
      <div
        v-for="(v, i) in tabCon"
        :key="v.id"
        @click="change(v, i)"
        :class="n == i ? 'active box-cardCon' : 'box-cardCon'"
      >
        <el-card class="box-card">
          <div>{{ v.ruleName }}</div>
          <div>{{ v.content }}</div>
        </el-card>
      </div>
    </div>
    <div class="pull-right">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="prev">上一步</el-button>
      <el-button type="primary" @click="next" :disabled="nextDisable">下一步</el-button>
    </div>
    <el-dialog
      title="新增"
      v-if="isShowAlertStep3"
      :before-close="handleDialogClose"
      :visible="true"
      width="1000px"
      append-to-body
      top="40px"
    >
      <Step3
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        :postData="postData"
        :id="id"
        :ruleName="ruleName"
        @closeSelf="closeSelf"
      />
    </el-dialog>
  </div>
</template>

<script>
import { dictListType } from "@/api/dataCenter/dataGovernance";
import Step3 from "./step3.vue";
export default {
  name: "Step2",
  components: {
    Step3,
  },
  data() {
    return {
      active: 1,
      tabCon: [
        {
          id: 1,
          ruleName: "唯一规则",
          content: "必须唯一，不可重复",
          type: "",
        },
        {
          id: 2,
          ruleName: "非空规则",
          content: "不可为空，必须维护属性值",
          type: "",
        },
        {
          id: 3,
          ruleName: "组合唯一规则",
          content: "属性值不可全部重复",
          type: "",
        },
        {
          id: 4,
          ruleName: "一致规则",
          content: "需在对比属性的属性值范围内",
          type: "",
        },
        {
          id: 5,
          ruleName: "核准规则",
          content: "与对比对象的属性值进行比较",
          type: "",
        },
        {
          id: 6,
          ruleName: "规范规则",
          content: "是否满足指定类型的规范",
          type: "",
        },
        {
          id: 7,
          ruleName: "正则规则",
          content: "需符合设置的正则表达式",
          type: "",
        },
       
        {
          id: 8,
          ruleName: "阈值规则",
          content: "数值/日期是否在阈值范围内",
          type: "",
        },
        {
          id: 9,
          ruleName: "快速创建规则",
          content: "使用常用规则进行快速创建",
          type: "",
        },
        // {
        //   id: 10,
        //   ruleName: "多字段约束规则",
        //   content: "运用多字段运算对字段值进行校验",
        //   type: "",
        // },
        // {
        //   id: 11,
        //   ruleName: "组合规则",
        //   content: "拼接多个规则进行校验",
        //   type: "",
        // },
         // {
        //   id: 8,
        //   ruleName: "条件规则",
        //   content: "满足条件的数据是否符合约束",
        //   type: "",
        // },
      ],
      nextDisable:true,
      n: -1,
      id: 1,
      ruleName: "",
      isShowAlertStep3: false,
      typeData: [],
      postData: {
        assessTable: {},
        type: "",
      },
    };
  },
  props: {
    assessTable: Object,
  },
  mounted() {},
  created() {
    this.datacenterDictList();
    this.postData.assessTable = this.assessTable;
    // console.log(this.postData)
  },

  methods: {
    change(v, i) {
      if(!v.type){
        return
      }
      this.n = i;
      this.id = i + 1;
      this.ruleName = v.ruleName;
      this.postData.type = v.type;
      console.log(this.postData.type);
    },
    handleDialogClose() {
      this.isShowAlertStep3 = false;
      this.$emit("closeAll");
    },
    async datacenterDictList() {
      const typeReponse = await dictListType({ type: "rule" });
      this.typeData = typeReponse.data;
      console.log(this.typeData);
      if(this.typeData !== []){
        this.nextDisable = false
      }
      //唯一规则
      this.tabCon[0].type = typeReponse.data[0].code;
      //非空规则
      this.tabCon[1].type = typeReponse.data[1].code;
      //组合唯一规则
      this.tabCon[2].type = typeReponse.data[2].code;
      //一致规则
      this.tabCon[3].type = typeReponse.data[3].code;
      //核准规则
      this.tabCon[4].type = typeReponse.data[4].code;
      //规范规则
      this.tabCon[5].type = typeReponse.data[5].code;
      //正则规则
      this.tabCon[6].type = typeReponse.data[6].code;
      //条件规则
     // this.tabCon[7].type = typeReponse.data[7].code;
      //阈值规则
      this.tabCon[7].type = typeReponse.data[8].code;
      //多字段
      this.tabCon[9].type = typeReponse.data[9].code;
      //快速创建规则
      this.tabCon[8].type = typeReponse.data[10].code;
      //  console.log(this.tabCon)
    },
    goBack() {
      this.$emit("goBack");
    },
    saveSuccess() {
      this.isShowAlertStep3 = false;
      this.$emit("saveSuccess");
    },
    prev() {
      this.$emit("closeSelf");
      this.$emit("prve");
    },
    next() {
      if (this.n == -1) {
        this.$message({
          message: "请选择规则",
          type: "warning",
        });
        this.isShowAlertStep3 = false;
      } else {
        this.isShowAlertStep3 = true;
      }
    },
    closeSelf() {
      this.isShowAlertStep3 = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.theSteps {
  margin: 30px auto 50px;
}
::v-deep .el-cascader-menu {
  border: solid 1px #eee;
}
::v-deep .el-cascader-menu__wrap {
  height: 380px;
}
.cascader {
  padding: 0 80px 0 80px;
}
.rules {
  display: flex;
  flex-wrap: wrap;
  width: 860px;
  margin: 0 auto;
}


.box-cardCon {
  width: 286px;
  margin-bottom: 30px;
  text-align: center;
  &:hover .box-card {
    background: #dae9f8;
  }
  .box-card{margin:0 15px;}
}
.active .box-card {
  background: #dae9f8;
}

.box-card div:nth-child(1) {
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 16px;
}
.box-card div:nth-child(2) {
  font-size: 12px;
}
::v-deep .el-dialog__body{ padding: 0 20px 65px 20px;}


</style>
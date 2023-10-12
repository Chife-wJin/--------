<template>
  <div class="step3-view">
    <div class="ruleNameDiv">{{ ruleName }}</div>
    <div class="theSteps">
      <el-steps :active="active" align-center>
        <el-step title="选择数据库"></el-step>
        <el-step title="选择规则类型"></el-step>
        <el-step title="创建规则"></el-step>
      </el-steps>
    </div>
    <div class="feikongRules" v-if="feikong">
      <Feikong
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="weiyiRules" v-if="weiyi">
      <WeiyiRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="zuheweiyiRules" v-if="zuheweiyi">
      <ZuheweiyiRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="yizhiRules" v-if="yizhi">
      <YizhiRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="hezhunRules" v-if="hezhun">
      <HezhunRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="hezhunRules" v-if="guifan">
      <GuifanRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="zhengzeRules" v-if="Zhengze">
      <ZhengzeRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="yuzhiRules" v-if="yuzhi">
      <YuzhiRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="kuaisuRules" v-if="Kuaisu">
      <KuaisuRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <div class="duoziduan" v-if="Duoziduan">
      <DuoziduanRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
      />
    </div>
    <!--<div class="tiaojianRules" v-show="Tiaojian">
      <TiaojianRules @goBack="goBack" @saveSuccess="saveSuccess" @closeSelf="closeSelf" />
    </div>
    
     -->
  </div>
</template>

<script>
import WeiyiRules from "./step3weiyi.vue";
import Feikong from "./step3feikongs.vue";
import ZuheweiyiRules from "./step3zuheweiyis.vue";
import YizhiRules from "./step3yizhi.vue";
import HezhunRules from "./step3hezhun.vue";
import GuifanRules from "./step3guifan.vue";
import ZhengzeRules from "./step3zhengze.vue";
import YuzhiRules from "./step3yuzhis.vue";
import TiaojianRules from "./step3tiaojians.vue";
import KuaisuRules from "./step3kuaisus.vue";
import DuoziduanRules from "./step3duoziduan.vue";
export default {
  name: "Step3",
  components: {
    WeiyiRules,
    Feikong,
    ZuheweiyiRules,
    YizhiRules,
    HezhunRules,
    GuifanRules,
    ZhengzeRules,
    YuzhiRules,
    KuaisuRules,
    DuoziduanRules,
    //TiaojianRules,
  },
  data() {
    return {
      active: 2,
      feikong: false,
      weiyi: false,
      zuheweiyi: false,
      yizhi: false,
      hezhun: false,
      guifan: false,
      yuzhi: false,
      Zhengze: false,
      Tiaojian: false,
      Kuaisu: false,
      Duoziduan: false,
    };
  },
  props: {
    ruleName: String,
    id: Number,
    postData: Object,
  },

  created() {
    // console.log(this.ruleName);
    // console.log(this.id);
    switch (this.id) {
      case 1:
        this.feikong = false;
        this.weiyi = true;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 2:
        this.feikong = true;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 3:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = true;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 4:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = true;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 5:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = true;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 6:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = true;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 7:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = true;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 8:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = true;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = false;
        break;
      case 9:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = true;
        this.Duoziduan = false;
        break;
      case 10:
        this.feikong = false;
        this.weiyi = false;
        this.zuheweiyi = false;
        this.yizhi = false;
        this.hezhun = false;
        this.guifan = false;
        this.yuzhi = false;
        this.Zhengze = false;
        this.Tiaojian = false;
        this.Kuaisu = false;
        this.Duoziduan = true;
        break;
      // case 11:
      //   this.feikong = false;
      //   this.weiyi = false;
      //   this.zuheweiyi = false;
      //   this.yizhi = false;
      //   this.hezhun = false;
      //   this.guifan = false;
      //   this.yuzhi = false;
      //   this.Zhengze = false;
      //   this.Tiaojian = false;
      //   this.Kuaisu = true;
      //   this.Duoziduan = false;
      //   break;
      // case 12:
      //   this.feikong = false;
      //   this.weiyi = false;
      //   this.zuheweiyi = false;
      //   this.yizhi = false;
      //   this.hezhun = false;
      //   this.guifan = false;
      //   this.yuzhi = false;
      //   this.Zhengze = false;
      //   this.Tiaojian = false;
      //   this.Kuaisu = false;
      //   this.Duoziduan = true;
      //   break;
    }
  },
  methods: {
    goBack() {
      this.$emit("goBack");
    },
    closeSelf() {
      this.$emit("closeSelf");
    },
    saveSuccess() {
      this.$emit("saveSuccess");
    },
    handleDialogClose() {
      this.isShowAlertStep3 = false;
    },
  },
};
</script>

<style lang="scss" scoped>
// .step3-view {
//   min-height: 800px;
// }
.ruleNameDiv {
  font-weight: bold;
  font-size: 18px;
  padding: 20px 50px;
  margin-bottom: 30px;
}
.theSteps {
  margin-bottom: 50px;
}

</style>
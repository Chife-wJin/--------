<template>
  <div class="step3-view">
    <div class="ruleNameDiv">{{ ruleName }}</div>
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
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
    <div class="yizhiRules" v-if="yizhi">
      <YizhiRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
    <div class="hezhunRules" v-if="hezhun">
      <HezhunRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
    <div class="hezhunRules" v-if="guifan">
      <GuifanRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
    <div class="zhengzeRules" v-if="Zhengze">
      <ZhengzeRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
    <div class="yuzhiRules" v-if="yuzhi">
      <YuzhiRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
    <div class="kuaisuRules" v-if="Kuaisu">
      <KuaisuRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
    <div class="duoziduan" v-if="Duoziduan">
      <DuoziduanRules
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        @closeSelf="closeSelf"
        :postData="postData"
        :rowId="rowId"
        :currentRuleData="currentRuleData"
      />
    </div>
  </div>
</template>

<script>
import { getOneRule } from "@/api/dataCenter/dataGovernance";
import WeiyiRules from "./components/step3weiyi.vue";
import Feikong from "./components/step3feikongs.vue";
import ZuheweiyiRules from "./components/step3zuheweiyis.vue";
import YizhiRules from "./components/step3yizhi.vue";
import HezhunRules from "./components/step3hezhun.vue";
import GuifanRules from "./components/step3guifan.vue";
import ZhengzeRules from "./components/step3zhengze.vue";
import YuzhiRules from "./components/step3yuzhis.vue";
import KuaisuRules from "./components/step3kuaisus.vue";
import DuoziduanRules from "./components/step3duoziduan.vue";
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
      postData: {
        assessTable: {},
        type: "",
      },
      currentRuleData: {},
    };
  },
  props: {
    ruleName: String,
    rowId: Number,
    assessTable: Object,
    rowType: Number,
  },

  created() {
    console.log(this.rowType);
    this.getData();
    this.postData.assessTable = this.assessTable;
    switch (this.rowType) {
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
      // case 8:
      //   this.feikong = false;
      //   this.weiyi = false;
      //   this.zuheweiyi = false;
      //   this.yizhi = false;
      //   this.hezhun = false;
      //   this.guifan = false;
      //   this.yuzhi = false;
      //   this.Zhengze = false;
      //   this.Tiaojian = true;
      //   this.Kuaisu = false;
      //   this.Duoziduan = false;
      //   break;
      case 9:
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
      // case 10:
      //   this.feikong = false;
      //   this.weiyi = false;
      //   this.zuheweiyi = false;
      //   this.yizhi = false;
      //   this.hezhun = false;
      //   this.guifan = false;
      //   this.yuzhi = false;
      //   this.Zhengze = false;
      //   this.Tiaojian = true;
      //   this.Kuaisu = false;
      //   this.Duoziduan = false;
      //   break;
      case 11:
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
    }
  },
  methods: {
    getData() {
      console.log(this.rowId);
      getOneRule({
        ids: this.rowId,
      }).then((res) => {
        //  console.log(res)
        this.postData.type = res.data.type;
        this.currentRuleData = res.data;
        console.log(this.currentRuleData);
      });
    },
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
.step3-view {
  height: 510px;
}
.ruleNameDiv {
  font-weight: bold;
  font-size: 18px;
  padding: 20px 50px;
  margin-bottom: 30px;
}
.theSteps {
  margin-bottom: 70px;
}
</style>
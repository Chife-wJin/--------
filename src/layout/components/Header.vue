<template>
  <div class="platform-layout-header">
    <div class="platform-layout-header-left">
      <div class="platform-layout-header-logo">
        <span class="header-logo-name">北京市第三次全国土壤普查电子台账系统</span>
        <!-- <span class="header-logo-line">|</span> -->
        <!-- <span class="header-logo-projectname">{{ projectName }}</span> -->
      </div>
    </div>
    <div class="platform-layout-header-menu">
      <top-nav class="topmenu-container" v-if="topNavIsShow" />
    </div>
    <div class="platform-layout-header-action">
      <span class="platform-layout-header-action__item">
        <img
          class="jeesite-header-user-dropdown__header"
          src="../../assets/images/platform/platform-header-person.png"
        />
        <span class="platform-layout-header-action__username">
          {{ userInfo.name }}
        </span>
      </span>
      <span class="line">|</span>
      <el-tooltip
        class="item"
        effect="dark"
        content="返回首页"
        placement="top"
        v-if="appList.length > 1"
      >
        <span class="platform-layout-header-action__item" @click="goback">
          <img src="../../assets/images/platform/platform-header-back.png" />
        </span>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="退出" placement="top">
        <span class="platform-layout-header-action__item" @click="logout">
          <img src="../../assets/images/platform/platform-header-out.png" />
        </span>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import TopNav from "@/components/TopNav";
import { topNavIsShow } from "@/settings";
import { mapGetters } from "vuex";
export default {
  name: "Header",
  components: {
    TopNav,
  },
  data: function () {
    return {
      projectName: "",
      topNavIsShow,
      appList: [],
    };
  },
  created: function () {
    this.projectName = window.localStorage.getItem("projectName");
    this.appList = JSON.parse(localStorage.getItem("applications"));
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store
          .dispatch("LogOut")
          .then(() => {
            location.reload();
          })
          .catch((err) => {});
      });
    },
    goback() {
      this.$router.push({ path: "/index" });
      this.$store.dispatch("tagsView/delAllOwnViews");
    },
  },
};
</script>

<style lang="scss" scoped></style>

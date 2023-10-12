<template>
  <div class="carbon-body">
    <h1 class="carbon-title">北京市第三次全国土壤普查电子台账系统</h1>
    <div class="carbon-content">
      <div
        class="carbon-item"
        v-for="item in appList"
        :key="item.id"
        @click="goToSub(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import router from "@/router";
import { resetRouter } from "@/router/resetRouter";

export default {
  data() {
    return { appList: [] };
  },
  created() {
    this.appList = JSON.parse(localStorage.getItem("applications"));
  },

  methods: {
    ...mapActions(["GenerateRoutes"]),
    // 点击应用获取应用下的菜单
    async goToSub(item) {
      localStorage.setItem("projectName", item.name);
      localStorage.setItem("applicationId", item.id);
      this.GenerateRoutes().then((accessRoutes) => {
        const findFirstPagePath = this.findFirstPage(accessRoutes);
        const routes = this.$store.state.permission.topbarRouters;
        const topbarRouters = routes;
        localStorage.setItem("topbarRouters", JSON.stringify(topbarRouters));
        sessionStorage.removeItem("currentIndex");
        resetRouter(router);
        router.addRoute({
          path: "/",
          component: () => import("@/layout/index.vue"),
          children: accessRoutes,
        });
        if (findFirstPagePath) {
          this.$router.push({
            path: findFirstPagePath,
          });
        }
      });
    },
    // 找到第一个需要跳转的页面
    findFirstPage(arr) {
      if (arr[0].children && arr[0].children.length) {
        return this.findFirstPage(arr[0].children);
      } else {
        return arr[0].path;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.carbon-body {
  width: 100%;
  height: 100vh;
  background: url("../assets/images/index-bg.png") no-repeat center center;
  background-size: cover;
  overflow: hidden;
  .carbon-title {
    font-size: 36px;
    text-align: center;
    color: #fff;
    margin: 0;
    margin: 30px 0 30px 0;
  }
  .carbon-content {
    display: flex;
    align-items: center;
    justify-content: center;
    .carbon-item {
      width: 300px;
      height: 240px;
      background-color: rgba(2, 167, 240, 0.631372549019608);
      font-size: 24px;
      color: #fff;
      padding: 0 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;
      margin-right: 20px;
    }
  }
}
</style>

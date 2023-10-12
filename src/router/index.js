import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export const constantRoutes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: (resolve) => require(["@/views/login"], resolve),
  },
  // 版本二首页
  {
    path: "/index",
    name: "Index",
    component: (resolve) => require(["@/views/index.vue"], resolve),
  },
  // 流程设计页面
  {
    path: "/oa/flowable/definition/model/",
    name: "Model",
    component: (resolve) =>
      require(["@/views/support/oa/flowable/definition/model"], resolve),
  },
  // 在线办公 -> 表单配置拖拉拽页面
  {
    path: "/oa/flowable/formConfig",
    name: "FormConfig",
    meta: {
      title: "表单生成",
    },
    component: (resolve) =>
      require(["@/views/support/oa/flowable/form/build"], resolve),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
});

export default router;

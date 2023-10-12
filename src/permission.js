import router from "./router";
import Router from "vue-router";
import store from "./store";
import { getToken } from "@/utils/auth";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { resetRouter } from "@/router/resetRouter";

const whiteList = ["/login"]; //白名单

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path == "/login") {
      next({
        path: "/index",
      });
      NProgress.done();
    } else {
      if (store.getters.sidebarRouters.length === 0 && to.name != "Index") {
        store.dispatch("GenerateRoutes").then((accessRoutes) => {
          resetRouter(router);
          router.addRoute({
            path: "/",
            component: () => import("@/layout/index.vue"),
            children: accessRoutes,
          });
          next({
            ...to,
            replace: true,
          });
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      });
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

import Router from 'vue-router'
import {
  constantRoutes
} from './index'; //导入初始化router
// 传入当前router
export function resetRouter(router) {
  const createRouter = () => {
    return new Router({
      mode: 'history',
      routes: constantRoutes,
    });
  }
  // 用初始化的matcher替换当前router的matcher
  router.matcher = createRouter().matcher;
}
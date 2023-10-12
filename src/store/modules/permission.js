import {
  constantRoutes
} from "@/router";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import {
  getRouters
} from "@/api/styem/menu";
const permission = {
  state: {
    routes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      if (state.routes.length == 0) {
        state.routes = constantRoutes;
      } else {
        state.routes = state.routes.concat(routes);
      }
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes);
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes;
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = constantRoutes.concat(routes);
      state.sidebarRouters = routes;
    },
  },
  actions: {
    GenerateRoutes({
      commit,
      state
    }) {
      return new Promise((resolve) => {
        const applicationId = localStorage.getItem("applicationId");
        getRouters().then(({
          data
        }) => {
          // 由于后端搬数据的时候，把所有的系统的路由都迁移过来。而本系统只需要数据中心  data[0] 是数据中心  data[1] 系统设置
          data = [data[1],data[0]];
          const sdata = JSON.parse(JSON.stringify(data));
          const rdata = JSON.parse(JSON.stringify(data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          rewriteRoutes.push({
            path: "*",
            // redirect: "/dataCenter/centerIndex/index",
            redirect: "/dataCenter/centerIndex/index",
            hidden: true,
          });
          commit("SET_ROUTES", rewriteRoutes);
          commit("SET_DEFAULT_ROUTES", sidebarRoutes);
          commit("SET_SIDEBAR_ROUTERS", sidebarRoutes);
          commit("SET_TOPBAR_ROUTES", sidebarRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
  },
};

function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    // 路由组件
    if (
      route.component &&
      route.component != "Layout" &&
      route.component != "ParentView"
    ) {
      route.path = "/" + route.component;
      route.component = loadView(route.component);
    } else {
      route.path = route.href || "/" + route.id;
      route.component = ParentView;
    }
    route.meta = {};
    // 菜单名称
    if (route.name) {
      route.meta["title"] = route.name;
      delete route["name"];
    }
    // 菜单icon
    if (route.icon) {
      route.meta["icon"] = route.icon;
      delete route["icon"];
    }
    // 路由名称
    if (route.router) {
      route.name = route.router;
    }
    route.meta["affix"] = false;
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (!lastRouter) {
        el.children.forEach((c) => {
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;
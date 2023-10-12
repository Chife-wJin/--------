<template>
  <el-menu :default-active="activeMenu" mode="horizontal" background-color="#1576e0" text-color="#fff"
    active-text-color="#fff" @select="handleSelect">
    <template v-for="(item, index) in topMenus">
      <el-menu-item :index="item.path" :key="index" v-if="index < visibleNumber">
        <svg-icon v-if="item.icon" :icon-class="item.icon" />
        <!-- <i class="menu-img" :class="item.meta.icon"></i> -->
        <span class="menu-text">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
    <!-- 如果子菜单多的时候 回显 -->
    <el-submenu index="more" v-if="topMenus.length > visibleNumber">
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item :index="item.path" :key="index" v-if="index >= visibleNumber">
          <svg-icon :icon-class="item.icon" />
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-submenu>
  </el-menu>
</template>
<script>
import { constantRoutes } from "@/router";
export default {
  data() {
    return {
      visibleNumber: 8,
      isFrist: false,
      sonActivePath: "",

    };
  },
  computed: {
    topMenus() {
      let topMenus = [];
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          if (menu.path === "/") {
            topMenus.push(menu.children[0]);
          } else {
            topMenus.push(menu);
          }
        }
        // topMenus = menu;
        // topMenus.forEach((item) => {
        //   // 第一级子菜单
        //   if (item.child) {
        //     item.path = item.children[0].path;
        //     // 第二级子菜单
        //     item.children.forEach((temp) => {
        //       if (temp.child) {
        //         item.path = temp.children[0].path;
        //       }
        //     });
        //   }
        // });
      });
      return topMenus;
    },
    routers() {
      // debugger
      return JSON.parse(window.localStorage.getItem("topbarRouters"));
    },
    childrenMenus() {
      var childrenMenus = [];
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            router.children[item].parentPath = router.path;
          }
          childrenMenus.push(router.children[item]);
        }
      });
      return constantRoutes.concat(childrenMenus);
    },
    activeMenu() {
      const activePath = this.$route.matched[1].path;
      this.activeRoutes(activePath);
      sessionStorage.setItem(
        "currentIndex",
        JSON.stringify(this.$route.matched[1].path)
      );
      return activePath;
    },
  },

  beforeMount() {
    window.addEventListener("resize", this.setVisibleNumber);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setVisibleNumber);
  },
  mounted() { },
  methods: {
    // 设置显示数量
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width;
      this.visibleNumber = parseInt(width / 110);
    },
    // 菜单选择事件
    handleSelect(key) {
      sessionStorage.setItem("currentIndex", JSON.stringify(key));
      // 如果是http链接，则进行跳转
      if (this.ishttp(key)) {
        window.open(key, "_blank");
      } else {
        // 获取当前标签下的菜单数据
        var routes = this.activeRoutes(key, "isSelect");
        var pathb = key;
        if (routes.length != 0) {
          // 找到第一个菜单进行push
          this.setSonDefaultActive(routes);
          pathb = this.sonActivePath;
        }
        this.$router.push({ path: pathb });
      }
    },
    // 找到第一个菜单进行push
    setSonDefaultActive(routes) {
      if (routes[0].children) {
        this.setSonDefaultActive(routes[0].children);
      } else {
        this.sonActivePath = routes[0].path;
      }
    },
    // 获取当前激活的菜单数据
    activeRoutes(key, type) {
      var routes = [];
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (item.parentPath === key || (key == "index" && "" == item.path)) {
            routes.push(item);
          }
        });
      }
      if (!type) {
        if (routes.length > 0) {
          this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
        } else {
          this.$store.commit("SET_SIDEBAR_ROUTERS", []);
        }
      }
      return routes;
    },
    // 判断是否http(s),是的话进行跳转
    ishttp(url) {
      return url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1;
    },
  },
};
</script>

<style lang="scss" scoped></style>

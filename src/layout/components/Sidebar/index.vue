<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu mode="vertical" :default-active="activeMenu" :unique-opened="true" :collapse-transition="false"
      class="el-menu--vertical">
      <sidebar-item v-for="route in sidebarRouters" :key="route.id" :item="route" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./sidebarItem";
export default {
  data: function () {
    return {
      isCollapse: false,
    };
  },
  components: {
    SidebarItem,
  },
  computed: {
    ...mapGetters(["sidebarRouters"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      return path;

    },
  },
};
</script>

<style lang="scss" scoped></style>

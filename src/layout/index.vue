<template>
  <div class="app-wrapper">
    <Header />
    <div class="platform-layout" v-if="!isHomePage">
      <div class="sidebar-container">
        <sidebar></sidebar>
      </div>
      <div class="platform-layout-main">
        <TagsView></TagsView>
        <app-main />
      </div>
    </div>
    <div class="platform-layout-main platform-layout-all" v-else>
      <app-main />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Header, Sidebar, TagsView, AppMain } from "./components";
export default {
  name: "Layout",
  components: {
    Header,
    Sidebar,
    TagsView,
    AppMain,
  },
  computed: {
    ...mapState({
      sidebarRouters: (state) => state.permission.sidebarRouters,
    }),
    isHomePage() {
      return this.sidebarRouters.length === 0;
    },
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <i class="el-icon-refresh-right"></i> 刷新页面
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <i class="el-icon-close"></i> 关闭当前
      </li>
      <li @click="closeOthersTags">
        <i class="el-icon-circle-close"></i> 关闭其他
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <i class="el-icon-back"></i> 关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <i class="el-icon-right"></i> 关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <i class="el-icon-circle-close"></i> 全部关闭
      </li>
    </ul>
    <el-dropdown>
      <el-button type="primary" size="mini">
        更多
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          style="font-size: 12px"
          @click.native="closeSelectedTag(activeTag)"
          >关闭当前</el-dropdown-item
        >
        <el-dropdown-item
          style="font-size: 12px"
          @click.native="closeOthersTags(2)"
          >关闭其它</el-dropdown-item
        >
        <el-dropdown-item
          style="font-size: 12px"
          @click.native="closeAllTags(selectedTag)"
          >关闭所有</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import ScrollPane from "./ScrollPane";
import path from 'path'
import tab from "./tab";
export default {
  name: "TagsView",
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      activeTag: {},
    };
  },
  computed: {
    visitedViews() {
      const visitedViews = this.$store.state.tagsView.visitedViews;
      this.$nextTick(() => {
        visitedViews.length && (visitedViews[0].meta.affix = true);
      });
      return visitedViews;
      // return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$store.state.permission.routes;
    },
    theme() {
      return this.$store.state.settings.theme;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler: function () {
        if (
          ["taskDetail", "document", "pollutionDetail","CarbonAssetIndex","ContaminationIndex","EarlyIndex","CenterIndex","ModelIndex"].includes(
            this.$route.name
          )
        )
          return;
        this.addTags();
        this.moveToCurrentTag();
      },
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  mounted() {
    this.initTags();
    // this.addTags();
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
      // console.log(!this.$route.query.id);
      // if (!this.$route.query.id) {
      //   return route.path === this.$route.path;
      // } else if (this.$route.query.id) {
      //   let come =
      //     route.path === this.$route.path &&
      //     route.params.id === this.$route.query.id;
      //   return come;
      // } else {
      //   return false;
      // }
    },
    activeStyle(tag) {
      if (!this.isActive(tag)) {
        return {};
      } else {
        this.activeTag = tag;
        return {};
      }
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    isFirstView() {
      try {
        return (
          this.selectedTag.fullPath === this.visitedViews[1].fullPath ||
          this.selectedTag.fullPath === "/index"
        );
      } catch (err) {
        return false;
      }
    },
    isLastView() {
      try {
        return (
          this.selectedTag.fullPath ===
          this.visitedViews[this.visitedViews.length - 1].fullPath
        );
      } catch (err) {
        return false;
      }
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      this.$nextTick(() => {
        const tags = this.$refs.tag;
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      tab.refreshPage(view);
    },
    closeSelectedTag(view) {
      tab.closePage(view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeRightTags() {
      tab.closeRightPage(this.selectedTag).then((visitedViews) => {
        if (!visitedViews.find((i) => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews);
        }
      });
    },
    closeLeftTags() {
      tab.closeLeftPage(this.selectedTag).then((visitedViews) => {
        if (!visitedViews.find((i) => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews);
        }
      });
    },
    closeOthersTags(type) {
      if (type == 2) {
        this.$router.push(this.activeTag).catch(() => {});
        tab.closeOtherPage(this.activeTag).then(() => {
          this.moveToCurrentTag();
        });
      } else {
        this.$router.push(this.selectedTag).catch(() => {});
        tab.closeOtherPage(this.selectedTag).then(() => {
          this.moveToCurrentTag();
        });
      }
    },
    closeAllTags(view) {
      tab.closeAllPage().then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === this.$route.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 150;
      // const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = window.innerWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX; // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
  /deep/.el-scrollbar__wrap {
    height: 58px;
  }
}
.tags-view-container {
  background-color: #fff;
  color: #000;
  height: 40px;
  width: 100%;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 38px;
      line-height: 40px;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      // margin-right: 10px;
      font-size: 14px;
      margin-left: 5px;
      &.active {
        .el-icon-close {
          opacity: 1;
        }
        color: #409eff;
        border-bottom: 3px solid #409eff;
      }
    }
    .tags-view-item::before,
    .tags-view-item::after {
      height: 38px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      content: "";
      opacity: 0;
      pointer-events: none;
      -webkit-transition: opacity 0.4s, -webkit-transform 0.4s;
      transition: opacity 0.4s, transform 0.4s;
    }

    .tags-view-item::before {
      border-bottom: 3px solid #409eff;
      -webkit-transform: scale(0, 1);
      transform: scale(0, 1);
    }
    .tags-view-item:hover {
      color: #409eff;
      .el-icon-close {
        opacity: 1;
      }
    }
    .tags-view-item:hover::before,
    .tags-view-item:hover::after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
.el-icon-s-fold:before,
.el-icon-s-unfold:before {
  font-size: 18px;
}
.tags-view-container {
  display: flex;
  align-items: center;
  padding: 0 10px;
}
.el-dropdown {
  margin-left: 10px;
}
.tags-view-wrapper {
  margin-left: 10px;
  .tags-view-item {
    .el-icon-close {
      opacity: 0;
      width: 18px;
      height: 18px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
        font-size: 18px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>

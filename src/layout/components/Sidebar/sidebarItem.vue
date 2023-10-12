<template>
  <div>
    <template v-if="!item.children">
      <app-link v-if="item.meta" :to="item.path">
        <el-menu-item
          :index="item.path || item.name"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="item.meta.icon || (item.meta && item.meta.icon)"
            :title="item.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu
      v-else
      ref="subMenu"
      :index="item.path || item.name"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import Item from "./Item";
import AppLink from "./appLink";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      enforcementBoolean: false,
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.side-alone-item {
  width: 100%;
  height: 56px;
  line-height: 56px;
  display: block;
  padding-left: 20px;
  color: rgb(191, 203, 217);
  font-size: 14px;
  cursor: pointer;
}
</style>

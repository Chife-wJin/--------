<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
        class="item"
        effect="dark"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
        v-show="hiddenSearch"
      >
        <el-button
          size="mini"
          circle
          icon="el-icon-search"
          @click="toggleSearch()"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button
          size="mini"
          circle
          icon="el-icon-refresh"
          @click="refresh()"
        />
      </el-tooltip>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {
      // 显隐数据
      value: [],
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    hiddenSearch: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>

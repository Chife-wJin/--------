<template>
  <div class="tree">
    <el-tree
      v-loading="loading"
      :data="tree"
      :props="defaultProps"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>
<script>
export default {
  name: "Tree",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "classifyName",
      },
    };
  },

  props: {
    tree: Array,
    loading: {
      default: true,
    },
  },
  mounted() {},
  methods: {
    handleNodeClick(data) {
      this.$emit('handleNodeClick',data.id)
    },
  },
};
</script>

<style lang="scss" scoped>
.tree {
  padding-top: 12px;
  min-height: 100%;
  background: white;
  width: 200px;
  overflow: auto;
  ::v-deep .el-tree-node.is-current > .el-tree-node__content {
    background: white;
  }
  ::v-deep .el-tree-node > .el-tree-node__content:hover {
    background: #a7c7e7;
  }
  .el-scrollbar .el-scrollbar__wrap {overflow-x: auto;}
}
</style>
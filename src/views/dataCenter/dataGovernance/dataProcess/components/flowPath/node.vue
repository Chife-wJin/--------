<template>
  <div
    ref="node"
    :style="nodeContainerStyle"
    @click="clickNode"
    @mouseup="changeNodeSite"
    :class="nodeContainerClass"
  >
    <!-- 最左侧的那条竖线 -->
    <div class="ef-node-left"></div>
    <!-- 节点类型的图标 -->
    <div class="ef-node-left-ico flow-node-drag">
      <!-- <i :class="nodeIcoClass"></i> -->
      <svg-icon
        :class="{ 'flow-node-drag': nodeIcoClass['flow-node-drag'] }"
        :icon-class="node.ico"
      ></svg-icon>
    </div>
    <!-- 节点名称 -->
    <div class="ef-node-text" :show-overflow-tooltip="true">
      {{ node.name }}
    </div>
    <!-- 节点状态图标 -->
    <div class="ef-node-right-ico">
      <i
        class="el-icon-circle-check el-node-state-success"
        v-show="node.state === 'success'"
      ></i>
      <i
        class="el-icon-circle-close el-node-state-error"
        v-show="node.state === 'error'"
      ></i>
      <i
        class="el-icon-warning-outline el-node-state-warning"
        v-show="node.state === 'warning'"
      ></i>
      <i
        class="el-icon-loading el-node-state-running"
        v-show="node.state === 'running'"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    activeElement: Object,
  },
  data() {
    return {};
  },
  computed: {
    nodeContainerClass() {
      return {
        "ef-node-container": true,
        "ef-node-active":
          this.activeElement.type == "node"
            ? this.activeElement.nodeId === this.node.nodeId
            : false,
      };
    },
    // 节点容器样式
    nodeContainerStyle() {
      return {
        top: this.node.top + "px",
        left: this.node.left + "px",
      };
    },
    nodeIcoClass() {
      var nodeIcoClass = {};
      nodeIcoClass[this.node.ico] = true;
      // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
      nodeIcoClass["flow-node-drag"] = this.node.viewOnly ? false : true;
      return nodeIcoClass;
    },
  },
  mounted() {
    // 给图标的下级标签use添加类名, 添加flow-node-drag类名后图标可拖拽连线
    const svgs = document.querySelectorAll(".svg-icon.flow-node-drag");
    let length = svgs.length;
    for (let i = 0; i < length; i++) {
      const use = svgs[i].firstChild;
      use.classList.add("flow-node-drag");
    }
  },
  methods: {
    // 点击节点
    clickNode() {
      this.$emit("clickNode", this.node.nodeId, this.node.type);
    },
    // 鼠标移动后抬起
    changeNodeSite() {
      // 避免抖动
      const left = this.$refs.node.style.left.match(/\d+/g)[0];
      const top = this.$refs.node.style.top.match(/\d+/g)[0];
      if (this.node.left == left && this.node.top == top) {
        return;
      }
      this.$emit("changeNodeSite", {
        nodeId: this.node.nodeId,
        left: left,
        top: top,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.svg-icon {
  margin-right: 0px;
}
</style>

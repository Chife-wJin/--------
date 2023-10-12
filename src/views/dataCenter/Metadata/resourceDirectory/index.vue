<template>
  <div class="resource-dir">
    <div class="tree">
      <Tree
        :tree="tree"
        :loading="loading"
        @handleNodeClick="handleNodeClick"
      />
    </div>
    <div class="content">
      <List @changeCom="changeCom" />
      <View />
      <el-dialog
        :title="title"
        :visible.sync="isShowAlert"
        width="1000px"
        append-to-body
      >
        <New :type="type" :id="id" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Tree from "../components/tree.vue";
import List from "./detail/list.vue";
import New from "./detail/new.vue";
import { getResourceDirectoryTree } from "@/api/dataCenter/metaData.js";
export default {
  name: "WqzhhjglptUiIndex",
  data() {
    return {
      isShowAlert: false,
      loading: true,
      title: "",
      tree: [],
      type: "new",
      id: "",
    };
  },

  created() {
    this.getResourceDirectoryTree();
  },
  components: {
    Tree,
    List,
    New,
  },
  methods: {
    changeCom: function (type, title) {
      this.isShowAlert = true;
      this.type = type;
      this.title = title;
    },
    handleNodeClick(data) {
      
    },
    getResourceDirectoryTree() {
      getResourceDirectoryTree().then((res) => {
        this.tree = res.data.length ? res.data : [];
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-dir {
  display: flex;
  min-height: 100%;
  .tree {
    width: 200px;
  }
  .content {
    width: calc(100% - 210px);
    padding-left: 10px;
  }
}
</style>
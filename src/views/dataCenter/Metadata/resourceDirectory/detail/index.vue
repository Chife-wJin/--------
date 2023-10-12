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
      <List @changeCom="changeCom" ref="list" :treeId="treeId" />
      <View />
      <el-dialog
        :title="title"
        v-if="isShowAlert"
        :before-close="handleDialogClose"
        :visible="true"
        width="1000px"
        append-to-body
      >
        <New :type="type" :id="id" @save="save" @goBack="handleDialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Tree from "../../components/tree.vue";
import List from "./list.vue";
import New from "./new.vue";
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
      treeId: "",
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
    handleDialogClose: function () {
      this.isShowAlert = false;
    },
    save: function () {
      this.isShowAlert = false;
      this.$refs.list.getList();
    },
    changeCom: function (type, title, id) {
      if (id) {
        this.id = id;
      }
      this.isShowAlert = true;
      this.type = type;
      this.title = title;
    },
    handleNodeClick(id) {
      this.treeId = id;
      this.$nextTick(() => {
        this.$refs.list.getList();
      });
    },
    getResourceDirectoryTree() {
      getResourceDirectoryTree().then((res) => {
        console.log(res.data)
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
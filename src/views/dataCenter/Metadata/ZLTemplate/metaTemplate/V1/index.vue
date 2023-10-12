<template>
  <div class="resource-dir">
    <div class="tree">
      <Tree
        :tree="tree"
        @handleNodeClick="handleNodeClick"
        :loading="loading"
      />
    </div>
    <div class="content">
      <List
        @changeCom="changeCom"
        @back="back"
        ref="list"
        :tMetaTemplate="tMetaTemplate"
        :treeId="treeId"
      />
      <el-dialog
        :title="title"
        v-if="isShowAlert"
        :before-close="handleDialogClose"
        :visible="true"
        width="1000px"
        append-to-body
      >
        <New :type="type" :id="id" @save="save" :tMetaTemplateId="tMetaTemplate" @goBack="handleDialogClose"
      /></el-dialog>
    </div>
  </div>
</template>
<script>
import { getTemplateDetailTree } from "@/api/dataCenter/metaData.js";
import Tree from "../../../components/tree.vue";
import List from "./list.vue";
import New from "./new.vue";
export default {
  name: "WqzhhjglptUiIndex",
  data() {
    return {
      isShowAlert: false,
      title: "",
      loading: true,
      tree: [],
      type: "new",
      id: "",
      treeId: "",
    };
  },
  props: {
    tMetaTemplate: String,
  },
  created() {
    this.getTemplateDetailTree();
  },
  components: {
    Tree,
    List,
    New,
  },
  methods: {
    save: function () {
      this.isShowAlert = false;
      this.$refs.list.getList();
    },
    handleDialogClose: function () {
      this.isShowAlert = false;
    },
    back: function () {
      this.$emit("back");
    },
    handleNodeClick(id) {
      this.treeId = id;
      this.$nextTick(() => {
        this.$refs.list.getList();
      });
    },
    changeCom: function (type, title, id) {
      if (id) {
        this.id = id;
      }
      this.isShowAlert = true;
      this.type = type;
      this.title = title;
    },
    getTemplateDetailTree() {
      getTemplateDetailTree({ tMetaTemplateId: this.tMetaTemplate }).then(
        (res) => {
          this.tree = res.data.length ? res.data : [];
          this.loading = false;
        }
      );
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
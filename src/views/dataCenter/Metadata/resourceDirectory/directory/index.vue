<template>
  <div class="resource-dir">
    <List @changeCom="changeCom" ref="list" />
    <el-dialog
      :title="title"
      v-if="isShowAlert"
      :before-close="handleDialogClose"
      :visible="true"
      width="1000px"
      append-to-body
    >
      <New :type="type" :id="id" @save="save" />
    </el-dialog>
  </div>
</template>
<script>
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
    };
  },

  created() {
    this.getResourceDirectoryTree();
  },
  components: {
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
    changeCom: function (type, title,id) {
       if (id) {
        this.id = id;
      }
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
</style>
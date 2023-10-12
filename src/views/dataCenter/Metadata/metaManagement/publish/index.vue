<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="待发布" name="first"
        ><List status="11" @changeCom="changeCom"
      /></el-tab-pane>
      <el-tab-pane label="已发布" name="second"
        ><List status="12" @changeCom="changeCom" />
      </el-tab-pane>
      <el-tab-pane label="已撤回" name="third"
        ><List status="13" @changeCom="changeCom"
      /></el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="title"
      :visible.sync="isShowAlert"
      width="1200px"
      append-to-body
    >
      <New :type="type" :id="id" />
    </el-dialog>
  </div>
</template>

<script>
import List from "./list.vue";
import New from "../management/new.vue";
export default {
  name: "WqzhhjglptUiIndex",

  data() {
    return {
      activeName: "first",
      isShowAlert: false,
      title: "",
      type: "new",
      id: "",
    };
  },
  components: {
    List,
    New,
  },

  methods: {
    changeCom: function (type, title) {
      this.isShowAlert = true;
      this.type = type;
      this.title = title;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
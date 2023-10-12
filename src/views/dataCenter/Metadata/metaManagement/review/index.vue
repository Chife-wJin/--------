<template>
  <div>
    <el-tabs v-model="activeName"  type="border-card">
      <el-tab-pane label="待审核" name="first"><List status="01" @changeCom="changeCom" /></el-tab-pane>
      <el-tab-pane label="审核通过" name="second"
        ><List status="02" @changeCom="changeCom"/>
      </el-tab-pane>
      <el-tab-pane label="已退回" name="third"><List status="03" @changeCom="changeCom"/></el-tab-pane>
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
      isShowAlert: false,
      title: "",
      activeName: "first",
      curPageName: "元数据元素添加",
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
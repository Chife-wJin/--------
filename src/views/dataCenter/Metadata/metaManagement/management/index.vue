<template>
  <div>
    <List @changeCom="changeCom" ref="list" />
    <el-dialog
      :title="title"
      :visible.sync="isShowAlert"
      width="1200px"
      append-to-body
      v-if="isShowAlert"
    >
      <New :type="type" :id="id" @closeSelf="closeSelf" />
    </el-dialog>
  </div>
</template>

<script>
import List from "./list.vue";
import New from "./new.vue";
export default {
  name: "WqzhhjglptUiIndex",
  data() {
    return {
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
  created() {
    // if (this.$route.query.id) {
    //   this.activeName = "third";
    // }
  },
  methods: {
    changeCom: function (type, title, id) {
      if (id) {
        this.id = id;
        // console.log(this.id)
        console.log(this.id)
      }
      this.type = type;
      this.title = title;
      this.isShowAlert = true;
    },
    closeSelf() {
      this.isShowAlert = false;
      this.$refs.list.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
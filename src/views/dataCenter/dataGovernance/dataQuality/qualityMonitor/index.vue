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
      <New :id="id" :type="type" @goBack="closeSelf" />
    </el-dialog>
  </div>
</template>

<script>
import List from "./list.vue";
import New from "./new.vue";
export default {
  name: "qualityMonitor",
  data() {
    return {
      isShowAlert: false,
      title: "",
      type:"",
      id: 0,
    };
  },
  components: {
    List,
    New,
  },
  created() {

  },
  methods: {
    changeCom: function (type, title, id) {
      if (id) {
        this.id = id;
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
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
      <New :type="type" :row="row" @closeSelf="closeSelf" />
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="isCheckShow"
      width="1200px"
      append-to-body
      v-if="isCheckShow"
    >
      <Check :type="type" :row="row" @closeSelf="closeSelf" />
    </el-dialog>
  </div>
</template>

<script>
import List from "./list.vue";
import New from "./new.vue";
import Check from "./check.vue";
export default {
  name: "WqzhhjglptUiIndex",
  data() {
    return {
      isShowAlert: false,
      isCheckShow:false,
      title: "",
      type: "new",
      id: "",
      row:{}
    };
  },
  components: {
    List,
    New,
    Check
  },
  created() {

  },
  methods: {
    changeCom: function (type, title, id, row) {
      if (id) {
        this.id = id;
        this.row = row;
        console.log(this.id)
      }
      this.type = type;
      this.title = title;
      this.isShowAlert = true;
      this.isCheckShow = false
      if(type == "view"){
        this.isCheckShow = true
        this.isShowAlert = false;
      }
    },
    closeSelf() {
      this.isShowAlert = false;
      this.isCheckShow = false
      this.$refs.list.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
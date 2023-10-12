<template>
  <div>
    <List @changeCom="changeCom" ref="list" />
    <el-dialog
      :title="title"
      v-if="isShowAlert"
      :before-close="handleDialogClose"
      :visible="true"
      width="1000px"
      append-to-body
      ><New :type="type" :id="id" @save="save" @goBack="handleDialogClose"
    /></el-dialog>
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
      type: "new",
      id: "",
    };
  },
  components: {
    List,
    New,
  },

  methods: {
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
        handleDialogClose: function () {
      this.isShowAlert = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
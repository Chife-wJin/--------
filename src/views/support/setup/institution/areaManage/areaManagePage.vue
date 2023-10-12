<template>
  <div class="information-inner information-styem" ref="informationInner">
    <area-manage-list
      ref="dataList"
      @handleSeeAmend="handleSeeAmend"
      @backHandle="backHandle"
    ></area-manage-list>
    <el-dialog
      :title="dialogTxt"
      v-if="check"
      :visible="true"
      width="700px"
      :before-close="handleDialogCheckClose"
      :close-on-click-modal="false"
      append-to-body
    >
      <area-manage-amend @backHandle="backHandle"></area-manage-amend>
    </el-dialog>
  </div>
</template>

<script>
import areaManageList from "./areaManageList";
import areaManageAmend from "./areaManageAmend";
import bus from "@/utils/vueBus";

export default {
  components: {
    areaManageList,
    areaManageAmend,
  },
  data() {
    return {
      activeName: "list",
      dialogTxt: "",
      check: false,
    };
  },
  methods: {
    handleSeeAmend(id) {
      if (id) {
        this.dialogTxt = "修改";
      } else {
        this.dialogTxt = "新增";
      }
      this.check = true;
      this.$nextTick(() => {
        bus.$emit("outAreaComeId", id);
      });
    },
    backHandle(name) {
      this.check = false;
      if (name == "update") {
        this.$refs.dataList.getAreaList();
      }
    },
    handleDialogCheckClose() {
      this.check = false;
      // this.handleCheckClear();
      // this.clearDialog();
      // this.$refs.uploadFile0 && this.$refs.uploadFile0.handleClear();
      // this.$refs.uploadFile1 && this.$refs.uploadFile1.handleClear();
      // this.$refs.uploadFile2 && this.$refs.uploadFile2.handleClear();
    },
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <div class="information-inner information-styem" ref="informationInner">
    <el-row :gutter="20" class="information-styme-row">
      <el-col :span="24" class="information-styme-col">
        <business-list
          ref="dataList"
          @handleSeeAmend="handleSeeAmend"
          @backHandle="backHandle"
        ></business-list>
        <el-dialog
          :title="dialogTxt"
          v-if="check"
          :visible="true"
          width="80%"
          :before-close="handleDialogCheckClose"
          :close-on-click-modal="false"
          append-to-body
        >
          <business-amend @backHandle="backHandle" :detail="detail"></business-amend>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import businessList from "./businessList";
import businessAmend from "./businessAmend";
import Bus from "@/utils/vueBus";
import { deepClone } from "@/utils";
export default {
  components: {
    businessList,
    businessAmend,
  },
  data() {
    return {
      dialogTxt: "",
      check: false,
      detail: {},
    };
  },
  methods: {
    tabClick(tab) {
      if (tab.name === "list") {
        this.tabState = "add";
      } else if (tab.name === "add") {
        Bus.$emit("outComeId", "");
      }
    },
    handleSeeAmend(row) {
      if (row && row.id) {
        this.dialogTxt = "修改";
      } else {
        this.dialogTxt = "新增";
      }
      this.check = true;
      this.detail = deepClone(row);
    },
    backHandle(name) {
      this.check = false;
      this.activeName = "list";
      this.tabState = "add";
      if (name == "update") {
        this.$refs.dataList.getGenTableList();
      }
    },
    handleDialogCheckClose() {
      this.check = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  margin-top: 10px;
  overflow-y: scroll;
}
</style>

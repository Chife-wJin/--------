<template>
  <div class="information-inner information-styem" ref="informationInner">
    <el-row :gutter="20" class="information-styme-row">
      <el-col :span="24" class="information-styme-col">
        <scheme-list
          ref="dataList"
          @handleSeeAmend="handleSeeAmend"
          @backHandle="backHandle"
        ></scheme-list>
        <el-dialog
          :title="dialogTxt"
          v-if="check"
          :visible="true"
          width="80%"
          :before-close="handleDialogCheckClose"
          :close-on-click-modal="false"
          append-to-body
        >
          <scheme-amend @backHandle="backHandle"></scheme-amend>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import schemeList from "./schemeList";
import schemeAmend from "./schemeAmend";
import { officeTreeData } from "@/api/styem/dept.js";
import Bus from "@/utils/vueBus";
export default {
  components: {
    schemeList,
    schemeAmend,
  },
  data() {
    return {
      dialogTxt: "",
      check: false,
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
    handleSeeAmend(id) {
      if (id) {
        this.dialogTxt = "修改";
      } else {
        this.dialogTxt = "新增";
      }
      this.check = true;
      this.$nextTick(() => {
        Bus.$emit("outComeId", id);
      });
    },
    backHandle(name) {
      this.check = false;
      if (name == "update") {
        this.$refs.dataList.getGenSchemeList();
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
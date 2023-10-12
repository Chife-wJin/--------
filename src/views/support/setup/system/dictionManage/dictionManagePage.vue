<template>
  <div class="information-inner information-styem" ref="informationInner">
    <diction-manage-list
      ref="dataList"
      @handleSeeAmend="handleSeeAmend"
    ></diction-manage-list>
    <el-dialog
      :title="tabState == 'add' ? '字典添加' : '字典修改'"
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <diction-manage-amend @backHandle="backHandle"></diction-manage-amend>
    </el-dialog>
  </div>
</template>

<script>
import dictionManageList from "./dictionManageList";
import dictionManageAmend from "./dictionManageAmend";
export default {
  components: {
    dictionManageList,
    dictionManageAmend,
  },
  data() {
    return {
      tabState: "add",
      dialogFormVisible: false,
    };
  },
  methods: {
    handleSeeAmend(stateObj) {
      this.tabState = stateObj.tabState;
      this.dialogFormVisible = true;
    },
    backHandle(name) {
      this.dialogFormVisible = false;
      if (name == "update") {
        this.$refs.dataList.geoCategoryParams.pageNo = 1;
        this.$refs.dataList.getSpaceList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-list-content {
  padding: 0;
}
</style>

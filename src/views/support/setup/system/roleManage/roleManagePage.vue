<template>
  <div class="information-inner information-styem" ref="informationInner">
    <role-manage-list
      ref="dataList"
      @handleSeeAmend="handleSeeAmend"
      @backHandle="backHandle"
    ></role-manage-list>
    <el-dialog
      :title="tabState == 'add' ? '角色添加' : '角色修改'"
      :visible.sync="addShow"
      width="800px"
    >
      <role-manage-amend
        :officeListData="officeListData"
        @backHandle="backHandle"
      ></role-manage-amend>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="seeShow" width="800px">
      <role-manage-allot
        :officeListData="officeListData"
        @backHandle="backHandle"
      ></role-manage-allot>
    </el-dialog>
  </div>
</template>

<script>
import roleManageList from "./roleManageList";
import roleManageAmend from "./roleManageAmend";
import roleManageAllot from "./roleManageAllot";
import { officeList } from "@/api/styem/dept";
export default {
  components: {
    roleManageList,
    roleManageAmend,
    roleManageAllot,
  },
  data() {
    return {
      activeName: "list",
      tabState: "list",
      officeListData: [],
      addShow: false,
      seeShow: false,
    };
  },
  created() {
    this.getOfficeList();
  },
  methods: {
    async getOfficeList() {
      const reponse = await officeList();
      const menu = this.handleTree(
        reponse.data,
        "id",
        "parentId",
        "children",
        "0"
      );
      this.officeListData = menu;
    },
    handleSeeAmend(stateObj) {
      this.tabState = stateObj.tabState;
      if (this.tabState == "add" || this.tabState == "amend") {
        this.addShow = true;
      } else if (this.tabState == "see") {
        this.seeShow = true;
      }
    },
    backHandle(name) {
      console.log(name)
      this.addShow = false;
      this.seeShow = false;
      if (name == "update") {
        this.$refs.dataList.getRoleList();
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
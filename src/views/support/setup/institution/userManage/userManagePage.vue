<template>
  <div class="information-inner information-styem" ref="informationInner">
    <user-manage-list
      ref="dataList"
      :deptId="deptId"
      :deptOptions="deptOptions"
      @handleSeeAmend="handleSeeAmend"
      @editTableHeader="editTableHeader"
      @backHandle="backHandle"
    ></user-manage-list>
    <el-dialog
      :title="dialogTxt"
      v-if="check"
      :visible="true"
      width="1200px"
      :before-close="handleDialogCheckClose"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-manage-amend
        :deptOptions="deptOptions"
        @backHandle="backHandle"
      ></user-manage-amend>
    </el-dialog>
    <Drawer :isOpen="isOpen" @changeStauts="editTableHeader" />
  </div>
</template>

<script>
import userManageList from "./userManageList";
import userManageAmend from "./userManageAmend";
import Drawer from "@/components/TableHeaderEdit";
import { officeTreeData } from "@/api/styem/dept.js";
import Bus from "@/utils/vueBus";
export default {
  components: {
    userManageList,
    userManageAmend,
    Drawer,
  },
  data() {
    return {
      isOpen: false,
      dialogTxt: "",
      check: false,
      tabState: "add",
      defaultExpand: true,
      deptName: undefined,
      deptId: undefined,
      deptOptions: [],
      contentHeight: "800",
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    this.getofficeTreeData();
  },

  watch: {
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    async getofficeTreeData() {
      const reponse = await officeTreeData();
      const menu = this.handleTree(reponse.data, "id", "pId", "children", "0");
      this.deptOptions = menu;
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    unfoldClick() {
      this.defaultExpand = !this.defaultExpand;
    },
    handleSeeAmend(id) {
      if (id) {
        this.dialogTxt = "修改";
      } else {
        this.dialogTxt = "新增";
      }
      this.check = true;
      this.$nextTick(() => {
        Bus.$emit("outUserComeId", id);
      });
    },
    editTableHeader: function (opt) {
      this.isOpen = opt;
    },

    backHandle(name) {
      this.check = false;
      if (name == "update") {
        this.$refs.dataList.getUserListb();
      }
    },
    handleDialogCheckClose() {
      this.check = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  .filter-item {
    display: flex;
    width: 280px;
    align-content: center;
    .label {
      font-size: 14px;
      color: #606266;
      width: 80px;
      height: 34px;
      line-height: 34px;
    }
    /deep/ .el-input__inner {
      width: 180px;
    }
  }
}
.tree-container {
  margin-top: 10px;
  overflow-y: scroll;
}
.unfold-box {
  display: flex;
  justify-content: flex-end;
}
</style>

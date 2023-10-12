<template>
  <div class="information-inner" ref="informationInner">
    <div v-show="noListLimits">
      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <el-tabs
            v-model="activeName"
            type="card"
            ref="tabs"
            @tab-click="tabClick"
          > -->
      <!-- <el-tab-pane label="测试列表" name="list"> -->
      <testTree-list
        ref="dataList"
        @handleSeeAmend="handleSeeAmend"
      ></testTree-list>
      <!-- </el-tab-pane> -->
      <!-- <el-tab-pane
              ref="amendList"
              :label="tabState == 'add' ? '测试添加' : '测试修改'"
              name="add"
            > -->
      <el-dialog
        :title="tabState == 'add' ? '测试添加' : '测试修改'"
        :visible.sync="addShow"
        width="800px"
      >
        <testTree-amend @backHandle="backHandle"></testTree-amend>
      </el-dialog>
      <!-- </el-tab-pane> -->
      <!-- </el-tabs>
        </el-col>
      </el-row> -->
    </div>
    <div v-show="!noListLimits">
      <h1>没有权限</h1>
    </div>
  </div>
</template>

<script>
import testTreeList from "./testTreeList";
import testTreeAmend from "./testTreeAmend";
import Bus from "@/utils/vueBus";
export default {
  components: {
    testTreeList,
    testTreeAmend,
  },
  data() {
    return {
      activeName: "list",
      tabState: "add",
      noListLimits: true,
      disabledBoolean: false,
      addShow: false
    };
  },
  methods: {
    handleSeeAmend(stateObj) {
      const tabState = stateObj.tabState;
      this.tabState = tabState;
        this.addShow = true;
      },
    backHandle(name) {
      this.addShow = false;
      if (name == "update") {
        this.$refs.dataList.queryParams.pageNo = 1;
        this.$refs.dataList.getList();
      }
    },
  },
};
</script>
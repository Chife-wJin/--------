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
      <testDataDemo-list
        ref="dataList"
        @handleSeeAmend="handleSeeAmend"
      ></testDataDemo-list>
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
        <testDataDemo-amend @backHandle="backHandle"></testDataDemo-amend>
      </el-dialog>
      <!-- </el-tab-pane> -->
      <el-dialog title="测试查看" :visible.sync="seeShow" width="800px">
        <!-- <el-tab-pane label="测试查看" name="see"> -->
        <testDataDemo-see @backHandle="backHandle"></testDataDemo-see>
        <!-- </el-tab-pane> -->
      </el-dialog>
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
import testDataDemoList from "./testDataDemoList";
import testDataDemoAmend from "./testDataDemoAmend";
import testDataDemoSee from "./testDataDemoSee";
// import Bus from "@/utils/vueBus";
export default {
  components: {
    testDataDemoList,
    testDataDemoAmend,
    testDataDemoSee,
  },
  data() {
    return {
      // activeName: "list",
      tabState: "add",
      noListLimits: true,
      disabledBoolean: false,
      addShow: false,
      seeShow: false,
    };
  },
  created() {
  },
  methods: {
    handleSeeAmend(stateObj) {
      const tabState = stateObj.tabState;
      this.tabState = tabState;
      if (this.tabState == "add" || this.tabState == "amend") {
        this.addShow = true;
      } else if (this.tabState == "see") {
        this.seeShow = true;
      }
    },
    backHandle(name) {
      this.addShow = false;
      this.seeShow = false;
      if (name == "update") {
        this.$refs.dataList.queryParams.pageNo = 1;
        this.$refs.dataList.getList();
      }
    },
  },
};
</script>
<template>
  <div class="resource-dir">
    <div class="tree">
      <input placeholder="选择目标模型" v-model="input" class="search-input" />
      <div class="yiji" @click="topClick">{{ yiji.name }}</div>
      <ul class="treeList">
        <li
          :class="n == i ? 'active' : ''"
          v-for="(v, i) in chaxun"
          :key="v.id"
          @click="treeNode(v, i)"
        >
          {{ v.tableContent }}{{ v.tableName }}
        </li>
      </ul>
    </div>
    <div class="content">
      <List
        @changeCom="changeCom"
        @editBtn="editBtn"
        @weightsSetting="weightsSetting"
        ref="list"
        :treeId="treeId"
        :treeData="treeData"
      />
      <el-dialog
        title="编辑"
        v-if="isShowAlertEdit"
        :before-close="handleDialogClose"
        :visible="true"
        width="1000px"
        append-to-body
        top="40px"
      >
        <Edit
          :rowId="rowId"
          :assessTable="assessTable"
          :rowType="rowType"
          @goBack="goBack"
          @closeSelf="closeSelf"
          @saveSuccess="saveSuccess"
        />
      </el-dialog>
      <el-dialog
        title="权重设置"
        v-if="isShowAlertWeights"
        :before-close="handleDialogClose"
        :visible="true"
        width="500px"
        append-to-body
      >
        <Weights
          @goBack="goBack"
          :treeId="treeId"
          :weightsSettingData="weightsSettingData"
          :assessTable="assessTable"
          @saveSuccess="saveSuccess"
        />
      </el-dialog>
      <el-dialog
        title="新增"
        v-if="isShowAlertStep"
        :before-close="handleDialogClose"
        :visible="true"
        width="1000px"
        append-to-body
      >
        <div class="step1" v-show="showStep1">
          <Step1
            @goBack="goBack"
            @saveSuccess="saveSuccess"
            @closeAll="handleDialogClose"
          />
        </div>
        <div class="step2" v-show="showStep2">
          <Step2
            @goBack="goBack"
            :assessTable="assessTable"
            @saveSuccess="saveSuccess"
            @closeAll="handleDialogClose"
            @prve="prve"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import List from "./list.vue";
import Edit from "./new.vue";
import Weights from "./components/weights.vue";
import Step1 from "./components/step1.vue";
import Step2 from "./components/step2.vue";
import { getqualityRulesTree } from "@/api/dataCenter/dataGovernance";

export default {
  name: "QualityRules",
  data() {
    return {
      isShowAlert: false,
      isShowAlertEdit: false,
      isShowAlertWeights: false,
      isShowAlertStep1: false,
      isShowAlertStep2: false,
      isShowAlertStep: false,
      loading: true,
      title: "",
      tree: [],
      type: "new",
      id: "",
      rowId: "",
      rowType: "",
      treeId: 1,
      treeData: {},
      n: 0,
      yiji: {
        id: 0,
        name: "数据质量模型",
      },
      input: "",
      assessTable: {
        databaseName: "wqcyjt_datacenter",
        datasourceId: 1,
        tableContent: "任务信息",
        tableName: "job_user",
      },
      showStep1: false,
      showStep2: false,
      weightsSettingData: [],
    };
  },

  created() {
    this.getLeftTree();
  },
  components: {
    List,
    Edit,
    Weights,
    Step1,
    Step2,
  },
  computed: {
    chaxun() {
      if (!this.input) {
        //  console.log(this.tree)
        return this.tree;
      } else {
        return this.tree.filter((item) =>
          item.databaseName.includes(this.input)
        );
      }
    },
  },

  methods: {
    treeNode(v, i) {
      this.n = i;
      this.treeId = v.id;
      this.treeData = v;
      console.log(this.treeId);
      this.assessTable.databaseName = v.databaseName;
      this.assessTable.datasourceId = v.datasourceId;
      this.assessTable.tableContent = v.tableContent;
      this.assessTable.tableName = v.tableName;
      this.$nextTick(() => {
        this.$refs.list.getList();
      });
    },
    getLeftTree() {
      getqualityRulesTree().then((res) => {
        //  console.log(res);
        this.tree = res.data.length ? res.data : [];
        this.loading = false;
      });
    },

    topClick() {
      this.treeId = 0;
      this.$refs.list.getList();
    },
    handleDialogClose() {
      this.isShowAlert = false;
      this.isShowAlertWeights = false;
      this.isShowAlertStep = false;
      this.isShowAlertEdit = false;
    },
    saveSuccess() {
      this.isShowAlertStep = false;
      this.isShowAlertWeights = false;
      this.showStep1 = false;
      this.showStep2 = false;
      this.isShowAlertEdit = false;
      this.$refs.list.getList();
      this.getLeftTree();
    },

    changeCom(type, title, step, rowId) {
      this.isShowAlertStep = true;
      if (step == "step2") {
        this.showStep2 = true;
        this.showStep1 = false;
      } else {
        this.showStep1 = true;
        this.showStep2 = false;
      }
      this.type = type;
      this.title = title;
    },
    editBtn(row) {
      this.isShowAlertEdit = true;
      this.rowId = row.id;
      this.rowType = row.type;
      // console.log(row)
    },
    prve() {
      this.isShowAlertStep = true;
      (this.showStep1 = true), (this.showStep2 = false);
    },

    weightsSetting(dataList) {
      this.isShowAlertWeights = true;
      this.weightsSettingData = dataList;
    },

    goBack() {
      this.isShowAlertWeights = false;
      this.isShowAlertStep = false;
      this.showStep1 = false;
      this.isShowAlertEdit = false;
    },
    closeSelf() {
      this.isShowAlertEdit = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-dir {
  display: flex;
  min-height: 100%;
  .tree {
    width: 200px;
    font: size 14px;
    line-height: 30px;
    div {
      cursor: default;
    }
    ul {
      text-indent: 2em;
      li {
        cursor: default;
      }
      .active {
        color: #409eff;
      }
    }
  }
  .content {
    width: calc(100% - 210px);
    padding-left: 10px;
  }
  .search-input {
    border: solid 1px #ddd;
    height: 30px;
    margin: 5px 0;
  }
  
}
::v-deep .el-dialog__body{ padding: 0 20px 65px 20px;}
</style>
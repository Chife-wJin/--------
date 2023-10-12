<template>
  <div class="step1">
    <div class="theSteps">
      <el-steps :active="active" align-center>
        <el-step title="选择数据库"></el-step>
        <el-step title="选择规则类型"></el-step>
        <el-step title="创建规则"></el-step>
      </el-steps>
    </div>
    <div class="cascader"></div>
    <div class="cascader">
      <ul class="level1">
        <li
          v-for="(v, i) in firstLevel"
          :key="i"
          @click="nodeLevel1(v, i)"
          :class="n1 == i ? 'active' : ''"
        >
          <a>{{ v.datasourceName }}</a> <span>&gt;</span>
        </li>
      </ul>
      <ul class="level2" v-show="isShowlevel2">
        <li
          v-for="(v, i) in firstLeve2"
          :key="i"
          @click="nodeLevel2(v, i)"
          :class="n2 == i ? 'active' : ''"
        >
          <a>{{ v.SCHEMA_NAME }}</a> <span>&gt;</span>
        </li>
      </ul>
      <ul class="level3" v-show="isShowlevel3">
        <li
          v-for="(v, i) in firstLeve3"
          :key="i"
          @click="nodeLevel3(v, i)"
          :class="n3 == i ? 'active' : ''"
        >
          <a>{{ v.TABLE_NAME }}</a>
        </li>
      </ul>
    </div>
    <div class="pull-right">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
    <el-dialog
      title="新增"
      v-if="isShowAlertStep2"
      :before-close="handleDialogClose"
      :visible="true"
      width="1000px"
      append-to-body
    >
      <Step2
        @goBack="goBack"
        @saveSuccess="saveSuccess"
        :assessTable="assessTable"
        @closeSelf="closeSelf"
        @closeAll="closeAll"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  getDataSource,
  getDataBase,
  getTables,
} from "@/api/dataCenter/dataGovernance";
import Step2 from "./step2.vue";
import Bus from "@/utils/vueBus";
export default {
  name: "Step1",
  components: {
    Step2,
  },
  data() {
    return {
      active: 0,
      isShowAlertStep2: false,
      assessTable: {
        databaseName: "",
        datasourceId: "",
        tableContent: "",
        tableName: "",
      },
      firstLevel: [],
      firstLeve2: [],
      firstLeve3: [],
      level1Id: "",
      dataBase: "",
      n1: -1,
      n2: -1,
      n3: -1,
      isShowlevel2: false,
      isShowlevel3: false,
    };
  },

  mounted() {},
  created() {
    this.getLevel1();
  },
  methods: {
    async getLevel1() {
      const reponse = await getDataSource();
      console.log(reponse);
      this.firstLevel = reponse.data;
    },
    async nodeLevel1(v, i) {
      this.level1Id = v.id;
      console.log(v.id);
      this.assessTable.datasourceId = v.id;
      const reponse = await getDataBase({ id: this.level1Id });
      console.log(reponse);
      this.firstLeve2 = reponse.data;
      this.n1 = i;
      this.isShowlevel2 = true;
    },
    async nodeLevel2(v, i) {
      this.dataBase = v.SCHEMA_NAME;
      this.assessTable.databaseName = v.SCHEMA_NAME;
      const reponse = await getTables({
        id: this.level1Id,
        dataBase: this.dataBase,
      });
      console.log(reponse);
      this.firstLeve3 = reponse.data;
      this.n2 = i;
      this.isShowlevel3 = true;
    },
    nodeLevel3(v, i) {
      this.tableName = v.TABLE_NAME;
      this.assessTable.tableName = v.TABLE_NAME;
      this.n3 = i;
    },
    closeSelf() {
      this.isShowAlertStep2 = false;
    },
    goBack() {
      this.$emit("goBack");
    },
    saveSuccess() {
      this.isShowAlertStep2 = false;
      this.$emit("saveSuccess");
    },
    next() {
      // console.log(this.assessTable)
      if (
        !this.assessTable.datasourceId ||
        !this.assessTable.databaseName ||
        !this.assessTable.tableName
      ) {
        this.$message({
          message: "请选择模型",
          type: "warning",
        });
      } else {
        this.isShowAlertStep2 = true;
      }
    },
    closeAll() {
      this.isShowAlertStep2 = false;
      this.$emit("closeAll");
    },

    handleDialogClose() {
      this.isShowAlertStep2 = false;
      this.$emit("closeAll");
    },
  },
};
</script>

<style lang="scss" scoped>
.theSteps {
  margin: 30px auto 50px;
}
::v-deep .el-cascader-menu {
  border: solid 1px #eee;
}
::v-deep .el-cascader-menu__wrap {
  height: 380px;
}
.cascader {
  padding: 0 80px 0 80px;
  display: flex;
}
.cascader ul {
  height: 300px;
  overflow: auto;
  width: 200px;
  border: solid 1px #eee;
  padding: 10px 20px;
}
.cascader ul li {
  line-height: 28px;
  cursor: default;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.cascader ul li.active a,
.cascader ul li.active span {
  color: #409eff;
}
</style>
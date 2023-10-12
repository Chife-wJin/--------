<template>
  <div class="new">
    <el-form ref="zlpgform" :model="form" :rules="rules">
      <div class="selectedRuleDiv">
        <p>已选规则：</p>
        <div>{{ ruleNamesString }}</div>
      </div>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="任务名称：" prop="companyId" label-width="120px">
            <el-input
              v-model="form.taskName"
              size="small"
              style="width: 400px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" class="branch-name">
          <el-form-item label="cron表达式：" prop="" label-width="120px">
            <input v-model="cronVal" />
            <CzrVueCron :cron.sync="cronVal" :recent="[]" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item class="btn" size="small">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { monitorTaskSave } from "@/api/datax/datax-access-monitoring";
import CzrVueCron from "czr-vue-cron";
export default {
  data() {
    return {
      selectedRules: [],
      isRequesting: false,
      form: {
        taskName: "",
        modelName: "",
      },
      cronVal: "",
      rules: {},
      modelList: [],
      idString: "",
      ruleNamesString: "",
    };
  },
  components: {
    CzrVueCron,
  },
  props: {
    ids: Array,
    ruleNames: Array,
    // taskIdsString: String,
  },
  created() {
    this.idString = this.ids.toString();
    this.ruleNamesString = this.ruleNames.join("，");
  },

  methods: {
    goBack() {
      this.$emit("goBack");
    },
    submitForm: function () {
      let queryForm = {};
      queryForm.name = this.form.taskName;
      queryForm.monitorRules = this.idString;
      queryForm.cron = this.cronVal;
      // if (this.taskIdsString !== "") {
      //   queryForm.id = this.taskIdsString;
      // }
      console.log(queryForm);

      // return

      // this.$refs.userManageform.validate(async (valid) => {
      // if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      monitorTaskSave(queryForm)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
            this.$emit("goBack");
          } else {
            this.$notify({
              title: "系统提示",
              message: "保存失败",
              showClose: false,
            });
          }
        })
        .finally(() => {
          this.isRequesting = false;
        });
      loading.close();
      // } else {
      //   return false;
      // }
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.new {
  padding-top: 20px;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-date-editor {
  width: 100%;
}
::v-deep .el-cascader {
  width: 100%;
}
::v-deep label {
  font-weight: 400;
}
.btn {
  display: flex;
  justify-content: center;
  padding-top: 26px;
}
.selectedRuleDiv {
  display: flex;
  padding: 0 40px;
  line-height: 30px;
  margin-bottom: 20px;
  p {
    margin: 0;
  }
}
</style>
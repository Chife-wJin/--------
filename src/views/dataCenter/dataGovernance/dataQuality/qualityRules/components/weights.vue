<template>
  <div>
    <div class="app-container">
      <el-form :model="form">
        <div class="quanzhong">
          <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort="{ prop: 'ruleName', order: 'descending' }"
          >
            <el-table-column prop="ruleName" label="规则名称" sortable>
            </el-table-column>
            <el-table-column label="规则权重" prop="name" sortable>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ruleWeight"
                  size="small"
                  value=""
                  style="width: 100px"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-row>
          <el-form-item class="btn">
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setWeight } from "@/api/dataCenter/dataGovernance";

export default {
  name: "Weights",
  data() {
    return {
      isRequesting: false,
      tableData: [],
      form: {},
      queryJson: {},
    };
  },
  props: {
    treeId: Number,
    weightsSettingData: Array,
    assessTable: Object,
  },
  mounted() {},
  created() {
    this.tableData = this.weightsSettingData;
    console.log(this.tableData);
  },

  methods: {
    submitForm() {
      if (this.isRequesting) {
        return;
      }

      let arr = this.tableData.map((item, index) => {
        return Object.assign(
          {},
          {
            fieldContent: item.fieldContent,
            fieldName: item.fieldName,
            fieldType: item.fieldType,
            id: item.id,
            ruleWeight: item.ruleWeight,
          }
        );
      });
      this.queryJson.assessTableId = this.treeId;
      //  console.log(arr)
      this.queryJson.ruleWeight = arr;
      console.log(this.queryJson);

      // this.$refs.userManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      setWeight(this.queryJson)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
            this.$emit("saveSuccess");
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
    },
    goBack() {
      this.$emit("goBack");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep label {
  font-weight: 400;
}
.btn {
  display: flex;
  justify-content: center;
  padding-top: 26px;
}
.quanzhong {
  height: 400px;
  overflow: auto;
}
</style>
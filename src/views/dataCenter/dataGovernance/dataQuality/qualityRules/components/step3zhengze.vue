<template>
  <div>
    <div class="step3zhengze">
      <el-form
        ref="regularRulesform"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-row :gutter="24" v-show="isShow">
          <el-col :span="18" class="branch-name">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input
                v-model="form.ruleName"
                size="small"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="18" class="branch-name">
            <el-form-item label="规则字段" prop="fieldName">
              <!-- 选择字段开始 -->
              <div class="select-self">
                <el-input
                  v-model="form.fieldName"
                  style="width: 80%"
                  size="small"
                ></el-input>
                <a class="chooseField" @click="showOptions">选择字段</a>
                <el-card class="options" v-show="isShowOptions">
                  <div class="control">
                    <input v-model="input" placeholder="搜索字段" />
                    <a @click="closeOptions">关闭</a>
                  </div>
                  <ul>
                    <li
                      v-for="(item, i) in chaxun"
                      :key="i"
                      @click="choose(item, i)"
                      :class="n==item.COLUMN_NAME ? 'active' : ''"
                    >
                      {{ item.COLUMN_COMMENT }}{{ item.COLUMN_NAME }}
                    </li>
                  </ul>
                </el-card>
              </div>
              <!-- 选择字段结束 -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="18" class="branch-name">
            <el-form-item label="约束表达式" prop="specificationValue">
              <el-input
                v-model="form.specificationValue"
                type="textarea"
                :rows="3"
                style="width: 80%; margin-right: 10px"
              ></el-input>
              <el-button type="primary" @click="example" size="mini"
                >参考</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="18" class="branch-name">
            <el-form-item label="测试数据" prop="testString">
              <el-input
                v-model="testString"
                size="small"
                style="width: 80%; margin-right: 10px"
              ></el-input>
              <el-button type="primary" @click="checkzz" size="mini"
                >校验</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <div>
            <RuleContent :gzzdList="gzzdList" ref="ruleContent" :postData="postData"/>
        </div>
      </el-form>

      <el-dialog
        title=""
        v-if="isShowAlert"
        :before-close="handleDialogClose"
        :visible="visible"
        width="1000px"
        append-to-body
      >
        <ExampleView @close="close" />
      </el-dialog>
    </div>
    <div class="pull-right">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="prev" v-show="isShow">上一步</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  addRules,
  getColumns,
  rulesTest,
  getInfoById,
} from "@/api/dataCenter/dataGovernance";
import ExampleView from "../../rules/components/example.vue";
import RuleContent from "./ruleContent.vue";
export default {
  name: "New",
  data() {
    return {
      isRequesting: false,
      isShow: true,
      form: {
        ruleName: "",
        fieldName: "",
        fieldType: "",
        fieldContent: "",
        specificationValue: "",
      },
      isShowAlert: false,
      visible: true,
      testString: "",
      n:undefined,
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        fieldName: [
          { required: true, message: "请输入规则字段", trigger: "change" },
        ],
        specificationValue: [
          { required: true, message: "请输入表达式", trigger: "blur" },
        ],
      },
      input: "",
      isShowOptions: false,
      gzzdList: [],
      queryJson: {},
      currentRuleDataList: {},
    };
  },
  props: {
    postData: Object,
    rowId: Number,
    currentRuleData: Object,
  },
  components: {
    ExampleView,
    RuleContent,
  },
  created() {
    this.queryJson = this.postData;
    console.log(this.queryJson);
    this.getColumnsList();
    // console.log(this.currentRuleDataList)
    if (this.rowId) {
      this.isShow = false;
    }
  },
  watch: {
    // 监听到父组件传递过来的数据后，加工一下，
    // 存到data中去，然后在页面上使用
    currentRuleData(newnew, oldold) {
      //console.log("监听", newnew, oldold);
      this.currentRuleDataList = newnew;
      this.form.fieldContent = this.currentRuleDataList.fieldContent;
      this.form.fieldName = this.currentRuleDataList.fieldName;
      this.form.fieldType = this.currentRuleDataList.fieldType;
      this.form.specificationValue =
        this.currentRuleDataList.specificationValue;
      this.form.ruleName = this.currentRuleDataList.ruleName;
      this.$refs.ruleContent.form.guizeCon =
        this.currentRuleDataList.conditionName;
      this.$refs.ruleContent.form.guizeConValue =
        this.currentRuleDataList.conditionValue;
    },
  },
  computed: {
    chaxun() {
      if (!this.input) {
        return this.gzzdList;
      } else {
        return this.gzzdList.filter((item) =>
          item.COLUMN_COMMENT.includes(this.input)
        );
      }
    },
  },

  methods: {
    async getColumnsList() {
      const res = await getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.queryJson.assessTable.tableName,
      });
      this.gzzdList = res.data.result;
      let name = this.form.fieldName
     // console.log(name)
      this.gzzdList.map((item) => { 
        console.log(item)
        if (name.includes(item.COLUMN_NAME)) {
          this.n = item.COLUMN_NAME;
        } else {
          this.n != item.COLUMN_NAME;
        }
        return item;
      });
    },
    btnShow() {
      this.isBtnShow = false;
    },

    example() {
      this.isShowAlert = true;
    },
    checkzz() {
      rulesTest({
        constraintExpression: this.form.specificationValue,
        testString: this.testString,
      }).then((res) => {
        if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success",
              });
            }else{
              this.$message({
                message: res.msg,
                type: "warning",
              });
            }
      });
    },

    //选择字段
    choose(item, i) {
      console.log(item);
      this.form.fieldName = item.COLUMN_NAME;
      this.form.fieldContent = item.COLUMN_COMMENT;
      this.form.fieldType = item.DATA_TYPE;
      this.isShowOptions = false;
      this.n = item.COLUMN_NAME;
    },
    showOptions() {
      this.isShowOptions = true;
    },
    closeOptions() {
      this.isShowOptions = false;
    },

    save() {
      if (this.isRequesting) {
        return;
      }
      if (this.rowId) {
        this.queryJson.id = this.rowId;
      }
      var fieldList = [];
      this.queryJson.ruleName = this.form.ruleName;
      this.queryJson.specificationValue = this.form.specificationValue;
      fieldList.push({
        fieldName: this.form.fieldName,
        fieldType: this.form.fieldType,
        fieldContent: this.form.fieldContent,
      });
      this.queryJson.fieldList = fieldList;
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue;
      this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon;
      //  console.log(this.queryJson);

      this.$refs.regularRulesform.validate(async (valid) => {
        if (valid) {
          this.isRequesting = true;
          const loading = this.$loading({
            lock: true,
            text: "正在保存提交，请稍等...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.1)",
          });
          addRules(this.queryJson)
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
        } else {
          return false;
        }
      });
    },
    close() {
      this.isShowAlert = false;
    },
    prev() {
      this.$emit("closeSelf");
    },
    goBack() {
      this.$emit("goBack");
      this.$emit("cancel");
    },
    handleDialogClose() {
      this.isShowAlert = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.step3zhengze {
  width: 750px;
  margin: 0 auto 50px;
}
/*选择字段*/
.options {
  position: absolute;
  left: 0;
  top: 40px;
}
.options ul {
  height: 150px;
  overflow: auto;
  width: 360px;
  padding: 0 10px 0 20px;
}
.options ul li {
  cursor: pointer;
  line-height: 30px;
}
.control {
  padding: 10px 10px 0;
  display: flex;
  justify-content: space-between;
}
.control input {
  border: solid 1px #ddd;
  width: 250px;
  height: 30px;
  border-radius: 5px;
  padding: 0 0 0 10px;
  margin-right: 10px;
}
.control a {
  line-height: 20px;
}
.select-self {
  position: relative;
  z-index: 10;
  width: 100%;
}
.chooseField {
  display: inline-block;
  margin-left: 10px;
  color: #409eff;
}
::v-deep .el-card__body {
  padding: 0;
}
.active {
  color: #409eff;
}
/*选择字段结束*/
</style>
<template>
  <div>
    <div class="step3guifan">
      <el-form
        ref="gfRulesform"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-row :gutter="10" v-show="isShow">
          <el-col :span="16" class="branch-name">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="form.ruleName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16" class="branch-name">
            <el-form-item label="待选字段" prop="fieldName">
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
        <el-row :gutter="10">
          <el-col :span="16" class="branch-name">
            <el-form-item label="规范类型" prop="specificationType">
              <el-select
                v-model="form.specificationType"
                placeholder="请选择规范类型"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, i) in canonicalTypeData"
                  :key="i"
                  :label="item.title"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16" class="branch-name">
            <el-form-item label="规范值">
              <el-radio-group v-model="form.specificationValueType">
                <el-radio label="1">常量</el-radio>
                <el-radio label="2">模型字段</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label=""
              prop="minDate"
              v-show="form.specificationValueType == '1'"
            >
              <el-input
                v-model="form.specificationValueCl"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="" v-show="form.specificationValueType == '2'">
              <el-select
                v-model="form.specificationValueZd"
                filterable
                placeholder="请选择模型字段"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, i) in gzzdList"
                  :key="i"
                  :label="item.COLUMN_COMMENT"
                  :value="item.COLUMN_NAME"

                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
            <RuleContent :gzzdList="gzzdList" ref="ruleContent" :postData="postData" />
        </div>
      </el-form>
    </div>
    <div class="pull-right">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="prev" v-if="isShow">上一步</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  addRules,
  getTables,
  getColumns,
  dictListType,
} from "@/api/dataCenter/dataGovernance";
import RuleContent from "./ruleContent.vue";
export default {
  name: "Step3yizhi",
  components: {
    RuleContent,
  },
  data() {
    return {
      active: 2,
      isShow: true,
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        fieldName: [
          { required: true, message: "请输入规则字段", trigger: "change" },
        ],
        specificationType: [
          { required: true, message: "请输入规范类型", trigger: "change" },
        ],
        specificationValue: [
          { required: true, message: "请选择规范值", trigger: "change" },
        ],
      },
      n:undefined,
      form: {
        ruleName: "",
        fieldName: "",
        fieldContent: "",
        fieldType: "",
        specificationType: "",
        specificationValue: "",
        specificationValueType: "1",
        specificationValueCl: "",
        specificationValueZd: "",
      },
      gzzdList: [],
      queryJson: {},
      canonicalTypeData: undefined,
      input: "",
      isShowOptions: false,
      currentRuleDataList: {},
    };
  },
  props: {
    postData: Object,
    rowId: Number,
    currentRuleData: Object,
  },
 created() {
    this.queryJson = this.postData;
   this.getColumnsList();
    this.datacenterDictList();
    if (this.rowId) {
      this.isShow = false;
    }
    
  },
  watch: {
    // 监听到父组件传递过来的数据后，加工一下，
    // 存到data中去，然后在页面上使用
    currentRuleData(newnew, oldold) {
      //  console.log("监听", newnew, oldold);
      this.currentRuleDataList = newnew;
      this.form.ruleName = this.currentRuleDataList.ruleName;
      this.form.fieldContent = this.currentRuleDataList.fieldContent;
      this.form.fieldName = this.currentRuleDataList.fieldName;
      this.form.fieldType = this.currentRuleDataList.fieldType;
      this.form.specificationType = this.currentRuleDataList.specificationType.toString();
      this.form.specificationValue = this.currentRuleDataList.specificationValue;
      this.form.specificationValueType = this.currentRuleDataList.specificationValueType.toString();
      if (this.form.specificationValueType == "1") {
        this.form.specificationValueCl = this.currentRuleDataList.specificationValue;
      } else {
        this.form.specificationValueZd = this.currentRuleDataList.specificationValue;
      }
      this.$refs.ruleContent.form.guizeCon = this.currentRuleDataList.conditionName;
      this.$refs.ruleContent.form.guizeConValue = this.currentRuleDataList.conditionValue;
    },
    
  },
  treeId(newV, oldV) {
   // console.log(newV);
    this.form.specificationValueType = newV;
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
      this.gzzdList.forEach((val) => {
        this.$set(val, "state", false);
      });
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
    async datacenterDictList() {
      const canonicalTypeReponse = await dictListType({ type: "range" });
      this.canonicalTypeData = canonicalTypeReponse.data;
      //console.log(this.canonicalTypeData);
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

    goBack() {
      this.$emit("goBack");
      this.$emit("cancel");
    },
    prev() {
      this.$emit("closeSelf");
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
      fieldList.push({
        fieldName: this.form.fieldName,
        fieldType: this.form.fieldType,
        fieldContent: this.form.fieldContent,
      });
      this.queryJson.fieldList = fieldList;
      this.queryJson.specificationType = this.form.specificationType;
      this.queryJson.specificationValueType = this.form.specificationValueType;
      // console.log(this.form.specificationValueType)
      if (this.form.specificationValueType == 1) {
        this.queryJson.specificationValue = this.form.specificationValueCl;
      } else {
        this.queryJson.specificationValue = this.form.specificationValueZd;
      }
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue;
      this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon;
      //console.log(this.queryJson);

      this.$refs.gfRulesform.validate(async (valid) => {
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
  },
};
</script>

<style lang="scss" scoped>
.step3guifan {
  width: 750px;
  margin: 0 auto 100px;
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

::v-deep .el-dialog__body{max-height: auto;}
</style>
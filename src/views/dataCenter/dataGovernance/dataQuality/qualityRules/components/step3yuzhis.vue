<template>
  <div>
    <div class="step3guifan">
      <el-form
        ref="yuzhiRulesform"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-row :gutter="10" v-if="isShow">
          <el-col :span="18" class="branch-name">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="form.ruleName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="18" class="branch-name">
            <el-form-item label="待选属性" prop="fieldName">
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
        <div v-show="fieldType == 1">
          <el-row :gutter="10">
            <el-col :span="18" class="branch-name">
              <el-form-item label="最小值">
                <el-radio-group v-model="form.minValueType">
                  <el-radio label="1">常量</el-radio>
                  <el-radio label="2">数值字段</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 数值最小值常量 -->
              <el-form-item
                label=""
                prop="minDate"
                v-if="form.minValueType == '1'"
              >
                <el-input v-model="form.minInt" size="small"></el-input>
              </el-form-item>
              <!-- 数值最小值下拉框 -->
              <el-form-item label="" v-if="form.minValueType == '2'">
                <el-select
                  v-model="form.numberFieldName"
                  filterable
                  placeholder="请选择数值字段"
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, i) in gzzdListNumber"
                    :key="i"
                    :label="item.COLUMN_COMMENT"
                    :value="item.COLUMN_NAME"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="18" class="branch-name">
              <el-form-item label="最大值">
                <el-radio-group v-model="form.maxValueType">
                  <el-radio label="1">常量</el-radio>
                  <el-radio label="2">数值字段</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 数值最大值常量 -->
              <el-form-item
                label=""
                prop="maxDate"
                v-if="form.maxValueType == '1'"
              >
                <el-input v-model="form.maxInt" size="small"></el-input>
              </el-form-item>
              <!-- 数值最大值下拉框 -->
              <el-form-item label="" v-if="form.maxValueType == '2'">
                <el-select
                  v-model="form.comparaFieldName"
                  filterable
                  placeholder="请选择数值字段"
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, i) in gzzdListNumber"
                    :key="i"
                    :label="item.COLUMN_COMMENT"
                    :value="item.COLUMN_NAME"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="fieldType == 2">
          <el-row :gutter="10">
            <el-col :span="18" class="branch-name">
              <el-form-item label="日期最小值">
                <el-radio-group v-model="form.minValueType">
                  <el-radio label="1">常量</el-radio>
                  <el-radio label="2">日期字段</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 日期最小值常量 -->
              <el-form-item
                label=""
                prop="minDate"
                v-if="form.minValueType == '1'"
              >
                <el-date-picker
                  v-model="form.minDate"
                  type="date"
                  placeholder="选择日期"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  style="width: 300px"
                >
                </el-date-picker>
              </el-form-item>
              <!-- 日期最小值下拉框 -->
              <el-form-item label="" v-if="form.minValueType == '2'">
                <el-select
                  v-model="form.numberFieldName"
                  filterable
                  placeholder="请选择数值字段"
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, i) in gzzdListDate"
                    :key="i"
                    :label="item.COLUMN_COMMENT"
                    :value="item.COLUMN_NAME"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="18" class="branch-name">
              <el-form-item label="日期最大值">
                <el-radio-group v-model="form.maxValueType">
                  <el-radio label="1">常量</el-radio>
                  <el-radio label="2">日期字段</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 日期最大值常量 -->
              <el-form-item
                label=""
                prop="maxDate"
                v-if="form.maxValueType == '1'"
              >
                <el-date-picker
                  v-model="form.maxDate"
                  type="date"
                  placeholder="选择日期"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  style="width: 300px"
                ></el-date-picker>
              </el-form-item>
              <!-- 日期最大值下拉框 -->
              <el-form-item label="" v-if="form.maxValueType == '2'">
                <el-select
                  v-model="form.comparaFieldName"
                  filterable
                  placeholder="请选择数值字段"
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, i) in gzzdListDate"
                    :key="i"
                    :label="item.COLUMN_COMMENT"
                    :value="item.COLUMN_NAME"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
            <RuleContent :gzzdList="gzzdList" ref="ruleContent" :postData="postData"/>
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
  getColumns,
  rulesTest,
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
      loading: true,
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        minValueType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        maxValueType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      n:undefined,
      gzzdList: [],
      gzzdListNumber: [],
      gzzdListDate: [],
      queryJson: {},
      form: {
        ruleName: "",
        fieldName: "",
        fieldContent: "",
        fieldType: "",
        minInt: "",
        maxInt: "",
        minDate: "",
        maxDate: "",
        numberFieldName: "",
        comparaFieldName: "",
        minValueType: "1",
        maxValueType: "1",
      },
      compareObjectOptions: undefined,
      fieldType: 1,
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
    console.log(this.queryJson);
    this.getColumnsList();
    this.getColumnsListNumber();
    this.getColumnsListDate();
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
      this.form.minInt = this.currentRuleDataList.minInt;
      this.form.maxInt = this.currentRuleDataList.maxInt;
      this.form.minDate = this.currentRuleDataList.minDate;
      this.form.comparaFieldName = this.currentRuleDataList.comparaFieldName;
      this.form.minValueType = this.currentRuleDataList.minValueType.toString();
      this.form.maxValueType = this.currentRuleDataList.maxValueType.toString();
      this.form.numberFieldName =
        this.currentRuleDataList.assessFieldList[0].fieldName;
      this.form.comparaFieldName =
        this.currentRuleDataList.assessFieldList[0].comparaFieldName;
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
      this.loading = true;
      const res = await getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.queryJson.assessTable.tableName,
        fieldType: 3,
      });
      this.gzzdList = res.data.result;
      // console.log(res.data);
      this.loading = false;
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
    async getColumnsListNumber() {
      this.loading = true;
      const res = await getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.queryJson.assessTable.tableName,
        fieldType: 1,
      });
      this.gzzdListNumber = res.data.result;
      //console.log(res.data);
      this.loading = false;
    },
    async getColumnsListDate() {
      this.loading = true;
      const res = await getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.queryJson.assessTable.tableName,
        fieldType: 2,
      });
      this.gzzdListDate = res.data.result;
      // console.log(res.data);
      this.loading = false;
    },
    fieldTypeSelect(v) {
      // console.log(v.fieldType);
      // this.fieldType = v.fieldType;
      console.log(v);
      this.fieldType = v;
    },
    //选择字段
    choose(item, i) {
      console.log(item);
      this.form.fieldName = item.COLUMN_NAME;
      this.form.fieldContent = item.COLUMN_COMMENT;
      this.form.fieldType = item.DATA_TYPE;
      this.isShowOptions = false;
      this.fieldType = item.fieldType;
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
      var assessFieldList = [];
      var fieldList = [];
      this.queryJson.ruleName = this.form.ruleName;

      fieldList.push({
        fieldName: this.form.fieldName,
        fieldType: this.form.fieldType,
        fieldContent: this.form.fieldContent,
      });
      this.queryJson.fieldList = fieldList;
      this.queryJson.minValueType = this.form.minValueType;
      this.queryJson.maxValueType = this.form.maxValueType;
      if (this.form.minValueType == 1 && this.form.maxValueType == 1) {
        this.queryJson.minInt = this.form.minInt;
        this.queryJson.minDate = this.form.minDate;
        this.queryJson.maxInt = this.form.maxInt;
        this.queryJson.maxDate = this.form.maxDate;
        assessFieldList = [];
      } else if (this.form.minValueType == 2 && this.form.maxValueType == 2) {
        this.queryJson.minInt = "";
        this.queryJson.minDate = "";
        this.queryJson.maxInt = "";
        this.queryJson.maxDate = "";
        assessFieldList.push({
          fieldName: this.form.numberFieldName,
          comparaFieldName: this.form.comparaFieldName,
        });
      } else if (this.form.minValueType == 1 && this.form.maxValueType == 2) {
        this.queryJson.minInt = this.form.minInt;
        this.queryJson.minDate = this.form.minDate;
        this.queryJson.maxInt = "";
        this.queryJson.maxDate = "";
        assessFieldList.push({
          fieldName: "",
          comparaFieldName: this.form.comparaFieldName,
        });
      } else {
        this.queryJson.minInt = "";
        this.queryJson.minDate = "";
        this.queryJson.maxInt = this.form.minInt;
        this.queryJson.maxDate = this.form.minDate;
        assessFieldList.push({
          fieldName: this.form.numberFieldName,
          comparaFieldName: "",
        });
      }
      this.queryJson.assessFieldList = assessFieldList;
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue;
      this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon;
      console.log(this.queryJson);

      this.$refs.yuzhiRulesform.validate(async (valid) => {
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
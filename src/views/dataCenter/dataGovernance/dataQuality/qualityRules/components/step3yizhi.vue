<template>
  <div>
    <div class="Step3yizhi">
      <el-form
        ref="yzRulesform"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-row :gutter="24" v-show="isShow">
          <el-col :span="22" class="branch-name">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input
                v-model="form.ruleName"
                size="small"
                style="width: 70%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="22" class="branch-name">
            <el-form-item label="规则字段" prop="fieldName">
              <!-- 选择字段开始 -->
              <div class="select-self" style="z-index: 20">
                <el-input
                  v-model="form.fieldName"
                  style="width: 60%"
                  size="small"
                >
                </el-input>
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
          <el-col :span="22" class="branch-name">
            <el-form-item label="对比对象" prop="comparaTable">
              <el-select
                v-model="form.comparaTable"
                size="small"
                style="width: 70%"
                placeholder="请选择对比对象"
                @change="checkCompareObject"
              >
                <el-option
                  v-for="(item, i) in dbdxList"
                  :key="i"
                  :label="item.TABLE_COMMENT"
                  :value="item.TABLE_NAME"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="22" class="branch-name">
            <el-form-item label="对比字段" prop="comparaFieldComment">
              <!-- 选择字段开始 -->
              <div class="select-self">
                <el-input
                  v-model="form.comparaFieldName"
                  style="width: 60%"
                  size="small"
                ></el-input>
                <a class="chooseField" @click="showOptions1">选择字段</a>
                <el-card class="options" v-show="isShowOptions1">
                  <div class="control">
                    <input v-model="input1" placeholder="搜索字段" />
                    <a @click="closeOptions1">关闭</a>
                  </div>
                  <ul>
                    <li
                      v-for="(item, i) in comparaChaxun"
                      :key="i"
                      @click="choose1(item, i)"
                      :class="n1==item.COLUMN_NAME ? 'active' : ''"
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
        <div>
            <RuleContent :gzzdList="gzzdList" ref="ruleContent" :postData="postData"/>
        </div>
      </el-form>
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
  getTables,
  getColumns,
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
          { required: true, message: "请选择规则字段", trigger: "change" },
        ],
        comparaTable: [
          { required: true, message: "请选择对比对象", trigger: "change" },
        ],
        comparaFieldName: [
          { required: true, message: "请选择对比字段", trigger: "change" },
        ],
      },
      queryJson: {},
      gzzdList: [],
      dbdxList: [],
      dbzdList: [],
      input: "",
      isShowOptions: false,
      input1: "",
      isShowOptions1: false,
      n:undefined,
      n1:undefined,
      form: {
        ruleName: "",
        fieldName: "",
        fieldContent: "",
        fieldType: "",
        comparaFieldName: "",
        comparaFieldComment: "",
        comparaFieldType: "",
        comparaTable: "",
      },
      disabled: true,
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
    this.getdbdxList();
    if (this.rowId) {
      this.isShow = false;
    }
  },
  watch: {
    // 监听到父组件传递过来的数据后，加工一下，
    // 存到data中去，然后在页面上使用
    currentRuleData(newnew, oldold) {
      console.log("监听", newnew, oldold);
      this.currentRuleDataList = newnew;
      this.form.ruleName = this.currentRuleDataList.ruleName;
      this.form.fieldName =
        this.currentRuleDataList.assessFieldList[0].fieldName;
      this.form.fieldContent =
        this.currentRuleDataList.assessFieldList[0].fieldContent;
      this.form.fieldType =
        this.currentRuleDataList.assessFieldList[0].fieldType;
      this.form.comparaFieldName =
        this.currentRuleDataList.assessFieldList[0].comparaFieldName;
      this.form.comparaFieldComment =
        this.currentRuleDataList.assessFieldList[0].comparaFieldComment;
      this.form.comparaFieldType =
        this.currentRuleDataList.assessFieldList[0].comparaFieldType;
      this.form.comparaTable = this.currentRuleDataList.comparaTable;
      this.$refs.ruleContent.form.guizeCon =
        this.currentRuleDataList.conditionName;
      this.$refs.ruleContent.form.guizeConValue =
        this.currentRuleDataList.conditionValue;
        this.checkCompareObject()
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
    comparaChaxun() {
      if (!this.input1) {
        return this.dbzdList;
      } else {
        return this.dbzdList.filter((item) =>
          item.COLUMN_COMMENT.includes(this.input1)
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
    async getdbdxList() {
      const reponse = await getTables({
        id: this.queryJson.assessTable.datasourceId,
        dataBase: this.queryJson.assessTable.databaseName,
      });
      console.log(reponse);
      this.dbdxList = reponse.data;
    },

    checkCompareObject() {
      if (!this.form.comparaTable) {
        this.disabled = true;
      } else {
        this.disabled = false;
        //拿到对比字段的下拉数据
        getColumns({
          dataBase: this.queryJson.assessTable.databaseName,
          id: this.queryJson.assessTable.datasourceId,
          tables: this.form.comparaTable,
        }).then((res) => {
          console.log(res);
          this.dbzdList = res.data.result;
          let nameDbdx = this.form.comparaFieldName
          this.dbzdList.map((item) => { 
        if (nameDbdx.includes(item.COLUMN_NAME)) {
          this.n1 = item.COLUMN_NAME;
        } else {
          this.n1 != item.COLUMN_NAME;
        }
        return item;
      });
      console.log(this.dbzdList)
        });
      }
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
    //选择对比字段
    choose1(item, i) {
      console.log(item);
      this.form.comparaFieldName = item.COLUMN_NAME;
      this.form.comparaFieldComment = item.COLUMN_COMMENT;
      this.form.comparaFieldType = item.DATA_TYPE;
      this.isShowOptions1 = false;
      this.n1 = item.COLUMN_NAME;
    },
    showOptions1() {
      this.isShowOptions1 = true;
    },
    closeOptions1() {
      this.isShowOptions1 = false;
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
      this.queryJson.comparaTable = this.form.comparaTable;
      assessFieldList.push({
        fieldName: this.form.fieldName,
        fieldType: this.form.fieldType,
        fieldContent: this.form.fieldContent,
        comparaFieldName: this.form.comparaFieldName,
        comparaFieldComment: this.form.comparaFieldComment,
        comparaFieldType: this.form.comparaFieldType,
      });
      this.queryJson.assessFieldList = assessFieldList;
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue;
      this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon;
      // console.log(this.queryJson);

      this.$refs.yzRulesform.validate(async (valid) => {
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
.Step3yizhi {
  width: 750px;
  margin: 0 auto 70px;
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
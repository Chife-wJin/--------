<template>
  <div>
    <div class="step3duoziduan">
      <el-form
        ref="duoziduanRulesform"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-row :gutter="24" v-show="isShow">
          <el-col :span="16" class="branch-name">
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
          <el-col :span="16" class="branch-name">
            <el-form-item label="规则字段" prop="fieldName">
              <template>
                <!-- 选择字段开始 -->
                <div class="select-self">
                  <div class="xzzdDiv">
                    <div class="moni-input">
                      <ul>
                        <li
                          v-for="(v, i) in listRight"
                          :key="v.id"
                          class="right-li"
                        >
                          <span>{{ v.COLUMN_COMMENT }}{{ v.COLUMN_NAME }}</span>
                          <span style="font-size: 26px" @click="del(v, i)"
                            >×</span
                          >
                        </li>
                      </ul>
                    </div>
                    <a class="chooseField" @click="showOptions">选择字段</a>
                  </div>

                  <el-card class="options" v-show="isShowOptions">
                    <div class="control">
                      <input v-model="input1" placeholder="搜索字段" />
                      <a @click="quanxuan">{{ isSelectAllWord }}</a>
                      <a @click="closeOptions">关闭</a>
                    </div>
                    <ul>
                      <li
                        v-for="(v, i) in xialaChaxun"
                        :key="v.id"
                        @click="add(v, i)"
                        :class="v.state ? 'active' : ''"
                      >
                        {{ v.COLUMN_COMMENT }}{{ v.COLUMN_NAME }}
                      </li>
                    </ul>
                  </el-card>
                </div>
                <!-- 选择字段结束 -->
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <RuleContent
            :gzzdList="gzzdList"
            ref="ruleContent"
            :postData="postData"
          />
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
  getColumns,
  dictListType,
} from "@/api/dataCenter/dataGovernance";
import RuleContent from "./ruleContent.vue";
export default {
  name: "Duoziduan",
  components: {
    RuleContent,
  },
  data() {
    return {
      isRequesting: false,
      isShow: true,
      form: {
        ruleName: "",
      },
      listRight: [],
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
      },
      gzzdList: [],
      queryJson: {},
      isShowOptions: false,
      input1: "",
      isSelectAllWord: "全选",
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
      console.log("监听", newnew, oldold);
      this.currentRuleDataList = newnew;
      let comment = this.currentRuleDataList.fieldContent.split(",");
      let name = this.currentRuleDataList.fieldName.split(",");
      let dataType = this.currentRuleDataList.fieldType.split(",");
      let rightArr = [];
      for (var i = 0; i < name.length; i++) {
        let obj = {
          COLUMN_COMMENT: "",
          COLUMN_NAME: "",
          DATA_TYPE: "",
          state: true,
        };
        obj.index = i;
        rightArr.push({
          COLUMN_COMMENT: comment[i],
          COLUMN_NAME: name[i],
          DATA_TYPE: dataType[i],
          state: true,
        });
      }
      this.listRight = rightArr;
     // console.log(this.listRight);
      
      this.gzzdList.map((item) => {
        if (name.includes(item.COLUMN_NAME)) {
          item.state = true;
          console.log(item);
        } else {
          item.state = false;
        }
        return item;
      });

      this.$refs.ruleContent.form.guizeCon = this.currentRuleDataList.conditionName;
      this.$refs.ruleContent.form.guizeConValue = this.currentRuleDataList.conditionValue;
    },
  },
  computed: {
    xialaChaxun() {
      if (!this.input1) {
        return this.gzzdList;
      } else {
        return this.gzzdList.filter((item) =>
          item.COLUMN_COMMENT.includes(this.input1)
        );
      }
    },
  },
  methods: {
    async datacenterDictList() {
      const bjfTypeReponse = await dictListType({ type: "range_all" });
      this.bjfTypeData = bjfTypeReponse.data;
      const ysfTypeReponse = await dictListType({ type: "operation" });
      this.ysfTypeData = ysfTypeReponse.data;
      const xtblTypeReponse = await dictListType({ type: "current" });
      this.xtblTypeData = xtblTypeReponse.data;
      //console.log(this.xtblTypeData)
    },
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
      //console.log(this.gzzdList);
    },
    //选择字段
    add(v, i) {
      var nameArray = this.listRight.map((item) => item.COLUMN_COMMENT);
      //console.log(nameArray);
      if (!nameArray.includes(v.COLUMN_COMMENT)) {
        this.listRight.push(v);
      }
      v.state = true;
      // console.log(this.listRight)
    },
    quanxuan() {
      if (this.isSelectAllWord == "全选") {
        let arr = [];
        let arrNew = [];
        arr.push(...this.gzzdList);
        arrNew = arr.filter((item) => {
          return !this.listRight.includes(item);
        });
        this.listRight.push(...arrNew);
        this.isSelectAllWord = "全不选";
        this.gzzdList.map((item) => {
          return (item.state = true);
        });
        console.log(this.listRight);
      } else {
        this.listRight = [];
        this.isSelectAllWord = "全选";
        this.gzzdList.map((item) => {
          return (item.state = false);
        });
      }
    },
    del(v, i) {
      this.listRight.forEach((item) => {
        // console.log(item);
        if (item.id == v.id) {
          item.state = false;
        }
      });
      this.listRight.splice(i, 1);
      if (this.listRight !== this.gzzdList) {
        this.isSelectAllWord = "全选";
      }
    },
    showOptions() {
      this.isShowOptions = true;
    },
    closeOptions() {
      this.isShowOptions = false;
    },
    //选择字段结束

    check() {},

    getData: function () {
      getInfoById({
        id: this.id,
      }).then((res) => {
        console.log(res);
        this.form = res.data;
      });
    },
    save() {
      if (this.isRequesting) {
        return;
      }
      if (this.rowId) {
        this.queryJson.id = this.rowId;
      }
      console.log(this.listRight);

      var fieldList = [];
      // for (var i = 0; i < this.listRight.length; i++) {
      //   let obj = { fieldName: "", fieldType:"", fieldContent: "" };
      //   obj.index = i;
      //   fieldList.push({
      //     fieldName: this.listRight[i].COLUMN_NAME,
      //     fieldContent: this.listRight[i].COLUMN_COMMENT,
      //     fieldType: this.listRight[i].DATA_TYPE
      //   });
      // }
      let name = this.listRight.map((item) => item.COLUMN_NAME).toString();
      let comment = this.listRight
        .map((item) => item.COLUMN_COMMENT)
        .toString();
      let dataType = this.listRight.map((item) => item.DATA_TYPE).toString();
      fieldList.push({
        fieldName: name,
        fieldContent: comment,
        fieldType: dataType,
      });
      this.queryJson.fieldList = fieldList;
      this.queryJson.ruleName = this.form.ruleName;
      //this.queryJson.conditionValue = this.form.guizeConValue;
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue;
      // this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon
      console.log(this.queryJson);


      this.$refs.duoziduanRulesform.validate(async (valid) => {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.step3duoziduan {
  width: 750px;
  margin: 0 auto 50px;
}
::v-deep .el-select__input {
  height: 28px;
  overflow: auto;
}

/*选择字段*/
.options {
  position: absolute;
  left: 0;
  top: 80px;
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
.moni-input {
  width: 80%;
  height: 80px;
  overflow: auto;
  border: solid 1px #ddd;
  border-radius: 5px;
  padding: 10px;
}
.xzzdDiv {
  display: flex;
}

.right-li {
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
  padding: 0 5px;
  line-height: 20px;
  float: left;
  background: #eee;
  font-size: 12px;
  border-radius: 5px;
  margin-bottom: 10px;
  line-height: 20px;
}
.right-li span {
  font-size: 10px;
}
.active {
  color: #409eff;
}

/*选择字段结束*/
</style>
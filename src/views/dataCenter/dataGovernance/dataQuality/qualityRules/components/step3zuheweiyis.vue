<template>
  <div class="container">
    <div class="listTit">
      <div>待选列表</div>
      <div>已选列表</div>
    </div>
    <div id="transfer">
      <div class="panel panel-default">
        <div class="panel-heading clear-fix">
          <input
            type="checkbox"
            v-model="leftCheckAll"
            @change="leftCheckAllChange"
          />
          <span>业务名称---字段名称</span>
          <span class="pull-right"
            >{{ num(leftData) }}/{{ leftData.length }}</span
          >
        </div>
        <input
          type="text"
          class="search"
          v-model="inputLeft"
          placeholder="输入查询内容"
        />
        <div class="panel-body">
          <ul>
            <li v-for="(v, i) in leftFilterData" :key="i">
              <div class="checkbox">
                <label>
                  <input
                    type="checkbox"
                    v-model="v.check"
                    @change="leftCurChange"
                  />{{ v.COLUMN_COMMENT }}---{{ v.COLUMN_NAME }}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn">
        <input type="button" value=">>" @click="toRight" class="to" />
        <input type="button" value="<<" @click="toLeft" class="to" />
      </div>
      <div class="panel panel-default">
        <div class="panel-heading clear-fix">
          <input
            type="checkbox"
            v-model="rightCheckAll"
            @change="rightCheckAllChange"
          />
          <span>业务名称---字段名称</span>
          <span class="pull-right"
            >{{ num(rightData) }}/{{ rightData.length }}</span
          >
        </div>
        <input
          type="text"
          class="search"
          v-model="inputRight"
          placeholder="输入查询内容"
        />
        <div class="panel-body">
          <ul>
            <li v-for="(v, i) in rightFilterData" :key="i">
              <div class="checkbox">
                <label>
                  <input
                    type="checkbox"
                    v-model="v.check"
                    @change="rightCurChange"
                  />{{ v.COLUMN_COMMENT }}---{{ v.COLUMN_NAME }}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="rule-content-div">
      <el-form :model="form" label-width="100px">
            <RuleContent :gzzdList="gzzdList" ref="ruleContent" :postData="postData"/>
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
import { addRules, getColumns } from "@/api/dataCenter/dataGovernance";
import RuleContent from "./ruleContent.vue";
export default {
  name: "Zuheweiyi",
  components: {
    RuleContent,
  },
  data() {
    return {
      active: 2,
      isShow: true,
      loading: false,
      queryJson: {},
      leftData: [],
      rightData: [],
      leftCheckAll: false,
      rightCheckAll: false,
      inputLeft: "",
      inputRight: "",
      currentRuleDataList: {},
      form:{},
      gzzdList:[]
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
    if (this.rowId) {
      this.isShow = false;
    }
  },
  computed: {
    num(data) {
      return (data) => data.filter((item) => item.check).length;
    },
    leftFilterData() {
      if (!this.inputLeft) {
        return this.leftData;
      } else {
        return this.leftData.filter((item) =>
          item.COLUMN_COMMENT.includes(this.inputLeft) || item.COLUMN_NAME.includes(this.inputLeft)
        );
      }
    },
    rightFilterData() {
      if (!this.inputRight) {
        return this.rightData;
      } else {
        return this.rightData.filter((item) =>
          item.COLUMN_COMMENT.includes(this.inputRight) || item.COLUMN_NAME.includes(this.inputRight)
        );
      }
    },
  },
  watch: {
    // 监听到父组件传递过来的数据后，加工一下，
    // 存到data中去，然后在页面上使用
    currentRuleData(newnew, oldold) {
      console.log("监听", newnew, oldold);
      this.currentRuleDataList = newnew;
      let comment = this.currentRuleDataList.fieldContent.split(",");
      let name = this.currentRuleDataList.fieldName.split(",");
      let fieldType = this.currentRuleDataList.fieldType;
      // console.log(comment)
      // console.log(name)
      let rightArr = [];
      for (var i = 0; i < name.length; i++) {
        let obj = {
          COLUMN_COMMENT: "",
          COLUMN_NAME: "",
          DATA_TYPE: fieldType,
          check: false,
        };
        obj.index = i;
        rightArr.push({
          COLUMN_COMMENT: comment[i],
          COLUMN_NAME: name[i],
          DATA_TYPE: fieldType,
          check: false,
        });
      }
      this.rightData = rightArr;
      const newArr = this.leftData.filter(
        (item) => !name.includes(item.COLUMN_NAME)
      );
      this.leftData = newArr;
      this.$refs.ruleContent.form.guizeCon = this.currentRuleDataList.conditionName;
      this.$refs.ruleContent.form.guizeConValue = this.currentRuleDataList.conditionValue;
    },
  },

  methods: {
    
    toRight() {
      let selectData = this.leftData.filter((item) => item.check);
      this.rightData.push(...selectData);
      this.leftData = this.leftData.filter((item) => !item.check);
      this.leftCheckAll = false;
    },
    toLeft() {
      let selectData = this.rightData.filter((item) => item.check);
      this.leftData.push(...selectData);
      this.rightData = this.rightData.filter((item) => !item.check);
      this.rightCheckAll = false;
    },
    leftCheckAllChange() {
      this.leftData.forEach((v) => (v.check = this.leftCheckAll));
    },
    rightCheckAllChange() {
      this.rightData.forEach((v) => (v.check = this.rightCheckAll));
    },
    leftCurChange() {
      this.leftCheckAll = this.leftData.every((v) => v.check);
    },
    rightCurChange() {
      this.rightCheckAll = this.rightData.every((v) => v.check);
    },

    async getColumnsList() {
      this.loading = true;
      const res = await getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.queryJson.assessTable.tableName,
      });
      this.leftData = res.data.result;
      this.leftData.map((val, key) => {
        this.$set(val, "check", false);
      });
      this.gzzdList = res.data.result;
      // console.log(this.leftData)
      // this.rightData.map((val,key)=>{this.$set(val,'check',false)})
      this.loading = false;
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
      let name = this.rightData.map((item) => item.COLUMN_NAME).toString();
      let comment = this.rightData
        .map((item) => item.COLUMN_COMMENT)
        .toString();
      fieldList.push({
        fieldName: name,
        fieldContent: comment,
        fieldType: "varchar",
      });
      //console.log(fieldList)

      if (this.rightData.length < 1) {
        this.$message({
          message: "组合唯一规则至少需要一个属性",
          type: "warning",
        });
        return;
      }

      this.queryJson.fieldList = fieldList;
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue;
      this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon;
      // console.log(this.queryJson)

      // this.$refs.userManageform.validate(async (valid) => {
      //   if (valid) {
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
      // } else {
      //   return false;
      // }
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.listTit {
  display: flex;
  justify-content: space-between;
  width: 750px;
  margin: 20px auto 10px;
}
.listTit div {
  width: 280px;
  font-weight: bold;
}
#transfer {
  display: flex;
  justify-content: space-between;
  width: 750px;
  margin: 0 auto 50px;
}
.panel {
  width: 280px;
  border: solid 1px #ddd;
}
.panel-heading {
  height: 38px;
  line-height: 38px;
  background: #409eff;
}
.panel-heading span {
  color: #fff;
}
.pull-right {
  color: #fff;
  padding-right: 10px;
}
.panel-body {
  padding: 10px;
  height: 300px;
  overflow: auto;
}
.panel-body li {
  font-weight: normal;
  line-height: 26px;
  margin-bottom: 5px;
}
.panel-body li label {
  font-weight: normal;
}
.btn {
  padding-top: 100px;
}
.btn input {
  display: block;
  margin-bottom: 20px;
  color: #fff;
  background: #409eff;
  border: 0;
  width: 60px;
  height: 30px;
  font-size: 16px;
  border-radius: 5px;
}
.search {
  width: 250px;
  margin: 0 auto;
  border-radius: 20px;
  border: solid 1px #ddd;
  display: block;
  height: 28px;
  margin-top: 10px;
  padding: 0 10px;
}
.rule-content-div {
  width: 750px;
  margin: 30px auto 50px;
}
</style>
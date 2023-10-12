<template>
  <div class="container">
    <div class="listTit">
      <div>待选列表</div>
      <div>已选列表</div>
    </div>
    <div id="transfer" v-loading="loading">
      <container :datas="contents" :type="0"></container>
      <div id="btns">
        <input type="button" value=">>" @click="change_type(0)" class="to" />

        <input type="button" value="<<" @click="change_type(1)" class="to" />
      </div>
      <container :datas="contents" :type="1"></container>
    </div>
    <div class="rule-content-div">
      <el-form :model="form" label-width="100px">
            <RuleContent :gzzdList="gzzdList" ref="ruleContent" :postData="postData" />
      </el-form>
    </div>
    <div class="pull-right">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="prev">上一步</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { addRules, getColumns } from "@/api/dataCenter/dataGovernance";
import container from "./transferContainer.vue";
import RuleContent from "./ruleContent.vue";
export default {
  name: "Feikong",
  components: {
    container,
    RuleContent,
  },
  data() {
    return {
      active: 2,
      loading: true,
      contents: [],
      submitData: [],
      arr: [],
      type1Arr: [],
      postArr: [],
      queryJson: {},
      form:{},
      gzzdList:[]
    };
  },
  props: {
    postData: Object,
  },

  created() {
    this.queryJson = this.postData;
    this.getColumnsList();
  },

  methods: {
    change_type(type) {
      var content = {};
      for (content of this.contents) {
        // console.log(content)
        if (content.chosen && content.type === type) {
          content.chosen = false;
          content.type = Number(!type);
        }
        if (content.type == 1) {
          this.arr.push(content);
        }
      }
      console.log(this.arr);
      let map = new Map();
      for (let item of this.arr) {
        if (!map.has(item.COLUMN_NAME)) {
          map.set(item.COLUMN_NAME, item);
        }
      }
      this.type1Arr = [...map.values()];
      // console.log(this.type1Arr);
    },

    async getColumnsList() {
      this.loading = true;
      const res = await getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.queryJson.assessTable.tableName,
      });
      this.contents = res.data.result;
      this.contents.map((val, key) => {
        this.$set(val, "type", 0);
      });
      this.contents.map((val, key) => {
        this.$set(val, "chosen", false);
      });
      this.gzzdList = res.data.result;
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
      this.postArr = this.type1Arr.filter((item) => {
        return item.type !== 0;
      });
      var fieldList = [];
      for (var i = 0; i < this.postArr.length; i++) {
        let obj = { fieldName: "", fieldContent: "", fieldType: "" };
        obj.index = i;
        fieldList.push({
          fieldName: this.postArr[i].COLUMN_NAME,
          fieldContent: this.postArr[i].DATA_TYPE,
          fieldType: this.postArr[i].DATA_TYPE,
        });
      }
      console.log(fieldList);
      this.queryJson.fieldList = fieldList;
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue;
      this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon;
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
  margin: 50px auto 10px;
}
.listTit div {
  width: 280px;
  font-weight: bold;
}
#transfer {
  width: 750px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
#btns {
  width: 60px;
  height: 120px;
  margin: auto;
}
#btns input {
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
.rule-content-div {
  width: 750px;
  margin: 30px auto 50px;
}
</style>
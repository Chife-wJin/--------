<template>
  <div>
    <div class="Step3hezhun">
      <el-form
        ref="hezhunRulesform"
        :model="form"
        label-width="100px"
        :rules="rules"
      >
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="10" class="branch-name" v-show="isShow">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="form.ruleName" size="small" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" class="branch-name">
            <el-form-item label="对比对象" prop="comparaTable">
              <el-select
                v-model="form.comparaTable"
                filterable
                placeholder="请搜索选择对比对象"
                size="small"
                @change="checkCompareObject"
              >
                <el-option
                  v-for="(item,i) in dbdxList"
                  :key="i"
                  :label="item.TABLE_COMMENT"
                  :value="item.TABLE_NAME"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="editArea">
        <el-row :gutter="10" type="flex" justify="space-between">
          <el-col :span="12" class="branch-name">
            <div class="groupw">
              <div class="title">判断依据</div>
              <el-button
                type="primary"
                plain
                @click="onAddLayer"
                icon="el-icon-plus"
                size="mini"
                >添加</el-button
              >
            </div>
            <el-table border :data="tableData1" size="small">
              <el-table-column
                prop="type"
                :label="'【'+postData.assessTable.tableContent+postData.assessTable.tableName +'】'+ '字段'"
                width="200"
              >
                <template slot-scope="scope">
                  <div>
                    <el-select
                      v-model="scope.row.fieldName"
                      placeholder="请选择字段"
                      size="mini"
                      value-key="COLUMN_NAME"
                      @change="((val)=>{table1Field(val,scope.$index)})"
                    >
                      <el-option
                        v-for="(item,i) in gzzdList"
                        :key="i"
                        :label="item.COLUMN_NAME"
                        :value="item.COLUMN_NAME"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="【对比对象】字段" width="200">
                <template slot-scope="scope">
                  <div>
                    <el-select
                      v-model="scope.row.comparaFieldName"
                      placeholder="请选择对比对象"
                      size="mini"
                      value-key="COLUMN_NAME"
                      @change="((val)=>{table1comparaField(val,scope.$index)})"
                    >
                      <el-option
                        v-for="(item,i) in dbzdList"
                        :key="i"
                        :label="item.COLUMN_NAME"
                        :value="item.COLUMN_NAME"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="74">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="onDelLayer(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12" class="branch-name">
            <div class="groupw">
              <div class="title">核准内容</div>
              <el-button
                type="primary"
                plain
                @click="onAddLayer2"
                icon="el-icon-plus"
                size="mini"
                >添加</el-button
              >
            </div>

            <el-table border :data="tableData2" size="small">
              <el-table-column prop="type" label="被核准字段" width="200">
                <template slot-scope="scope">
                  <div>
                    <el-select
                      v-model="scope.row.fieldName"
                      placeholder="请选择被核准字段"
                      filterable
                      size="mini"
                      value-key="COLUMN_NAME"
                      @change="((val)=>{table2Field(val,scope.$index)})"
                    >
                      <el-option
                        v-for="(item,i) in gzzdList"
                        :key="i"
                        :label="item.COLUMN_NAME"
                        :value="item.COLUMN_NAME"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="对比字段" width="200">
                <template slot-scope="scope">
                  <div>
                    <el-select
                      v-model="scope.row.comparaFieldName"
                      filterable
                      placeholder="请选择对比字段"
                      size="mini"
                      value-key="COLUMN_NAME"
                      @change="((val)=>{table2comparaField(val,scope.$index)})"
                    >
                      <el-option
                        v-for="(item,i) in dbzdList"
                        :key="i"
                        :label="item.COLUMN_NAME"
                        :value="item.COLUMN_NAME"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="74">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="onDelLayer2(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div class="rule-content-div">
          <el-form :model="form" label-width="100px">
                <RuleContent :gzzdList="gzzdList" ref="ruleContent" :postData="postData" />
          </el-form>
        </div>
      </div>
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
  getColumns
} from "@/api/dataCenter/dataGovernance";
import RuleContent from "./ruleContent.vue";
export default {
  name: "Step3hezhun",
  components: {
    RuleContent,
  },
  data() {
    return {
      active: 2,
      isShow:true,
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        comparaTable: [
          { required: true, message: "请输入规则字段", trigger: "change" },
        ],
      },
      form: {
        ruleName:"",
        comparaTable:"",
      },
      queryJson: {},
      dbdxList:[],
      gzzdList:[],
      dbzdList:[],
      tableData1: [
        {
          fieldName: "",
          fieldContent:"",
          fieldType:"",
          comparaFieldName: "",
          comparaFieldComment:"",
          comparaFieldType:"",
          fieldJoinWhere:1
        },
      ],
      tableData2: [
        {
          fieldName: "",
          fieldContent:"",
          fieldType:"",
          comparaFieldName: "",
          comparaFieldComment:"",
          comparaFieldType:"",
          fieldJoinWhere:2
        },
      ],
      currentRuleDataList:{},
      att:[]
    };
  },
  props: {
    postData: Object,
    rowId:Number,
    currentRuleData:Object
  },
  created() {
     this.queryJson = this.postData;
     this.getdbdxList()
     this.getColumnsList()
    if(this.rowId){
      this.isShow = false
    }
  },
  watch: {
    // 监听到父组件传递过来的数据后，加工一下，
    // 存到data中去，然后在页面上使用
    currentRuleData(newnew, oldold) {
     // console.log("监听", newnew, oldold);
      this.currentRuleDataList = newnew;
      this.form.ruleName = this.currentRuleDataList.ruleName
      this.form.comparaTable = this.currentRuleDataList.comparaTable
      this.att = this.currentRuleDataList.assessFieldList

     // console.log(this.att)
      let arr1 = this.att.filter(item => {return item.fieldJoinWhere == 1})
      this.tableData1 = arr1
      let arr2 = this.att.filter(item => {return item.fieldJoinWhere == 2})
      this.tableData2 = arr2
      this.$refs.ruleContent.form.guizeCon = this.currentRuleDataList.conditionName
      this.$refs.ruleContent.form.guizeConValue = this.currentRuleDataList.conditionValue
    },
  },
  methods: {
    async getdbdxList() {
      const reponse = await getTables({
        id: this.queryJson.assessTable.datasourceId,
        dataBase: this.queryJson.assessTable.databaseName,
      });
     // console.log(reponse);
      this.dbdxList = reponse.data;
    },
    async getColumnsList() {
      const res = await getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.queryJson.assessTable.tableName,
      });
      this.gzzdList = res.data.result;
      //console.log(this.gzzdList)
    },
    checkCompareObject() {
      //拿到对比字段的下拉数据
       getColumns({
        dataBase: this.queryJson.assessTable.databaseName,
        id: this.queryJson.assessTable.datasourceId,
        tables: this.form.comparaTable,
      }).then(res=>{
          console.log(res.data.result)
          this.dbzdList = res.data.result;
      });
    },
    onAddLayer() {
      var that = this;
      if (that.tableData1) {
        that.tableData1.push({
          fieldName: "",
          fieldContent:"",
          fieldType:"",
          comparaFieldName: "",
          comparaFieldComment:"",
          comparaFieldType:"",
          fieldJoinWhere:1
        });
      } else {
        that.tableData1 = [
          {
            fieldName: "",
            fieldContent:"",
            fieldType:"",
            comparaFieldName: "",
            comparaFieldComment:"",
            comparaFieldType:"",
            fieldJoinWhere:1
          },
        ];
      }
    },
    onDelLayer(index, row) {
      this.tableData1.splice(index, 1);
    },
    onAddLayer2() {
      var that = this;
      if (that.tableData2) {
        that.tableData2.push({
          fieldName: "",
          fieldContent:"",
          fieldType:"",
          comparaFieldName: "",
          comparaFieldComment:"",
          comparaFieldType:"",
          fieldJoinWhere:2
        });
      } else {
        that.tableData2 = [
          {
            fieldName: "",
            fieldContent:"",
            fieldType:"",
            comparaFieldName: "",
            comparaFieldComment:"",
            comparaFieldType:"",
            fieldJoinWhere:2
          },
        ];
      }
    },
    onDelLayer2(index, row) {
    this.tableData2.splice(index, 1);
    },

    table1Field(v,i){
      // console.log(v)
      // console.log(i)
      // this.tableData1[i].fieldName = v.COLUMN_NAME;
      // this.tableData1[i].fieldContent = v.COLUMN_COMMENT
      // this.tableData1[i].fieldType = v.DATA_TYPE
      // console.log(this.tableData1)
      this.tableData1[i].fieldName = v
      this.tableData1[i].fieldContent = this.gzzdList.find(item => item.COLUMN_NAME === v).COLUMN_COMMENT;
      this.tableData1[i].fieldType = this.gzzdList.find(item => item.COLUMN_NAME === v).DATA_TYPE;
    },
    table1comparaField(v,i){
      // console.log(v)
      // this.tableData1[i].comparaFieldName = v.COLUMN_NAME;
      // this.tableData1[i].comparaFieldComment = v.COLUMN_COMMENT
      // this.tableData1[i].comparaFieldType = v.DATA_TYPE
      // console.log(this.tableData1)
      this.tableData1[i].comparaFieldName = v;
      this.tableData1[i].comparaFieldComment = this.dbzdList.find(item => item.COLUMN_NAME === v).COLUMN_COMMENT;
      this.tableData1[i].comparaFieldType = this.dbzdList.find(item => item.COLUMN_NAME === v).DATA_TYPE;
    },
    table2Field(v,i){
       console.log(v)
      // this.tableData2[i].fieldName = v.COLUMN_NAME;
      // this.tableData2[i].fieldContent = v.COLUMN_COMMENT
      // this.tableData2[i].fieldType = v.DATA_TYPE
      this.tableData2[i].fieldName = v
      this.tableData2[i].fieldContent = this.gzzdList.find(item => item.COLUMN_NAME === v).COLUMN_COMMENT;
      this.tableData2[i].fieldType = this.gzzdList.find(item => item.COLUMN_NAME === v).DATA_TYPE;
    },
    table2comparaField(v,i){
      // console.log(v)
      // this.tableData2[i].comparaFieldName = v.COLUMN_NAME;
      // this.tableData2[i].comparaFieldComment = v.COLUMN_COMMENT
      // this.tableData2[i].comparaFieldType = v.DATA_TYPE
      this.tableData2[i].fieldName = v
      this.tableData2[i].fieldContent = this.dbzdList.find(item => item.COLUMN_NAME === v).COLUMN_COMMENT;
      this.tableData2[i].fieldType = this.dbzdList.find(item => item.COLUMN_NAME === v).DATA_TYPE;
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
      var assessFieldList = []
      this.queryJson.ruleName = this.form.ruleName
      this.queryJson.comparaTable = this.form.comparaTable
      assessFieldList.push(...this.tableData1,...this.tableData2)
      this.queryJson.assessFieldList = assessFieldList;
      this.queryJson.conditionValue = this.$refs.ruleContent.form.guizeConValue
      this.queryJson.conditionName = this.$refs.ruleContent.form.guizeCon
      console.log(this.queryJson);
      
      this.$refs.hezhunRulesform.validate(async (valid) => {
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
.Step3hezhun {
  width: 100%;
  margin: 0 auto 50px;
  .editArea{
      min-height: 300px;
      margin-top: 20px;
  }
}
.groupw {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .title {
    font-weight: bold;
  }
}
.rule-content-div {
  width: 750px;
  margin: 30px auto 50px;
}
</style>
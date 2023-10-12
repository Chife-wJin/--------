<template>
  <div class="new">
    <el-form ref="serviceManageform" :model="form" label-width="120px" :rules="rules">
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="服务名称" prop="apiServicename">
            <el-input v-model="form.apiServicename" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="服务url" prop="apiServiceurl">
            <div style="display:flex;justify-content:space-between">
              <a style=" display:block; color:#999; width:7%; text-align:center">{{qianzhui}}</a>
              <el-input v-model="form.apiServiceurl" size="small" style="width:93%; "></el-input>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="服务配置" prop="apiType">
            <el-radio-group v-model="form.apiType" @change="changePz">
              <el-radio label="1">表引导模式</el-radio>
              <el-radio label="2">脚本模式</el-radio>
              <el-radio label="3">系统文件</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 选择表 -->
          <el-form-item
            label="选择表"
            prop="tableName"
            v-if="form.apiType == '1'"
          >
            <el-select v-model="form.tableName" size="small" value-key="name">
              <el-option
                v-for="item in tableList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- SQL语句 -->
          <el-form-item label="SQL语句：" v-if="form.apiType == '2'">
            <el-input
              v-model="form.apiSql"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
          <!-- 系统文件 -->
          <el-form-item label="文件：" v-if="form.apiType == '3'" prop="licenseOriginal">
              <upload
                ref="uploadFile"
                :limit="1"
                :fileId="form.fileId"
                fromKey="fileId"
                @setUrlPath="setUrlPath"
                @deleteServeFile="deleteServeFile"
              ></upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-show="isShow">
        <el-col :span="22" class="branch-name">
          <el-form-item label="请求信息" prop="apiServiceprice">
            <div class="groupw">
              <el-button
                type="primary"
                plain
                @click="onAddLayer"
                icon="el-icon-plus"
                size="mini"
                >添加</el-button
              >
            </div>
            <el-table border :data="tableData" size="small">
              <el-table-column prop="type" label="参数名称" width="130">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.fieldName"
                    size="small"
                    :disabled = "scope.row.disabled"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="参数描述" width="130">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.fieldContent"
                    size="small"
                    :disabled = "scope.row.disabled"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="参数类型" width="130">
                <template slot-scope="scope">
                  <div>
                    <el-select
                      v-model="scope.row.parameterType"
                      size="mini"     
                      :disabled = "scope.row.disabled"                 
                    >
                      <el-option
                        v-for="(item, i) in parameterList"
                        :key="i"
                        :label="item.title"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="操作符" width="130">
                <template slot-scope="scope">
                  <div>
                    <el-select
                      v-model="scope.row.expressions"
                      size="mini"
                      :disabled = "scope.row.disabled"
                    >
                      <el-option
                        v-for="(item, i) in operatorList"
                        :key="i"
                        :label="item.title"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="默认值" width="130">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.parameterValue"
                    size="small"
                    :disabled = "scope.row.disabled"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="106">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="onDelLayer(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="备注：" prop="apiServiceprice">
            <el-input
              v-model="form.apiServiceprice"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm" v-show="isBtnShow"
            >保存</el-button
          >
          <el-button type="primary" @click="goBack" plain>返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { 
  saveAddInfo, 
  getServiceById,
  findTableList,
  dictListType,
  accessFileList
} from "@/api/dataCenter/dataShare.js";
export default {
  name: "New",
  data() {
    return {
      isShow:true,
      qianzhui:"/api/",
      isRequesting: false,
      curValue: "",
      tableList:[],
      form: {
        apiServicename: "",
        apiServiceurl: "",
        apiType: "1",
        tableName:"",
        apiSql:"",
        accessFile:"",
        fileId:""
      },
      isBtnShow: true,
      dataResourseList: [],
      parameterList:[],
      operatorList:[],
      sysFileList:[],
      tableData: [
        {
          fieldName: "pageNo",
          fieldContent: "页数",
          parameterType: "3",
          expressions: "c1",
          parameterValue: "1",
          disabled:true
        },
        {
          fieldName: "pageSize",
          fieldContent: "每页条数",
          parameterType: "3",
          expressions: "c1",
          parameterValue: "15",
          disabled:true
        },
      ],
      rules: {
          apiServicename: [
            { required: true, message: '请输入服务名称', trigger: 'blur' },
          ],
          apiServiceurl: [
            { required: true, message: '请选择服务url', trigger: 'change' }
          ],
          apiType: [
            { required: true, message: '请选择服务配置', trigger: 'change' }
          ],
          tableName: [
            { required: true, message: '请选择表', trigger: 'change' }
          ]
        }
    };
  },
  props: {
    id: String,
    type: String,
  },
  created() {
    if (this.type == "edit" || this.type == "view") {
      this.getData();
    }
    if (this.type == "view") {
      this.isBtnShow = false;
    }
    this.getTableList()
    this.getDicList()
    this.getaccessFileList()
  },

  methods: {
    changePz(v){
      console.log(v)
      if(v==1 || v==2){
        this.qianzhui = "/api/"
        this.isShow = true
      }else{
        this.qianzhui = "/file/"
        this.isShow = false
      }
    },
     setUrlPath(file) {
      console.log(file)
      this.form[file.fromKey] = file.fileId;
      this.form.accessFile = file.fileId
    },
    deleteServeFile(file) {
      console.log(file)
      this.form[file.fromKey] = undefined;
      this.form.accessFile = undefined
    },
    onAddLayer() {
      var that = this;
      that.tableData.push({
        fieldName:"",
        fieldContent:"",
        parameterType:"",
        expressions:"",
        parameterValue:"",
      });

      console.log(this.tableData);
      // if (that.tableData) {
      //   that.tableData.push({
      //     fieldName: "",
      //     fieldContent:"",
      //     fieldType:"",
      //     comparaFieldName: "",
      //     comparaFieldComment:"",
      //     comparaFieldType:"",
      //     fieldJoinWhere:1
      //   });
      // } else {
      //   that.tableData = [
      //     {
      //       fieldName: "",
      //       fieldContent:"",
      //       fieldType:"",
      //       comparaFieldName: "",
      //       comparaFieldComment:"",
      //       comparaFieldType:"",
      //       fieldJoinWhere:1
      //     },
      //   ];
      // }
    },
    onDelLayer(index, row) {
      this.tableData.splice(index, 1);
    },
    btnShow() {
      this.isBtnShow = false;
    },

    getData: function () {
      getServiceById({
        id: this.id,
      }).then((res) => {
       // console.log(res)
         if(res.data.apiType == 1 || res.data.apiType == 2){
          this.form.apiServiceurl = res.data.apiServiceurl.replace('/api/','')
          console.log(this.form.apiServiceurl)
          this.qianzhui = "/api/"
          this.isShow = true
         }else{
          this.form.apiServiceurl = res.data.apiServiceurl.replace('/file/','')
          this.qianzhui = "/file/"
          this.isShow = false
         }
        this.form.apiServicename = res.data.apiServicename,
        this.form.apiType = res.data.apiType.toString(),
        this.form.tableName = res.data.tableName,
        this.form.apiSql = res.data.apiSql,
        this.form.fileId = res.data.accessFile
      });
    },
    async getTableList(){
      let response = await findTableList()
      this.tableList = response.data
    },
    async getDicList(){
      let parameterTypeResponse = await dictListType({type:"parameter_type"})
      this.parameterList = parameterTypeResponse.data
      let operatorListResponse = await dictListType({type:"operator_type"})
      this.operatorList = operatorListResponse.data
    },

    async getaccessFileList(){
      let response = await accessFileList()
      console.log(response)
      this.sysFileList = response.data
    },
    
    submitForm: function () {
      let query = {}
      let list = []
      if (this.type == "edit") {
        query.id = this.id;
      }
      if (this.isRequesting) {
        return;
      }
      
      list.push(...this.tableData)
      list.forEach(item => {
          item.parameterType = Number(item.parameterType)
        });
      if(this.form.apiType == "1"){
        this.form.apiSql = ""
        this.form.accessFile = ""
        query.apiServiceurl = '/api/'+this.form.apiServiceurl
        query.list = list
      }else if(this.form.apiType == "2"){
        this.form.accessFile = ""
        query.apiServiceurl = '/api/'+this.form.apiServiceurl
        query.list = list
      }else{
        this.form.tableName = ""
        this.form.apiSql = ""
        query.apiServiceurl = '/file/'+this.form.apiServiceurl
      }
      query.apiServicename = this.form.apiServicename
      
      query.apiType = this.form.apiType
      query.tableName = this.form.tableName
      query.apiSql = this.form.apiSql
      query.accessFile = this.form.accessFile
      
      console.log(query)

      // this.$refs.serviceManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      saveAddInfo(query)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
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
          this.$emit("hidden");
        });
      loading.close();
      // } else {
      //   return false;
      // }
      // });
    },
    goBack() {
      this.$emit("goBack");
    },
    close: function () {
      this.isSearchBoxShow = false;
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
::v-deep .el-table--small .el-table__cell {
  padding: 0;
}
.el-table th.el-table__cell > .cell {
  text-align: center;
}
::v-deep .el-table .cell, .el-table--border .el-table__cell{ text-align: center;}

::v-deep .el-row {
  margin-bottom: 16px;
}
::v-deep .btn .el-form-item__content {
  margin-left: 0;
  margin-right: 120px;
}
.groupw {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .title {
    font-weight: bold;
  }
}
</style>
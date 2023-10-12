<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="queryParams"
      :inline="true"
      size="small"
      label-width="78px"
    >
      <el-form-item label="规则名称:" prop="monitorName">
        <el-input
          v-model="queryParams.monitorName"
          style="width: 250px"
          placeholder="请输入规则名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间:" prop="sheetName">
        <el-date-picker v-model="queryParams.dateTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="规则类型:" prop="monitorType">
        <el-select
          v-model="queryParams.monitorType"
          style="width: 250px"
          placeholder="请选择数据种类"
        >
          <el-option
            v-for="(v, i) in TypeList1"
            :key="i"
            :value="v.value"
            :label="v.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >查询</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="resetHandle"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div>
      <el-table
        v-loading="loading"
        border
        class="container-table"
        :data="List"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="monitorRule.monitorName" label="规则名称"></el-table-column>
        <el-table-column label="任务开始时间" >
          <template slot-scope="scope">
            {{ scope.row.execDatetime }}
          </template>
        </el-table-column>
        <el-table-column label="耗时">
          <template slot-scope="scope">
          {{ scope.row.execDuration }} <span v-if="scope.row.execDuration">秒</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
          {{ scope.row.complete | state }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table
       v-loading="loading"
        border
        class="container-table"
        :data="ListAlert">
        <template v-for="(item, index) in tableHead">
          <el-table-column
            :prop="item.column_name"
            :label="item.column_name"
            :key="index"
          ></el-table-column>
        </template>
      </el-table> -->
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      class="pull-right"
    />
    <!-- 详情弹窗 -->
    <el-dialog
      :title="titleName"
      :visible.sync="detailDialog"
      :show-close="true"
      center
      width="1200px"
    >
     
      <table class="detailTable">
        <tr>
          <td width="100">规则名称</td>
          <td>{{detailRuleName}}</td>
          <td width="100">状态:</td>
          <td>{{detailState | state}}</td>
        </tr>
        <tr>
          <td width="100">任务时间</td>
          <td>{{detailTaskTime}}</td>
          <td width="100">耗时:</td>
          <td>{{detailUseTime}} 秒</td>
        </tr>
        <tr>
          <td width="100">校验类型</td>
          <td>{{detailMonitorCheckType | monitorCheckTypeFilter}}</td>
          <td width="100">阀值:</td>
          <td>{{detailMonitorCheckValue}}</td>
        </tr>
        <tr>
          <td width="100">监控对象</td>
          <td colspan="3">{{detailjkdx}}</td>
        </tr>
        <!-- <tr>
          <td width="100">监控结果</td>
          <td colspan="3">
            <ul class="detail-view">
              <li v-for="(v,i) in ulData" :key="i">{{v}}</li>
            </ul>
          </td>
        </tr> -->
      </table>
      <p class="tit">监控结果</p>
       <el-table
      v-if="detailDialog"
       v-loading="loading"
        border
        class="container-table result-table"
        height="400px"
        :data="ListAlert">
        <template v-for="(item, index) in tableHead">
          <el-table-column
            :prop="item.column_name"
            :label="item.column_name"
            :key="index"
          ></el-table-column>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { dictListType } from "@/api/styem/dict/type.js";
import { monitorTaskResultsPage } from "@/api/datax/datax-access-monitoring";
export default {
  name: "WqzhhjglptUIIndex",
  data() {
    return {
      // 表头数据
      tableHead: [
        // {
        //   column_name: "enterprise_name",
        //   column_comment: "表头1",
        // },
        // {
        //   column_name: "size",
        //   column_comment: "表头2",
        // },
        // {
        //   column_name: "station_name",
        //   column_comment: "表头3",
        // },
      ],
      // 表格数据
      // tableData: [
      //   {
      //     enterprise_name: "3",
      //     size: "aa",
      //     station_name: "女",
      //   },
      //   {
      //     enterprise_name: "4",
      //     size: "ss",
      //     station_name: "男",
      //   },
      //   {
      //     enterprise_name: "5",
      //     size: "dd",
      //     station_name: "女",
      //   },
      // ],
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        monitorName: undefined,
        dateTime: undefined,
        monitorType: undefined,
      },
      total: 1,
      loading: true,
      typeList: [],
      TypeList1:[
        {
          label:"表级规则",
          value:"1"
        },
        {
          label:"字段规则",
          value:"2"
        },
        {
          label:"自定义SQL",
          value:"3"
        },
        { 
          label: "JAVA类" ,
          value: "4"
        }
      ],
      sheetList: [],
      List: [],
      ListAlert:[],
      ids: [],
      single: [],
      multiple: [],
      detailDialog: false,
      schedulSetDialog: false,
      alarmSetDialog: false,
      titleName: "详情",
      detail: {},
      status:false,
      ulData:[],
      detailRuleName:"",
      detailState:"",
      detailTaskTime:"",
      detailUseTime:"",
      detailjkdx:"",
      detailMonitorCheckType:"",
      detailMonitorCheckValue:""
    };
  },
  filters:{
    timeTransition(sjc){
      var date = new Date(sjc);
      let Y = date.getFullYear() + '-';
      let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let  D = date.getDate() + ' ';
      let  h = date.getHours() + ':';
      let  m = date.getMinutes() + ':';
      let  s = date.getSeconds();
      return Y+M+D+h+m+s
    },
    state(v){
      if(v){
        return "警告"
      }else{
        return "正常"
      }
    },
    monitorCheckTypeFilter(v){
      if(v==1){
        return "数值型"
      }else if(v==2){
        return "波动率型"
      }else if(v==3){
        return "平均波动"
      }
    }
  },
  created() {
    this.getTypeList();
    this.getList();
  },

  methods: {
    // 搜索相关 start

    //获取规则类型字典数据
    async getTypeList() {
      const reponse = await dictListType({ type: "data_types" });
      this.typeList = reponse.data;
    },

    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    resetHandle() {
      (this.queryParams.pageNum = 1),
        (this.pageSize = 15),
        (this.queryParams.ruleType = ""),
        (this.queryParams.startDate = ""),
        (this.queryParams.endDate = ""),
        (this.queryParams.monitorType = ""),
        this.getList();
    },
    // 搜索相关 end

    //查看详情
    handleView(row) {
      console.log(row);
      this.detailDialog = true
      this.ListAlert = JSON.parse(row.alertData);
      this.detailRuleName = row.monitorRule.monitorName
      this.detailState = row.complete
      this.detailTaskTime = row.execDatetime
      this.detailUseTime = row.execDuration
      this.detailjkdx =row.monitorRule.monitorSql
      this.detailMonitorCheckType = row.monitorRule.monitorCheckType
      this.detailMonitorCheckValue = row.monitorRule.monitorCheckValue
      console.log(this.ListAlert)
      let ListAlertNewArr = this.ListAlert.map(o=>{
        return Object.assign(o, { "监测条数": o.size });
      });
      for (const key in ListAlertNewArr) {
          // 删除size属性
          delete ListAlertNewArr[key].size
      }
      let arr = []
      this.tableHead = []
      for(let i=0; i<ListAlertNewArr.length; i++){
        let strArr =  Object.keys(ListAlertNewArr[i])
        arr.push(strArr)
      }
      for(let i=0; i<arr[0].length; i++){
        let obj = {column_name:""}
        obj.index = i
        this.tableHead.push({column_name:arr[0][i]})
      }
      console.log(this.tableHead)

      // let arr = []
      // for(let i=0; i<this.ListAlert.length; i++){
      //   let strArr =  Object.values(this.ListAlert[i])
      //   arr.push(strArr)
      // }
      // this.ulData = arr.map(item => {
      //   return item.join("，")
      // })
    },

    // 表格相关 start
    async getList() {
      this.loading = true;
      const { code, data } = await monitorTaskResultsPage(this.queryParams);
      if (code == 200) {
        this.loading = false;
        console.log(data);
        // if(data.records.length>0){
          this.List = data.records
          console.log(this.List);
        // }
        this.total = data.total;
      }
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    // 表格相关 end
    // 弹窗相关 start

    // 弹窗相关 end
  },
};
</script>
<style lang='scss' scoped>
.svg-icon {
  margin-right: 0px;
}
.detail-view{ line-height: 30px; font-size: 14px; height: 400px; overflow: auto;
  li{ color: #ff4334; font-weight: bold;  font-style: italic; font-family: '宋体'; font-size: 16px;}
}
.detailTable{
  border: solid 1px #ccc;
  border-bottom: 0;
  border-right: 0;
   width: 90%; margin: 0 auto;
   td{ padding: 5px 10px;border-bottom: solid 1px #ccc;
  border-right: solid 1px #ccc; font-size: 14px;}
   tr td:nth-child(1),tr td:nth-child(3){
    background: #dbecfa;
   }
   }
.result-table{ width: 90%; margin: 0 auto;}
.tit{ width: 90%; margin: 30px auto 0; font-size:18px; color:#000; text-align: center;}
</style>
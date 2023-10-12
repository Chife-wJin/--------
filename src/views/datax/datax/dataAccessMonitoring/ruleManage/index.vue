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
      <!-- <el-form-item label="表名:" prop="sheetName">
        <el-select
          v-model="queryParams.sheetName"
          style="width: 250px"
          placeholder="请选择数据种类"
        >
          <el-option
            v-for="(v, i) in sheetList"
            :key="i"
            :value="v.value"
            :label="v.label"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="规则类型:">
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
    <el-row :gutter="10" class="mb8 container-state">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >
          新增
        </el-button>
        <el-button type="primary" plain size="mini" @click="handleDispatch" :disabled="isDisabled">
          <svg-icon icon-class="jihuatiaodu" />
          关联调度
        </el-button>
        <el-button type="primary" plain size="mini" @click="handleAlarm" :disabled="isDisabled">
          <svg-icon icon-class="shezhi" />
          告警设置
        </el-button>
      </el-col>
      <right-toolbar @queryTable="getList" />
    </el-row>
    <div>
      <el-table
        v-loading="loading"
        border
        class="container-table"
        :data="List"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="规则ID" />
        <el-table-column prop="monitorName" label="规则名称"></el-table-column>
        <el-table-column label="规则类型">
          <template slot-scope="scope">
            {{ scope.row.monitorType | monitorTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="monitorField" label="校验类型">
          <template slot-scope="scope">
            {{ scope.row.monitorCheckType | CheckTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column label="调度方式" >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.monitorTask"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleAlarmOnly(scope.row)"
                >配置调度</el-button
              >
              <span v-else>{{scope.row.monitorTask.cron}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="monitorField" label="启停状态">
            <template slot-scope="scope">
                <el-switch
                  style="display: block;"
                  v-model="scope.row.qt"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleToggle(scope.row)"
                  size="small"
                  active-text="启动"
                  inactive-text="停止">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              class="delete-state-btn"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleAlartOnly(scope.row)"
              >告警设置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      class="pull-right"
    />
    <!-- 规则弹窗 -->
    <el-dialog
      :title="titleName"
      :visible.sync="detailDialog"
      :show-close="true"
      center
      width="1200px"
    >
      <rule-detail
        v-if="detailDialog"
        :rowInfo="detail"
        ref="detailRef"
        @setDetailModal="setDetailModal"
        @getTableData="getList"
      />
    </el-dialog>

    <!-- 关联调度弹窗 -->
    <el-dialog
      :title="titleName"
      :visible.sync="schedulSetDialog"
      :show-close="true"
      center
      width="1200px"
    >
      <schedul-set
        v-if="schedulSetDialog"
        :ids="ids"
        :ruleNames="ruleNames"
        @goBack="closeSelf"
      />
    </el-dialog>

    <!-- 告警设置弹窗 -->
    <el-dialog
      :title="titleName"
      :visible.sync="alarmSetDialog"
      :show-close="true"
      center
      width="1200px"
    >
      <alarm-set
        v-if="alarmSetDialog"
        :selectedIds="ids"
        :ruleNames="ruleNames"
        :monitorAlertRow="monitorAlertRow"
        @goBack="closeSelf"
      />
    </el-dialog>
  </div>
</template>

<script>
import schedulSet from "./schedulSet"
import alarmSet from "./alarmSet";
import ruleDetail from "./ruleDetail";
import { dictListType } from "@/api/styem/dict/type.js";
import { 
  getPageList, 
  deleteList,
  monitorTaskStart,
  monitorTaskStop 
  } from "@/api/datax/datax-access-monitoring";
export default {
  name: "DataAccessMonitoring",
  components: {
    ruleDetail,
    schedulSet,
    alarmSet
  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        monitorName: undefined,
        // sheetName: undefined,
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
      ids: [],
      ruleNames:[],
      single: [],
      multiple: [],
      detailDialog: false,
      schedulSetDialog:false,
      alarmSetDialog:false,
      titleName: undefined,
      detail: {},
      isDisabled:true,
      monitorAlertRow:{},
      taskIdsString:"",
      alertIdsString:""
    };
  },

  created() {
    this.getTypeList();
    this.getList();
  },
  filters:{
    monitorTypeFilter(v){
      if(v==1){
        return "表级规则"
      }else if(v==2){
        return "字段规则"
      }else if(v==3){
        return "自定义SQL"
      }else{
        return "JAVA类"
      }
    },
    CheckTypeFilter(v){
      if(v==1){
        return "数值型"
      }else if(v==2){
        return "波动率型"
      }else if(v==3){
        return "平均波动"
      }
    }
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
        (this.queryParams.monitorType = ""),
        this.getList();
    },
    // 搜索相关 end

    // 表格相关 start
    async getList() {
      this.loading = true;
      const { code, data } = await getPageList(this.queryParams);
      if (code == 200) {
        this.loading = false;
        this.List = data.records;
        this.total = data.total;
        for(let i = 0; i < this.List.length; i++){
          this.$set(this.List[i],"qt","");
          if(!this.List[i].monitorTask || !this.List[i].monitorTask.exceState || this.List[i].monitorTask.exceState == 0){
            this.List[i].qt = false
          }else if(this.List[i].monitorTask && this.List[i].monitorTask.exceState == 1){
            this.List[i].qt = true
          }
        }
        console.log(this.List)
      }
    },
    handleSelectionChange(selection) {
      console.log(selection)
      if(selection.length>0){
        this.isDisabled = false;
      }else{
        this.isDisabled = true;
      }
      this.ids = selection.map((item) => item.id);
      this.ruleNames =  selection.map((item) => item.monitorName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;

      //任务
      // var newArray1  = [];
      // var k = 0;
      // for(let i in selection){
      //   if(selection[i].monitorTask){
      //     newArray1[k++] = selection[i]
      //   }
      // }
      // let taskIds = selection.map((item) => item.monitorTask.id)
      // this.taskIdsString = taskIds.toString()
      // console.log(this.taskIdsString)

      //告警
      // var newArray  = [];
      // var j = 0;
      // for(let i in selection){
      //   if(selection[i].monitorAlert){
      //     newArray[j++] = selection[i]
      //   }
      // }
      // let alertIds = newArray.map((item) => item.monitorAlert.id)
      // this.alertIdsString = alertIds.toString()
      // console.log(this.alertIdsString)
    },
    handleAlartOnly(row){
      console.log(row)
      this.ids = [];
      this.ids.push(row.id)
      this.ruleNames =  [];
      this.ruleNames.push(row.monitorName)
      this.alarmSetDialog = true
      this.titleName = "告警设置";
      this.monitorAlertRow = row
    },
    //启停按钮
    handleToggle(row){
      console.log(row)
      console.log(row.qt)
      if(row.qt){
        monitorTaskStart({id:row.monitorTask.id,monitorRule:row.id}).then((res) =>{
          this.getList();
        })
      }else{
        monitorTaskStop({id:row.monitorTask.id,monitorRule:row.id}).then((res) =>{
          this.getList();
        })
      }
    },
    handleAlarmOnly(row){
      console.log(row)
      this.ids = [];
      this.ids.push(row.id)
      this.ruleNames =  [];
      this.ruleNames.push(row.monitorName)
      this.schedulSetDialog = true;
      this.titleName = "关联调度";
      this.taskIdsString="",
      this.alertIdsString=""
    },
    handleEdit(row) {
      const { id } = row;
      const rowInfo = { type: "修改", id: row.id };
      this.detail = rowInfo;
      this.titleName = "修改规则";
      this.detailDialog = true;
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("确认要删除该信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteList({ ids: ids }).then((reponse) => {
            if (reponse.code == 200) {
              this.$message({
                message: reponse.msg,
                type: "success",
              });
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },
    // 表格相关 end
    // 弹窗相关 start
    handleCreate() {
      const rowInfo = { type: "添加" };
      this.detail = rowInfo;
      this.titleName = "新增规则";
      this.detailDialog = true;
    },
    setDetailModal(val) {
      this.detailDialog = val;
      this.getList();
    },

    //关联调度弹窗
    handleDispatch() {
      this.schedulSetDialog = true;
      this.titleName = "关联调度";
    },
    closeSelf(){
      this.schedulSetDialog = false;
      this.alarmSetDialog = false;
      this.getList();
    },
    handleAlarm() {
      this.alarmSetDialog = true
      this.titleName = "告警设置";
      this.monitorAlertRow = {}
    },
    // 弹窗相关 end
  },
};
</script>
<style lang='scss' scoped>
.svg-icon {
  margin-right: 0px;
}
.el-switch{ margin-top: 10px;}
</style>
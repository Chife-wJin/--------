<template>
    <div class="app-container">
        <div class="top">
            <div class="top-div">
                <el-dropdown class="el-dropdown" size="mini" hide-on-click  @command="handleCommand">
                    <el-button type="primary" size="mini">
                        新增<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">正则规则</el-dropdown-item>
                        <el-dropdown-item command="b">规范规则</el-dropdown-item>
                        <el-dropdown-item command="c">数值型阀值</el-dropdown-item>
                        <el-dropdown-item command="d">日期型阀值</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button 
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                @click="handleDeleteAll">批量删除</el-button>
            </div>
            <el-form
                class="search-body"
                :model="queryParams"
                :inline="true"
                label-width="120px"
                >
                <el-form-item label="" prop="ruleName">
                    <el-input 
                    v-model="queryParams.ruleName" 
                    size="small" 
                    style="width: 180px"
                    placeholder="请输入规则名称"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        
      <div>
        <el-table 
        v-loading="loading" 
        border 
        class="container-table" 
        :data="List"
        @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" label="选择" >
          </el-table-column>
          <el-table-column prop="ruleName" label="规则名称"></el-table-column>
          <el-table-column prop="ruleType_text" label="规则类型" ></el-table-column>
          <el-table-column prop="establishWay" label="创建方式" ></el-table-column>
          <el-table-column prop="constraintExpression" label="规则详情" ></el-table-column>
          <el-table-column prop="couValue" label="操作" min-width="80">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >编辑</el-button
                >
                <el-button
                size="mini"
                type="text"
                class="delete-state-btn"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
                >
            </template>
          </el-table-column>
        </el-table>
      </div>
    <pagination
      v-show="total>0"
      :total="total"
      :pageNo.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      class="pull-right"
    />
    <el-dialog
      :title="titleRegular"
      v-if="isShowAlertRegular"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      >
      <RegularRules @goBack="goBack" :type="type" :id="id" :ruleType="ruleType" @getList="getList" />
    </el-dialog>
    <el-dialog
      :title="titleCanonical"
      v-if="isShowAlertCanonical"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      >
    <CanonicalRules @goBack="goBack" :type="type" :id="id" :ruleType="ruleType" @getList="getList"/>
    </el-dialog>
    <el-dialog
      :title="titleNum"
      v-if="isShowAlertNumerical"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      >
      <Numerical @goBack="goBack" :type="type" :id="id" :ruleType="ruleType" @getList="getList"/>
    </el-dialog>
    <el-dialog
      :title="titleDate"
      v-if="isShowAlertDate"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      >
      <DateThreshold  @goBack="goBack" :type="type" :id="id" :ruleType="ruleType" @getList="getList"/>
    </el-dialog>
  </div>

</template>

<script>
import {
  commonRulesList,
  commonRulesDelete
} from "@/api/dataCenter/dataGovernance"
import CanonicalRules from "./components/canonicalRules.vue";
import RegularRules from "./components/regularRules.vue";
import Numerical from "./components/numerical.vue";
import DateThreshold from "./components/dateThreshold.vue";
export default {
    name: 'rules',

    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                ruleName:""
            },
            total: 1,
            loading: true,
            List: [],
            titleDate:"",
            titleNum:"",
            titleRegular:"",
            titleCanonical:"",
            isShowAlertRegular:false,
            isShowAlertCanonical:false,
            isShowAlertNumerical:false,
            isShowAlertDate:false,
            type:"",
            ruleType:"",
            id:1,
            visible:true,
            delIds:""
        };
    },
    components: {
        CanonicalRules,
        RegularRules,
        Numerical,
        DateThreshold
    },

    created() {
        this.getList();
    },

    methods: {
        handleSelectionChange(val) {    
          console.log(val) 
          let idsArr=[]
          idsArr = val.map(item => item.id)
          console.log(idsArr)
          this.delIds = idsArr.toString()
          console.log(this.delIds)
        },
        handleCommand(command) {
          console.log(command)
          switch (command) {
            case "a":
                this.isShowAlertRegular = true;
                this.titleRegular = "新增-正则规则"
                this.type = ""
                this.ruleType="rule01"
                break;
            case "b":
                this.isShowAlertCanonical = true;
                this.titleCanonical = "新增-规范规则"
                this.type = ""
                this.ruleType="rule02"
                break;
            case "c":
                this.isShowAlertNumerical = true;
                this.titleNum = "新增-数值阈值规则"
                this.type = ""
                this.ruleType="rule03"
                break;
            case "d":
                this.isShowAlertDate = true;
                this.titleDate = "新增-日期阈值规则"
                this.type = ""
                this.ruleType="rule04"
            } 
        },
        async getList() {
          this.loading = true;
          const reponse = await commonRulesList(this.queryParams);
          console.log(reponse)
          this.List = reponse.data.total ? reponse.data.records : [];
          this.total = reponse.data.total;
        this.List.map(item => {
            item.ruleType === 'rule01' ? (item.ruleType_text = '正则规则') : item.ruleType === "rule02" ? (item.ruleType_text = '规范规则') : item.ruleType === "rule03" ? (item.ruleType_text = '数值型阈值') : (item.ruleType_text = '日期型阈值')
        })
          this.loading = false;
        },
        handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
        },
        handleDeleteAll(){
            //console.log(this.delIds)
            this.$confirm("是否要删除？", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
            commonRulesDelete({ ids:this.delIds }).then((reponse) => {
                if (reponse.code == 200) {
                this.$message.success("已删除");
                this.getList();
                }
            });
            })
            .catch((err) => err);
        },
        handleDelete(row) {
        let id = row.id
        this.$confirm("确认要删除该元数据信息吗？", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
            commonRulesDelete({ ids:id }).then((reponse) => {
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
        handleEdit(row){
         console.log(row)
        this.id = row.id
        this.type = "edit"
        switch (row.ruleType) {
            case "rule01":
                this.isShowAlertRegular = true;
                this.titleRegular = "修改-正则规则"
                break;
            case "rule02":
                this.isShowAlertCanonical = true;
                this.titleCanonical = "修改-规范规则"
                break;
            case "rule03":
                this.isShowAlertNumerical = true;
                this.titleNum = "修改-数值阈值规则"
                break;
            case "rule04":
                this.isShowAlertDate = true;
                this.titleDate = "修改-日期阈值规则"
            } 
            
        },
        handleDialogClose() {
        this.isShowAlertRegular = false;
        this.isShowAlertCanonical = false;
        this.isShowAlertNumerical = false;
        this.isShowAlertDate = false;
        },
        goBack(){
        this.isShowAlertRegular = false;
        this.isShowAlertCanonical = false;
        this.isShowAlertNumerical = false;
        this.isShowAlertDate = false;
        }

    },
};
</script>

<style lang="scss" scoped>
.top{
    display: flex;
    justify-content: space-between;
    .top-div{
        padding-top: 22px ;
        .el-dropdown{
            margin-right: 20px;
        }
    }

}
    
</style>
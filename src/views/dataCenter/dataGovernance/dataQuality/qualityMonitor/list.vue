<template>
  <div class="app-container">
    <div class="top">
    <el-row :gutter="10" class="mb8 container-state">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleNew()"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-check"
          plain
          size="mini"
          @click="handleStart"
          :disabled="multipleSelection.length == 0"
          >启用</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-close"
          plain
          size="mini"
          @click="handleStop"
          :disabled="multipleSelection.length == 0"
          >停用</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDeleteAll"
          :disabled="multipleSelection.length == 0"
          >批量删除</el-button
        >
      </el-col>
    </el-row>
    <el-form
      class="search-body"
      :model="params"
      ref="queryForm"
      :inline="true"
      label-width="110px"
    >
      <el-form-item prop="taskName">
        <el-input
          v-model="params.taskName"
          size="small"
          placeholder="输入任务名称"
          style="width: 180px"
        ></el-input>
      </el-form-item>
    <el-form-item prop="ruleTableName">
        <el-input
          v-model="params.ruleTableName"
          size="small"
          placeholder="请输入所选模型"
          style="width: 180px"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    </div>
    
    
    <div class="information-body">
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        class="container-table"
        :stripe="true"
        border
        @selection-change="handleSelectionChange"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column sortable prop="taskName" label="任务名称" >
        </el-table-column>
        <el-table-column sortable prop="assessTableName" label="所选模型">
        </el-table-column>
        <el-table-column sortable prop="cron" label="执行频率">
        </el-table-column>
        <el-table-column sortable prop="exceDatetime" label="下次执行时间">
        </el-table-column
        ><el-table-column sortable prop="exceState_text" label="状态">
          <template slot-scope="scope">
            <span
              :class="scope.row.exceState === 0 ? 'startbg':'stopbg'"
            >
              {{ scope.row.exceState_text }}
            </span>
          </template>
        </el-table-column
        ><el-table-column prop="name" label="操作" min-width="130" fixed="right">
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
              @click="handleStart(scope.row)"
              style="color:#a4da89"
              >启用</el-button
            >
            <el-button
              size="mini"
              type="text"
               style="color:#f0c78a"
              @click="handleStop(scope.row)"
              >停用</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="actionNow(scope.row)"
              >立即执行</el-button
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
      v-show="total > 0"
      :total="total"
      :pageNo.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="getList"
      class="pull-right"
    />
  </div>
</template>
<script>
import {
  taskListPage,
  taskListnEable,
  taskListDeactivate,
  taskListExecute,
  taskListDelete,
} from "@/api/dataCenter/dataGovernance.js";

export default {
  name: "List",
  data() {
    return {
      tableData: [],
      total: 0,
      params: {
        taskName:"",
        ruleTableName:"",
        pageNum: 1,
        pageSize: 15,
      },
      multipleSelection: [],
      // data: [],
    };
  },
  created: function () {
    this.getList();
  },

  methods: {
    handleQuery() {
      this.params.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(row) {
      let id = row.id
      this.$confirm("确认要删除该元数据信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taskListDelete({ ids:id }).then((reponse) => {
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
    handleDeleteAll(row) {
      let ids;
      let arr = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.id);
      });
      ids = arr.join(",");
      //console.log(ids)
      this.$confirm("确认要删除选择的几项吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        taskListDelete({ ids }).then((reponse) => {
          if (reponse.code == 200) {
            this.$message({
              message: reponse.msg,
              type: "success",
            });
            this.getList();
          }
        });
      });
    },
    handleStart(row) {
      console.log(row)
      let id = row.id;
      this.$confirm("确认要启用吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taskListnEable({ id }).then((reponse) => {
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
    handleStop(row) {
      let id = row.id;
      this.$confirm("确认要停用吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taskListDeactivate({ id }).then((reponse) => {
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
    async getList() {
      const reponse = await taskListPage(this.params);
      this.tableData = reponse.data.total ? reponse.data.records : [];
      console.log(this.tableData)
       this.tableData.map(item => {
        // item.exceState === 0 ? (item.exceState_text = '停止') : item.exceState === 1 ? (item.exceState_text = '启动') : (item.exceState_text = '停止')
        item.exceState === 0 ? (item.exceState_text = '停止') :  (item.exceState_text = '启动')
     })
      this.total = reponse.data.total;
      this.loading = false;
    },
    actionNow(row){
      let id = row.id
      this.$confirm("确认要立即执行吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taskListExecute({ id }).then((reponse) => {
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
    handleNew: function () {
      this.$emit("changeCom", "new", "新增");
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "编辑", row.id);
    }
  },
};
</script>

<style lang="scss" scoped>
a {
  color: rgb(64, 158, 255);
}
.top{ 
    display: flex; 
    justify-content: space-between;
    .container-state{ 
        padding-top: 23px;
        }
    }
.startbg{ color: #f0c78a; font-weight: bold; background: url('~@/assets/images/dataCenter/stopbg.png') no-repeat left center; background-size: 20px 20px; padding-left: 23px;}
.stopbg{ color: #a4da89; font-weight: bold; background: url('~@/assets/images/dataCenter/startbg.png') no-repeat left center; background-size: 20px 20px; padding-left: 23px;}
</style>
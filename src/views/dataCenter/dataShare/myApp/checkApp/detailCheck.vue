<template>
  <div class="new">
    <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :stripe="true"
        border
        default-expand-all
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="userName" label="用户名称" >
        </el-table-column>
        <el-table-column prop="serviceName" label="服务名称" >
        </el-table-column>
        <el-table-column prop="count" label="访问次数" >
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="clear(scope.row)"
              >清零</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="24">
         <el-col :span="22" class="branch-name">
        <div class="btn" v-show="isBtnShow">
          <el-button type="primary" @click="goBack" plain>返回</el-button>
        </div>
         </el-col>
      </el-row>
  </div>
</template>

<script>
 import {
  clearCount,
  viewCountNumber,
 } from "@/api/dataCenter/dataShare.js";
export default {
  name: "DetailCheck",
  data() {
    return {
      isRequesting: false,
      curValue: "",
      tableData: [],
      isBtnShow:true,
      loading:true
    };
  },
  props: {
    id: String,
  },
  created() {
      this.getData();
  },

  methods: {
    btnShow(){
      this.isBtnShow = false
    },
    clear(row){
      console.log(row.id)
      this.$confirm("是否要清零？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          clearCount({ id:row.id }).then((reponse) => {
            console.log(reponse)
            if (reponse.code == 200) {
              this.$message.success("已清零");
            }
          });
        })
        .catch((err) => err);
    },
    getData() {
      this.loading = true
      viewCountNumber({
        id: this.id,
      }).then((res) => {
        console.log(res)
        this.tableData =  res.data
        this.loading = false
      });
    },
    submitForm: function () {
      if (this.type == "edit") {
        this.form.id = this.id;
      }
      if (this.isRequesting) {
        return;
      }
      // this.$refs.serviceManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      saveAddInfo(this.form)
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
          this.$emit("hidden")
        });
      loading.close();
      // } else {
      //   return false;
      // }
      // });
    },
    goBack(){
        this.$emit("goBack")
    },
    handleSearch: function (value) {
      this.curValue = value;
      this.isSearchBoxShow = true;
    },
    getCheckedData: function (data) {
      this.form[this.curValue] = data.id;
      this.isSearchBoxShow = false;
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
.ps{line-height: 20px; font-size: 12px; color: #999;}
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

::v-deep .el-row {
  margin-bottom: 16px;
}
</style>
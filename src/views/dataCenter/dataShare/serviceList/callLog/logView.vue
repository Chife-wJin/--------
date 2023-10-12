<template>
  <div class="log-view">
    <el-form
      :model="form"
      label-width="150px"
    >
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="调用的服务接口URL" prop="apiServiceurl">
            <el-input v-model="form.apiServiceurl" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="服务价格" prop="apiServiceprice">
            <el-input v-model="form.apiServiceprice" size="small">></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="调用人" prop="apiUsername">
            <el-input v-model="form.apiUsername" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="应用id" prop="appId">
            <el-input v-model="form.appId" size="small">></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="是否调用异常0:未发生1:发生异常" prop="isexception">
            <el-input v-model="form.isexception" size="small">></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="异常信息" prop="exceptions">
            <el-input v-model="form.exceptions" size="small">></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
  </div>
</template>

<script>
 import {
  apiLogView
 } from "@/api/dataCenter/dataShare.js";
export default {
  name: "LogView",
  data() {
    return {
      curValue: "",
      form: {},
    };
  },
  props: {
    id: String,
  },
  created() {
      this.getData();
  },

  methods: {
    getData() {
      apiLogView({
        id: this.id,
      }).then((res) => {
        console.log(res)
         this.form =  res.data
        for (let item in this.form) {
          this.$set(this.form, item, res.data[item]);
        }
      });
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
.log-view {
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

::v-deep .el-row {
  margin-bottom: 16px;
}
</style>
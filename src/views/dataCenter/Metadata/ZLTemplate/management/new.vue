<template>
  <div class="new">
    <el-form
      ref="userManageform"
      :model="form"
    >
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="中文名称：" prop="companyId" label-width="120px">
            <el-input v-model="form.cname" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="定义：" prop="companyId" label-width="120px">
            <el-input
              v-model="form.definitions"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="英文名称：" prop="companyId" label-width="120px">
            <el-input v-model="form.ename" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="约束条件：" prop="companyId" label-width="120px">
            <el-select
              v-model="form.constraints"
              size="small"
              style="width: 180px"
            >
              <el-option
                v-for="item in monitorTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="短名：" prop="companyId" label-width="120px">
            <el-input v-model="form.sname" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="频次：" prop="companyId" label-width="120px">
            <el-input v-model="form.frequency" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="数据类型：" prop="companyId" label-width="120px">
            <el-select
              v-model="form.dataType"
              size="small"
              style="width: 180px"
            >
              <el-option
                v-for="item in dataTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="值域：" prop="companyId" label-width="120px">
            <el-input v-model="form.dataDomain" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="备注：" prop="companyId" label-width="120px">
            <el-input
              v-model="form.dataRemarks"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="显示表单类型：" prop="companyId" label-width="120px">
            <el-select
              v-model="form.showType"
              size="small"
              style="width: 180px"
            >
              <el-option
                v-for="item in showTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="字典类型：" prop="companyId" label-width="120px">
            <el-input v-model="form.dictType" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form-item label="描述：" prop="email" label-width="120px">
            <el-input
              v-model="form.remarks"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm"  v-if="type != 'view'"
            >保存</el-button
          >
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  getElementInfoById,
  saveElement,
  getDatalist,
  
} from "@/api/dataCenter/metaData.js";
import { _dateFormat } from "@/utils/dateFormat.js";
export default {
  data() {
    return {
      isRequesting: false,
      curValue: "",
      form: {
        definitions: "",
        cname: "",
        ename: "",
        remarks: "",
        constraints: "",
        sname: "",
        frequency: "",
        dataType: "",
        dataDomain: "",
        dataRemarks: "",
        showType: "",
        dictType: "",
      },
      monitorTypeList: [
        {
          value: "M",
          label: "必选",
        },
        {
          value: "O",
          label: "可选",
        },
        {
          value: "C",
          label: "条件必选",
        },
      ],
      dataTypeList: [],
      showTypeList: [],
    };
  },
  props: {
    id: String,
    type: String,
  },
  created() {
    this.getDataTypeList("dataType");
    this.getDataTypeList("showType");
    if (this.type == "edit" || this.type == "view") {
      this.getData();
    }
  },

  methods: {
    goBack(){
      this.$emit("goBack")
    },
    getDataTypeList: function (type) {
      getDatalist({
        type,
      }).then((res) => {
        let str = `${type}List`;
        this[str] = res.data;
      });
    },
    getData: function () {
      getElementInfoById({
        id: this.id,
      }).then((res) => {
        // this.form =  res.data
        for (let item in this.form) {
          this.$set(this.form, item, res.data[item]);
        }
      });
    },
    submitForm: function () {
      if (this.type == "edit") {
        this.form.id = this.id;
      }
      if (this.isRequesting) {
        return;
      }
      // this.$refs.userManageform.validate(async (valid) => {
      //   if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      saveElement(this.form)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$emit("save");
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
        });
      loading.close();
      // } else {
      //   return false;
      // }
      // });
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
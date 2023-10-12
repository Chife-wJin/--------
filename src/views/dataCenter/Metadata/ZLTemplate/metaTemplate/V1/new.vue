<template>
  <div class="new">
    <el-form
      ref="userManageform"
      :model="form"
    >
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="元数据模板：" prop="companyId" label-width="120px">
            <SearchBar
              @handleSearch="handleSearch('tMetaTemplate')"
              :searchValue="form.tMetaTemplate"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="上级父id：" prop="companyId" label-width="120px">
            <SearchBar
              @handleSearch="handleSearch('parent')"
              :searchValue="form.parent"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="名称：" prop="companyId" label-width="120px">
            <el-input v-model="form.name" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="22" class="branch-name">
          <el-form-item label="排序：" prop="companyId" label-width="120px">
            <el-input v-model="form.sort" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="22">
          <el-form-item label="元数据元素：" prop="name" label-width="120px">
            <SearchBar
              @handleSearch="handleSearch('tMetaElement')"
              :searchValue="form.tMetaElement"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="22">
          <el-form-item label="是否查询展示：" prop="loginName" label-width="120px">
            <el-radio-group v-model="form.isShow">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
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
        <el-form-item class="btn" >
          <el-button type="primary" @click="submitForm"  v-if="type != 'view'">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <SearchBox
      v-if="isSearchBoxShow"
      :title="pickTitle"
      :data="pickList"
      @getCheckedData="getCheckedData"
      @close="close"
    />
  </div>
</template>

<script>
import {
  saveTemplateDetail,
  getTemplatePickList,
  getTemplateDetailTree,
  getElementPickList,
  getTemplateDetaiInfoById,
} from "@/api/dataCenter/metaData.js";
import SearchBar from "../../../components/searchBar.vue";
import SearchBox from "../../../components/searchBox.vue";
import { _dateFormat } from "@/utils/dateFormat.js";
export default {
  data() {
    return {
      isRequesting: false,
      isSearchBoxShow: false,
      curValue: "",
      form: {
        sort: "",
        name: "",
        isShow: "",
        remarks: "",
        tMetaTemplate: "",
        parent: "",
        tMetaElement: "",
      },
      pickList: [],
      pickTitle: "",
    };
  },
  props: {
    id: String,
    type: String,
    tMetaTemplateId: String
  },
  created() {
    if (this.type == "edit" || this.type == "view") {
      this.getData();
    }
    if(this.type == "next"){
      this.getData1();
    }
  },
  components: {
    SearchBar,
    SearchBox,
  },
  methods: {
    goBack: function () {
      this.$emit("goBack")
    },

    getData: function () {
      getTemplateDetaiInfoById({
        id: this.id,
      }).then((res) => {
        this.form.sort = res.data.sort;
        this.form.name = res.data.name;
        this.form.remarks = res.data.remarks;
        this.form.isShow = res.data.isShow.toString();
        this.form.tMetaTemplate = res.data.tmetaTemplate.name;
        this.form.parent = res.data.parentId;
        this.form.tMetaElement = res.data.tmetaElement.cname;
      });
    },
    getData1: function () {
      getTemplateDetaiInfoById({
        id: this.id,
      }).then((res) => {
        this.form.parent = res.data.parentId;
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
      saveTemplateDetail(this.form)
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
      if (value == "tMetaTemplate") {
        this.pickTitle = "选择元数据模版";
        getTemplatePickList().then((res) => {
          console.log(res)
          this.pickList = res.data;
        });
      } else if (value == "parent") {
        this.pickTitle = "选择父id";
        getTemplateDetailTree({tMetaTemplateId:this.tMetaTemplateId}).then((res) => {
          console.log(res)
          this.pickList = res.data;
        });
      } else if (value == "tMetaElement") {
        this.pickTitle = "选择元数据元素";
        getElementPickList().then((res) => {
          console.log(res)
          this.pickList = res.data;
        });
      }
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
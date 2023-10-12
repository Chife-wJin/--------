<template>
  <div class="new">
    <el-form ref="userManageform" :model="form" label-width="130px">
      <el-form-item
        label="参照历史记录："
        prop="companyId"
        v-show="canzhaoForm"
      >
        <el-select
          v-model="form.monitorType"
          size="small"
          value-key="name"
          @change="changeRecord"
        >
          <el-option
            v-for="(item, i) in monitorTypeList"
            :key="i"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="content">
        <div
          v-for="(item, index) in form.formList"
          :key="index"
          :class="[
            item.parentId == '0' ||
            item.tmetaElement.showType == 'textarea' ||
            item.tmetaElement.showType == 'multiinput'
              ? 'line'
              : 'half-line',
          ]"
        >
          <div class="dialog-caption" v-if="item.parentId == '0'">
            <h1 class="dialog-caption-text">{{ item.name }}</h1>
          </div>
          <div v-else>
            <!-- 不校验 -->
            <el-form-item
              v-if="
                (item.tmetaElement.showType == 'input' ||
                  item.tmetaElement.showType == 'largeinput') &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <el-input
                v-model="item.tmetaElement.value"
                size="small"
                :placeholder="'请输入' + item.name"
              ></el-input>
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                (item.tmetaElement.showType == 'input' ||
                  item.tmetaElement.showType == 'largeinput') &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{
                required: true,
                message: '请输入' + item.name,
                trigger: 'blur',
              }"
            >
              <el-input
                v-model="item.tmetaElement.value"
                size="small"
                :placeholder="'请输入' + item.name"
              ></el-input>
            </el-form-item>

            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'select' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <el-select
                v-model="item.tmetaElement.value"
                size="small"
                :placeholder="'请输入' + item.name"
              >
                <el-option
                  v-for="(item2, i) in mapSelectList[
                    item.tmetaElement.dictType
                  ]"
                  :key="i"
                  :label="item2.label"
                  :value="item2.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'select' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{
                required: true,
                message: '请选择' + item.name,
                trigger: 'change',
              }"
            >
              <el-select
                v-model="item.tmetaElement.value"
                size="small"
                :placeholder="'请输入' + item.name"
              >
                <el-option
                  v-for="(item2, i) in mapSelectList[
                    item.tmetaElement.dictType
                  ]"
                  :key="i"
                  :label="item2.label"
                  :value="item2.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'multiselect' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <el-select
                v-model="multiValues[item.tmetaElement.dictType]"
                multiple
                size="small"
                :placeholder="'请选择' + item.name + ' ' + '(可多选)'"
                @change="multiselectChange(item)"
              >
                <el-option
                  v-for="(item2, i) in mapSelectList[
                    item.tmetaElement.dictType
                  ]"
                  :key="i"
                  :label="item2.label"
                  :value="item2.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'multiselect' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{
                required: true,
                message: '请选择' + item.name,
                trigger: '',
              }"
            >
              <el-select
                v-model="multiValues[item.tmetaElement.dictType]"
                multiple
                size="small"
                :placeholder="'请选择' + item.name + ' ' + '(可多选)'"
                @change="multiselectChange(item)"
              >
                <el-option
                  v-for="(item2, i) in mapSelectList[
                    item.tmetaElement.dictType
                  ]"
                  :key="i"
                  :label="item2.label"
                  :value="item2.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'textarea' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <el-input
                v-model="item.tmetaElement.value"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'textarea' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{
                required: true,
                message: '请输入' + item.name,
                trigger: 'blur',
              }"
            >
              <el-input
                v-model="item.tmetaElement.value"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'dateselect' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <el-date-picker
                v-model="item.tmetaElement.value"
                size="small"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'dateselect' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{
                required: true,
                message: '请选择' + item.name,
                trigger: 'change',
              }"
            >
              <el-date-picker
                v-model="item.tmetaElement.value"
                size="small"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>

            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'contactpartyselect' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <SearchBar
                @handleSearch="
                  handleSearch('value', 'jg', index, 'contactpartyselect')
                "
                :searchValue="item.tmetaElement.showLable"
                :index="index"
              />
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'contactpartyselect' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{ required: true, message: '请选择' + item.name }"
            >
              <SearchBar
                @handleSearch="
                  handleSearch('value', 'jg', index, 'contactpartyselect')
                "
                :searchValue="item.tmetaElement.showLable"
                :index="index"
              />
            </el-form-item>

            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'officeselect' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <SearchBar
                @handleSearch="handleSearch('value', 'jg', index)"
                :searchValue="item.tmetaElement.showLable"
                :index="index"
              />
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'officeselect' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{ required: true, message: '请选择' + item.name }"
            >
              <SearchBar
                @handleSearch="handleSearch('value', 'jg', index)"
                :searchValue="item.tmetaElement.showLable"
                :index="index"
              />
            </el-form-item>

            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'resourceselect' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <SearchBar
                @handleSearch="
                  handleSearch('value', 'jg', index, 'resourceselect')
                "
                :searchValue="item.tmetaElement.showLable"
                :index="index"
              />
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'resourceselect' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{ required: true, message: '请选择' + item.name }"
            >
              <SearchBar
                @handleSearch="
                  handleSearch('value', 'jg', index, 'resourceselect')
                "
                :searchValue="item.tmetaElement.showLable"
                :index="index"
              />
            </el-form-item>

            <!-- 不校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'uploadAssembly' &&
                item.tmetaElement.constraints !== 'M'
              "
              :label="item.name + ':'"
            >
              <el-upload
                ref="fileImport"
                class="upload-demo"
                action=""
                :limit="1"
                :auto-upload="false"
                list-type="picture"
                :file-list="fileList"
                :on-remove="removeLicenseOrg"
                :on-change="
                  (event, fileList) => {
                    handleChange(event, fileList, item);
                  }
                "
              >
                <el-button plain icon="el-icon-upload2" size="small"
                  >上传</el-button
                >
              </el-upload>
            </el-form-item>
            <!-- 校验 -->
            <el-form-item
              v-if="
                item.tmetaElement.showType == 'uploadAssembly' &&
                item.tmetaElement.constraints == 'M'
              "
              :label="item.name + ':'"
              :prop="'formList[' + index + '].tmetaElement.value'"
              :rules="{
                required: true,
                message: '请上传' + item.name,
                trigger: 'blur',
              }"
            >
              <el-upload
                ref="fileImport"
                class="upload-demo"
                action=""
                :limit="1"
                :auto-upload="false"
                list-type="picture"
                :file-list="fileList"
                :on-remove="removeLicenseOrg"
                :on-change="
                  (event, fileList) => {
                    handleChange(event, fileList, item);
                  }
                "
              >
                <el-button plain icon="el-icon-upload2" size="small"
                  >上传</el-button
                >
              </el-upload>
            </el-form-item>
          </div>
        </div>
      </div>

      <el-row v-if="this.type !== 'view'">
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm('zancun')"
            >暂存</el-button
          >
          <el-button type="success" @click="submitForm('submit')"
            >提交</el-button
          >
          <el-button type="warning" @click="submitForm">另存为模版</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <SearchBox
      v-if="isSearchBoxShow"
      title="请选择"
      :data="tableData"
      :showType="tableShowType"
      @getCheckedData="getCheckedData"
      @close="close"
    />
  </div>
</template>

<script>
import {
  getRecordForm,
  getDatalist,
  getRecordFormData,
  getResourceDirectoryList,
  RecordSave,
  getRecordFormDatabyId,
  uploadFile,
  searchTableData,
} from "@/api/dataCenter/metaData.js";

import SearchBar from "../../components/searchBar.vue";
import SearchBox from "../../components/searchBox.vue";
import { _dateFormat } from "@/utils/dateFormat.js";
export default {
  data() {
    return {
      tableShowType: "",
      fileList: [],
      multiValues:{},
      treeVaules:{},
      isRequesting: false,
      curValue: "",
      isSearchBoxShow: false,
      dataTemplateFlag: "",
      zymlId: "",
      searchType: "",
      monitorTypeList: [],
      zymlxlList: [],
      query: {},
      itemid: undefined,
      canzhaoForm: true,
      form: {
        pic: "",
        monitorType: "",
        formList: [],
      },

      rules: {},
      mapSelectList: {},
      index: 0,
      tableData: [],
      treeData:[]
    };
  },
  props: {
    id: String,
    type: String,
  },
  components: {
    SearchBar,
    SearchBox,
  },
  created() {
    if (this.type == "edit" || this.type == "view") {
      this.getData();
      this.canzhaoForm = false;
    } else {
      this.getForm();
      this.canzhaoForm = true;
    }
    this.zymlxl();
  },

  methods: {
    multiselectChange(item){
      console.log(this.multiValues[item.tmetaElement.dictType])
      console.log(item)
      this.form.formList.find(
        (v) => v.name == item.name
      ).tmetaElement.value = this.multiValues[item.tmetaElement.dictType].toString();
    },
    handleChange(event, fileList, item) {
      if (event) {
        let file = event.raw;
        let formData = new FormData();
        formData.append("file", file);
        uploadFile(formData).then((res) => {
          // console.log(res)
          this.form.formList.find(
            (v) => v.name == item.name
          ).tmetaElement.value = res.data.fileId;
          // getLicenseFile({ids:res.data.fileId}).then((res) => {
          //   console.log(res)
          //   //this.form.pic = res.data[0].save_path
          // //  this.form.formList.find(item => item.name == name).value = res.data[0].save_path
          // })
        });
      }
    },
    removeLicenseOrg(file, fileList) {
     // console.log(file, fileList);
    },

    getForm: function () {
      getRecordForm().then((res) => {
        let list = res.data.tMetaRecord.tmetaTemplate.detailList;
       // console.log(list)
        this.form.formList = this.order(list);
        this.monitorTypeList = res.data.dataTemplate;
        this.form.formList.map((item) => {
          if (item.tmetaElement && item.tmetaElement.showType === "select") {
            const type = item.tmetaElement.dictType;
            getDatalist({ type }).then((res) => {
              this.$set(this.mapSelectList, type, res.data);
            });
          }
          if (item.tmetaElement && item.tmetaElement.showType === "multiselect") {
            const type = item.tmetaElement.dictType;
            getDatalist({ type }).then((res) => {
              this.$set(this.mapSelectList, type, res.data);
            });
            this.$set(this.multiValues, type, []);
          }
        });
      });
    },
    //数据排序
    order(list) {
      let listParent = list.filter((v) => v.parentId == 0);
      let arrParent = [];
      for (let i = 0; i < listParent.length; i++) {
        let listParenti = [listParent[i]];
        arrParent.push(listParenti);
      }
      let arrChild = [];
      for (let i = 0; i < listParent.length; i++) {
        let listChildren = list.filter((v) => v.parentId == listParent[i].id);
        arrChild.push(listChildren);
      }
      let newArr = [];
      for (let i = 0; i < listParent.length; i++) {
        arrParent[i].push(...arrChild[i]);
        newArr = arrParent;
      }
      let newArr1 = [];
      newArr1.push(...newArr[0], ...newArr[1], ...newArr[2]);
      console.log(newArr1)
      return newArr1;
    },
    zymlxl() {
      getResourceDirectoryList().then((res) => {
        this.zymlxlList = res.data;
      });
    },

    changeRecord: function (val) {
      // this.resCat = val.resCat
      this.dataTemplateFlag = val.id;
      getRecordFormData({
        metaRecordId: val.id,
      }).then((res) => {
        console.log(res.data.detailList);
        this.form.formList = res.data.detailList;
        //  console.log("formList1", this.form.formList, JSON.stringify(this.formList));
      });
    },

    goBack(){
      this.$emit("closeSelf")
    },

    getData: function () {
      console.log(this.id)
      getRecordFormDatabyId({
        metaRecordId: this.id,
      }).then((res) => {
        //数据排序
        let list = res.data.detailList;
        this.form.formList = this.order(list);
        this.form.formList.map((item) => {
          if (item.tmetaElement && item.tmetaElement.showType === "select") {
            const type = item.tmetaElement.dictType;
            getDatalist({ type }).then((res) => {
              this.$set(this.mapSelectList, type, res.data);
            });
          }
          if (item.tmetaElement && item.tmetaElement.showType === "multiselect") {
            const type = item.tmetaElement.dictType;
            getDatalist({ type }).then((res) => {
              this.$set(this.mapSelectList, type, res.data);
            });
            let string = item.tmetaElement.value
            let showValue = string.split(",");
            this.$set(this.multiValues, type, showValue);
          }
          if (item.tmetaElement && item.tmetaElement.showType === "contactpartyselect") {
             const value = item.tmetaElement.value
            // console.log(item.tmetaElement.value)
              searchTableData("contactpartyselect").then((res) => {
             //   console.log(res)
                 let obj = this.recursion(res.data.data,value)
               //  console.log(obj)
                 item.tmetaElement.showLable = obj.label
                 this.$forceUpdate()
              });
          }
          if (item.tmetaElement && item.tmetaElement.showType === "resourceselect") {
             const value = item.tmetaElement.value
           //  console.log(item.tmetaElement.value)
              searchTableData("resourceselect").then((res) => {
               // console.log(res)
                 let obj = this.recursionss(res.data,value)
               //  console.log(obj)
                 item.tmetaElement.showLable = obj.name
                 this.$forceUpdate()
              });
          }
          if (item.tmetaElement && item.tmetaElement.showType === "uploadAssembly") {
             const fileId = item.tmetaElement.value
            getLicenseFile({ids:fileId}).then((res) => {
              console.log(res)
              let filePath = res.data[0].save_path
              this.fileList.push({url:filePath})
              //this.form.formList.find(item => item.name == name).value = res.data[0].save_path
            })
          }
          
        });

      });
    },
    recursion(data, id) {
      let result;
      if (!data) {
        return;
      }
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.id == id) {
          result = item;
          break;
        } else if (item.children && item.children.length > 0) {
          result = this.recursion(item.children, id);
          if(result) return result // 如果找到，直接返回，结束循环
        }
      }
     // console.log(result);
      return result;
    },
    recursionss(data, id) {
      let result;
      if (!data) {
        return;
      }
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        console.log(item)
        if (item.id == id) {
          result = item;
          break;
        } else if (item.childList && item.childList.length > 0) {
          result = this.recursionss(item.childList, id);
          if(result) return result // 如果找到，直接返回，结束循环
        }
      }
    //  console.log(result);
      return result;
    },
    submitForm(type) {
      if (type == "zancun") {
        this.query.state = "02";
      } else if (type == "submit") {
        this.query.state = "01";
      }
      let arr = this.form.formList.map((item) => item.tmetaElement);
      let arr2 = arr.filter((item) => item !== null);
      let map = {};
      arr2.map((itm) => {
        map[itm.sname] = itm.value;
      });
      this.query.map = map;
      this.query.dataTemplateFlag = this.dataTemplateFlag;
      // if (this.dataTemplateFlag) {
      //   this.query.resCat = this.form.monitorType.resCat;
      // } else {
      //   this.query.resCat = "";
      // }
     

      if (this.type == "edit") {
        this.query.id = this.id;
      }

       console.log(this.query);


      if (this.isRequesting) {
        return;
      }
      this.$refs.userManageform.validate(async (valid) => {
        if (valid) {
          this.isRequesting = true;
          const loading = this.$loading({
            lock: true,
            text: "正在保存提交，请稍等...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.1)",
          });
          RecordSave(this.query)
            .then((reponse) => {
              if (reponse.code == 200) {
                if (type == "zancun") {
                  this.$message.success("暂存成功");
                } else if (type == "submit") {
                  this.$message.success("保存成功");
                } else {
                  this.$message.success("模板保存成功");
                }
                this.$emit("closeSelf");
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

    handleSearch: function (value, searchType, index, showType) {
      console.log(value)
      console.log(showType)
      this.searchType = searchType;
      this.curValue = value;
      this.index = index;
      this.isSearchBoxShow = true;
      this.tableShowType = showType;
      if (showType == "resourceselect") {
        this.getResourceList();
      } else if (
        showType == "contactpartyselect" ||
        showType == "officeselect"
      ) {
        this.getList();
      }
    },
    async getList() {
      const reponse = await searchTableData(this.tableShowType);
      console.log(reponse);
      this.tableData = reponse.data.data ? reponse.data.data : [];
    },
    async getResourceList() {
      const reponse = await searchTableData(this.tableShowType);
      console.log(reponse);
      this.tableData = reponse.data ? reponse.data : [];
    },
    getCheckedData: function (data) {
      if(this.tableShowType == "contactpartyselect"){
        this.form.formList[this.index].tmetaElement.showLable = data.label;
      }else{
        this.form.formList[this.index].tmetaElement.showLable = data.name;
      }
      this.form.formList[this.index].tmetaElement[this.curValue] = data.id;
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
  ::v-deep .el-form-item {
    width: 100%;
  }
  ::v-deep .el-select {
    width: 100%;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    .half-line {
      width: 50%;
    }
    .line {
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
  }
}
div.dialog-caption {
  width: 100%;
  color: blue;
}
</style>
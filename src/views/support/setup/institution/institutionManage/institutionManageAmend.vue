<template>
  <div class="amend-content">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="上级单位：">
            <treeselect
              v-model="form.parentId"
              :options="officeListData"
              :disableBranchNodes="false"
              :normalizer="normalizer"
              noChildrenText="无"
              placeholder="请选择上级单位"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="归属区域：">
            <treeselect
              v-model="form.areaId"
              :options="areaListOptions"
              :load-options="loadAreaOptions"
              :disable-branch-nodes="true"
              noChildrenText="无"
              :autoLoadRootOptions="false"
              :searchable="false"
              :disableBranchNodes="false"
              placeholder="请选择归属区域"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="机构名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="机构编码：" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="机构类型：" prop="type">
            <el-select v-model="form.type">
              <el-option
                v-for="item in officeTypeData"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="机构级别：" prop="grade">
            <el-select v-model="form.grade">
              <el-option
                v-for="item in officeGradeData"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="是否可用：">
            <el-select v-model="form.useable">
              <el-option
                v-for="item in dictLoginYesNoData"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="help-inline" style="color: #aaa;">“是”代表此账号允许登陆，“否”则表示此账号不允许登陆</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="联系地址：">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="邮政编码：">
            <el-input v-model="form.zipCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="负责人：">
            <el-input v-model="form.master"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="电话：">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="传真：">
            <el-input v-model="form.fax"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="邮箱：">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="tab-list-state">
          <el-button type="primary" @click="onSubmit('form')"        v-formScroll
        >保存</el-button>
          <el-button @click="handleBackClick">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { dictListType } from "@/api/styem/dict/type.js";
import {
  officeTreeData,
  officeSave,
  areaTreeNew,
  areaTreeData,
  officeGetOfficeById
} from "@/api/styem/dept";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { userTreeData } from "@/api/styem/user";
import Bus from "@/utils/vueBus";
export default {
  props: {
    officeListData: {
      type: Array,
      default: () => []
    },
    officeTypeData: Array
  },
  data() {
    return {
      form: {
        id: undefined,
        parentId: undefined,
        areaId: undefined,
        name: undefined,
        code: undefined,
        type: undefined,
        grade: undefined,
        useable: "1",
        primaryPerson: undefined,
        deputyPerson: undefined,
        address: undefined,
        zipCode: undefined,
        master: undefined,
        phone: undefined,
        fax: undefined,
        email: undefined,
        remarks: undefined
      },
      normalizer(node) {
        return {
          label: node.name
        };
      },
      officeGradeData: undefined,
      dictLoginYesNoData: undefined,
      pubDeptOptions: undefined,
      userOptions: undefined,
      areaListOptions: [],
      rules: {
        name: [{ required: true, message: "输入机构名称", trigger: "blur" }],
        code: [{ required: true, message: "输入机构编码", trigger: "blur" }],
        type: [{ required: true, message: "选择机构类型", trigger: "change" }],
        grade: [{ required: true, message: "选择机构级别", trigger: "change" }]
      }
    };
  },
  created() {
    console.log(this.officeListData);
    Bus.$off("outInstitComeId");
    this.getInstitutionDict();
    this.getOfficeTreeData();
    this.getAreaList();
  },
  mounted() {
    Bus.$on("outInstitComeId", obj => {
      // this.handleformClear("form");
      console.log(obj);
      console.log(obj.state);
      if (obj.id == "" || obj.id == undefined) {
        this.form.id = undefined;
        this.form.areaId = 150000;
        this.form.parentId = null;
      } else if (obj.state == "amend") {
        this.form.id = obj.id;
        this.$nextTick(()=>{
          this.getOfficeGetOffice(obj.id);
        })
        
        console.log(11111111111112222);
      } else if (obj.state == "addNext") {
        console.log(22222222);
        this.form.parentId = obj.id;
        console.log(this.form.parentId);
      }
    });
  },
  methods: {
    async getAreaList() {
      const reponse = await areaTreeNew();
      const areaListOptions = [];
      for (const item in reponse.data) {
        const subject = reponse.data[item];
        const temp = {
          id: subject.id,
          label: subject.label,
          children: null
        };
        areaListOptions.push(temp);
      }
      this.areaListOptions = areaListOptions;
    },
    loadAreaOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        areaTreeNew({ parentId: parentNode.id }).then(reponse => {
          const userOptions = [];
          for (const item in reponse.data) {
            const subject = reponse.data[item];
            const temp = {
              id: subject.id,
              label: subject.label,
              children: null
            };
            userOptions.push(temp);
          }
          parentNode.children = userOptions;
          callback();
        });
      }
    },
    async getInstitutionDict() {
      // const officeTypeReponse = await dictListType({ type: "sys_office_type" });
      // this.officeTypeData = officeTypeReponse.data;
      const officeGradeReponse = await dictListType({
        type: "sys_office_grade"
      });
      this.officeGradeData = officeGradeReponse.data;
      const dictLoginYesNoReponse = await dictListType({ type: "yes_no" });
      this.dictLoginYesNoData = dictLoginYesNoReponse.data;
    },
    async getOfficeTreeData() {
      const reponse = await officeTreeData({ type: 3 });
      const userOptions = [];
      for (const item in reponse.data) {
        const subject = reponse.data[item];
        const temp = {
          id: subject.id,
          label: subject.name,
          children: null
        };
        userOptions.push(temp);
      }
      this.userOptions = userOptions;
      const menu = this.handleTree(reponse.data, "id", "pId", "children", "0");
      this.pubDeptOptions = menu;
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        userTreeData({ officeId: parentNode.id }).then(reponse => {
          const userOptions = [];
          for (const item in reponse.data) {
            const subject = reponse.data[item];
            const temp = {
              id: subject.id,
              label: subject.name
            };
            userOptions.push(temp);
          }
          parentNode.children = userOptions;
          callback();
        });
      }
    },
    async getOfficeGetOffice(id) {
      const reponse = await officeGetOfficeById({ id });
      this.form = reponse.data;
      if (reponse.data.parentId == "0") {
        this.form.parentId = null;
      }
    },
    onSubmit(formName) {
      if (this.form.parentId === null) {
        this.form.parentId = 0;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          officeSave(this.form).then(reponse => {
            if (reponse.code == 200) {
              this.$emit("backHandle", "update");
            }
          });
        } else {
          return false;
        }
      });
    },
    handleBackClick() {
      this.$emit("backHandle", "back");
    },
    handleformClear(formName) {
      this.$nextTick(() => {
        this.resetFieldsTap(formName);
      });
    },
    handleClearData() {
      this.form.id = undefined;
      this.form.parentId = undefined;
      this.form.areaId = undefined;
      this.form.name = undefined;
      this.form.code = undefined;
      this.form.type = undefined;
      this.form.grade = undefined;
      this.form.useable = "1";
      this.form.primaryPerson = undefined;
      this.form.deputyPerson = undefined;
      this.form.address = undefined;
      this.form.zipCode = undefined;
      this.form.master = undefined;
      this.form.phone = undefined;
      this.form.fax = undefined;
      this.form.email = undefined;
      this.form.remarks = undefined;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__content {
  line-height: 34px;
}
</style>
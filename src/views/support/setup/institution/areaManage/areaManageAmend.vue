<template>
  <div class="amend-content">
    <el-form ref="form" :rules="dialogRules" :model="form" label-width="140px">
      <el-row>
        <el-col>
          <el-form-item label="上级区域：">
            <treeselect
              v-model="form.parentId"
              :options="areaListOptions"
              :load-options="loadOptions"
              :disable-branch-nodes="true"
              noChildrenText="无"
              :autoLoadRootOptions="false"
              :searchable="false"
              :disableBranchNodes="false"
              placeholder="请选择上级区域"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="区域名称：" prop="name">
            <el-input
              maxlength="10"
              show-word-limit
              v-model="form.name"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="区域编码：" prop="code">
            <el-input
              maxlength="6"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              show-word-limit
              v-model.number="form.code"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="排序：" prop="sort">
            <el-input
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
              v-model="form.sort"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="区域类型：" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择区域类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in areaTypeData"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              maxlength="240"
              show-word-limit
              rows="4"
              v-model="form.remarks"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="onSubmit" v-formScroll
            >保存</el-button
          >
          <el-button @click="handleBackClick">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { dictListType } from "@/api/styem/dict/type.js";
import { areaTreeNew, areaSave, areaGetOfficeById } from "@/api/styem/dept";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { userTreeData } from "@/api/styem/user";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      form: {
        id: undefined,
        parentId: undefined,
        name: undefined,
        code: undefined,
        type: undefined,
        remarks: undefined,
        sort: undefined,
      },
      normalizer(node) {
        return {
          label: node.label,
        };
      },
      areaTypeData: undefined,
      areaListOptions: undefined,
      dialogRules: {
        // parentId: [{ required: true, message: "请选择上级区域" }],
        name: [{ required: true, message: "请输入区域名称" }],
        code: [{ required: true, message: "请输入区域编码" }],
        type: [{ required: true, message: "请选择区域类型" }],
        sort: [{ required: true, message: "请输入排序" }],
      },
    };
  },
  created() {
    Bus.$off("outAreaComeId");
    this.getInstitutionDict();
    this.getAreaList();
  },
  mounted() {
    Bus.$on("outAreaComeId", (obj) => {
      this.form.remarks = undefined;
      this.handleformClear("form");
      if (obj == "" || obj == undefined) {
        this.form.id = undefined;
        this.form.parentId = 150000;
      } else if (obj.state == "amend") {
        this.form.id = obj.id;
        this.getOfficeGetOffice(obj.id);
      } else if (obj.state == "addNext") {
        this.form.parentId = obj.id;
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
          children: null,
        };
        areaListOptions.push(temp);
      }
      this.areaListOptions = areaListOptions;
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        areaTreeNew({ parentId: parentNode.id }).then((reponse) => {
          const userOptions = [];
          for (const item in reponse.data) {
            const subject = reponse.data[item];
            const temp = {
              id: subject.id,
              label: subject.label,
              children: null,
            };
            userOptions.push(temp);
          }
          parentNode.children = userOptions;
          callback();
        });
      }
    },
    async getInstitutionDict() {
      const areaTypeReponse = await dictListType({ type: "sys_area_type" });
      this.areaTypeData = areaTypeReponse.data;
    },
    async getOfficeGetOffice(id) {
      const reponse = await areaGetOfficeById({ id });
      this.form = reponse.data;
      if (reponse.data.parentId == "0") {
        this.form.parentId = null;
      }
    },
    onSubmit() {
      areaSave(this.form).then((reponse) => {
        if (reponse.code == 200) {
          this.$emit("backHandle", "update");
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
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__content {
  line-height: 34px;
}
</style>

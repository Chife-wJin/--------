<template>
  <div class="amend-content">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col>
          <el-form-item label="上级键值：" prop="parentId">
            <treeselect
              v-model="form.parentId"
              :options="dictListData"
              :disable-branch-nodes="true"
              :disableBranchNodes="false"
              :normalizer="normalizer"
              noChildrenText="无"
              placeholder="请选择上级键值"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="键值：" prop="value">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="标签：" prop="label">
            <el-input v-model="form.label"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="类型：" prop="type">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="描述：" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="排序：" prop="sort">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注：">
            <el-input v-model="form.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="onSubmit('form')" v-formScroll
            >保存</el-button
          >
          <el-button @click="handleBackClick">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { dictList, dictDetail, dictSave } from "@/api/styem/log";
import Bus from "@/utils/vueBus";
export default {
  data() {
    return {
      dictListData: [],
      form: {
        id: undefined,
        parentId: undefined,
        value: undefined,
        label: undefined,
        type: undefined,
        description: undefined,
        sort: undefined,
        remarks: undefined,
      },
      normalizer(node) {
        return {
          label: node.label,
        };
      },
      rules: {
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        parentId: [
          { required: true, message: "请输入上级键值", trigger: "blur" },
        ],
        value: [{ required: true, message: "请输入键值", trigger: "blur" }],
        label: [{ required: true, message: "请输入标签", trigger: "blur" }],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    Bus.$off("outComeId");
    this.getDictList();
  },
  mounted() {
    Bus.$on("outComeId", (obj) => {
      this.resetFieldsTap("form");
      this.form.remarks = undefined;
      if (obj == "" || obj == undefined) {
        this.form.id = undefined;
        this.form.parentId = null;
      } else if (obj.state == "amend") {
        this.form.id = obj.id;
        this.getSpaceSee(obj.id);
      } else if (obj.state == "addKey") {
        this.form.id = undefined;
        this.getSpaceKey(obj.id, "addKey");
      } else if (obj.state == "addNext") {
        this.form.id = undefined;
        this.form.parentId = obj.id;
        this.getSpaceKey(obj.id, "addNext");
      }
    });
  },
  methods: {
    async getDictList() {
      const reponse = await dictList();
      const menu = this.handleTree(
        reponse.data,
        "id",
        "parentId",
        "children",
        "0"
      );
      this.dictListData = menu;
    },
    async getSpaceSee(id) {
      const reponse = await dictDetail({ id });
      const subject = reponse.data;
      this.form.id = subject.id;
      this.form.parentId = subject.parentId;
      this.form.value = subject.value;
      this.form.label = subject.label;
      this.form.type = subject.type;
      this.form.description = subject.description;
      this.form.sort = Number(subject.sort);
      this.form.remarks = subject.remarks;
      if (reponse.data.parentId == "0") {
        this.form.parentId = null;
      }
    },
    async getSpaceKey(id, state) {
      const reponse = await dictDetail({ id });
      const subject = reponse.data;
      this.form.parentId = subject.parentId;
      this.form.type = subject.type;
      this.form.description = subject.description;
      this.form.sort = Number(subject.sort) + 1;
      this.form.remarks = subject.remarks;
      if (reponse.data.parentId == "0") {
        this.form.parentId = null;
      }
      if (state === "addNext") {
        this.form.sort = undefined;
        this.form.parentId = id;
      }
    },
    onSubmit(forName) {
      if (!this.form.parentId) {
        this.form.parentId = 0;
      }
      this.$refs[forName].validate((valid) => {
        if (valid) {
          dictSave(this.form).then((reponse) => {
            if (reponse.code == 200) {
              this.resetFieldsTap("form");
              this.$emit("backHandle", "update");
              this.getDictList();
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
  },
};
</script>

<style lang="scss" scoped></style>

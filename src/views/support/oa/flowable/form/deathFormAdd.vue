<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="rules"
      :disabled="disabled"
      label-width="98px"
      class="dialog-form"
    >
      <el-form-item label="表单名称：" prop="formName">
        <el-input v-model="queryParams.formName" />
      </el-form-item>
      <el-form-item label="表单url：" prop="formUrl">
        <el-input v-model="queryParams.formUrl" />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="queryParams.remark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="handleDefine">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { addForm, updateForm } from "@/api/oa/flowable/form";
export default {
  props: {
    rowInfo: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rules: {
        formName: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
        ],
        formUrl: [
          { required: true, message: "请输入表单url", trigger: "blur" },
        ],
      },
      queryParams: {
        formType: 1,
        formName: undefined,
        formUrl: undefined,
        remark: undefined,
      },
      disabled: false,
    };
  },
  methods: {
    formInit() {
      this.resetFieldsTap("queryForm");
      this.$nextTick(() => {
        const { pageType, row } = this.rowInfo;
        if (pageType == "修改") {
          this.queryParams = Object.assign({}, row);
          this.disabled = false;
        } else if (pageType == "查看") {
          this.queryParams = Object.assign({}, row);
          this.disabled = true;
        } else {
          this.disabled = false;
          this.queryParams = {
            formType: 1,
            formName: undefined,
            formUrl: undefined,
            remark: undefined,
          };
        }
      });
    },
    handleDefine() {
      this.$refs["queryForm"].validate(async (valid) => {
        if (valid) {
          const { pageType } = this.rowInfo;
          let code = undefined;
          if (pageType == "修改") {
            const res = await updateForm(this.queryParams);
            code = res.code;
          } else if (pageType == "新增") {
            const res = await addForm(this.queryParams);
            code = res.code;
          }
          if (code == 200) {
            this.$emit("setDetailModal", false);
          }
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.$emit("setDetailModal", false);
    },
  },
};
</script>

<style>
</style>
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      :rules="rules"
      ref="queryForm"
      :inline="true"
      :disabled="disabled"
      label-width="98px"
    >
      <el-form-item label="姓名" prop="age">
        <el-input v-model="queryParams.age" />
      </el-form-item>
      <el-form-item label="调整原因" prop="edu">
        <el-input v-model="queryParams.edu" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button
        type="primary"
        v-if="btnIsShow.includes('save')"
        @click="handleSave"
        v-formScroll
        >保存</el-button
      >
      <el-button
        type="primary"
        v-if="btnIsShow.includes('submit')"
        @click="handleConfirm"
        v-formScroll
        >保存并发起流程</el-button
      >
      <el-button v-if="btnIsShow.includes('submit')" @click="handleConcel"
        >重置</el-button
      >
      <div v-if="$route.name === 'Todo'" class="btns">
        <el-button
          icon="el-icon-edit-outline"
          type="success"
          @click="handleComplete"
          >审批
        </el-button>
        <!-- <el-button
          icon="el-icon-edit-outline"
          type="primary"
          @click="handleDelegate"
          >委派</el-button
        > -->
        <!-- <el-button
          icon="el-icon-edit-outline"
          type="primary"
          @click="handleAssign"
          >转办</el-button
        > -->
        <!-- <el-button
          icon="el-icon-edit-outline"
          type="primary"
          @click="handleDelegate"
          >签收</el-button
        >
        <el-button
          icon="el-icon-refresh-left"
          type="warning"
          @click="handleReturn"
          >退回</el-button
        >
        <el-button
          icon="el-icon-circle-close"
          type="danger"
          @click="handleReject"
          >驳回</el-button
        > -->
      </div>
    </div>
    <!-- 死表单在代办任务页面的审核驳回等功能封装 -->
    <examine v-if="$route.name === 'Todo'" ref="examine" :taskForm="taskForm" />
  </div>
</template>

<script>
import examine from "@/views/support/oa/task/components/examine";
import { submitFlow, saveFlow,getNodeById } from "@/api/oa/task/specialForms";
import Bus from "@/utils/vueBus";
export default {
  props: {
    // 控制表单按钮是否显示
    btnIsShow: {
      required: true,
      type: Array,
      default: () => [],
    },
    // 流程标识key
    flowKey: {
      type: String,
      default: "",
    },
    // 审核意见弹窗内的form表单字段
    taskForm: {
      // required: true,
      type: Object,
      default: () => {},
    },
    // 是否只是展示表单, 如果需要回显表单数据oa对应的页面会调用 getFormInfo 获取
    showOnly: {
      type: Boolean,
      default: true,
    },
    // 业务表单数据回显, 注意: 在流程里不需要这个字段回显, 流程页面会调用 getFormInfo 方法获取回显数据
    formData: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    examine,
  },
  data() {
    return {
      rules: {
        age: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        edu: [{ required: true, message: "请输入调整原因", trigger: "blur" }],
      },
      disabled: false,
      queryParams: {
        age: undefined,
        edu: undefined,
      },
    };
  },
  created() {
    if (this.showOnly) {
      // 如果只是想展示表单, 如流程定义页面中的配置表单弹窗和查看业务表单时, 有的页面需要设置一些初始值, 那么可以在这里设置
    } else {
      if (this.formData) {
        // 业务列表页点击详情回显业务表单, 流程里回显表单会调用 getFormInfo 方法请求接口回显
        this.queryParams = this.formData;
      }
    }
  },
  methods: {
    // 获取表单回显数据
    async getFormInfo(taskId, deployId, procInsId) {
      // 各个死表单回显在这里请求接口获取
      this.disabled = true;
      // 各个死表单回显在这里请求接口获取
      this.disabled = true;
      const { code, data } = await getNodeById({taskId, deployId, procInsId});
      this.queryParams.age = data.bean.age;
      this.queryParams.edu = data.bean.edu;
    },
    // 保存不发起流程
    handleSave() {
      this.$refs["queryForm"].validate(async (valid) => {
        if (valid) {
          const params = {
            flowTaskVo: {
              flowKey: this.flowKey,
              variables: {},
            },
            ...this.queryParams,
            formType: 1,
          };
          saveFlow(params).then((res) => {
            const { code } = res;
            if (code == 200) {
              this.$message.success(res.msg);
              Bus.$emit("ProcessSuccess");
            }
          });
          return true;
        } else {
          return false;
        }
      });
    },
    // 保存并发起流程
    handleConfirm() {
      this.$refs["queryForm"].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.queryParams,
            flowTaskVo: {
              flowKey: this.flowKey,
              variables: {},
            },
            formType: 1,
          };
          submitFlow(params).then((res) => {
            const { code } = res;
            if (code == 200) {
              this.$message.success(res.msg);
              Bus.$emit("ProcessSuccess");
            }
          });
          return true;
        } else {
          return false;
        }
      });
    },
    handleConcel() {
      this.resetFieldsTap("queryForm");
    },
    /** 加载审批任务弹框 */
    handleComplete() {
      this.$refs["examine"].handleComplete();
    },
    /** 可退回任务列表 */
    handleReturn() {
      this.$refs["examine"].handleReturn();
    },
    /** 委派任务 */
    handleDelegate() {
      this.$refs["examine"].handleDelegate();
    },
    /** 转办任务 */
    handleAssign() {
      this.$refs["examine"].handleAssign();
    },
    /** 驳回任务 */
    handleReject() {
      this.$refs["examine"].handleReject();
    },
  },
};
</script>

<style scoped>
.btns {
  margin-top: 10px;
}
</style>
<template>
  <!-- 在表单配置页面设置的currentFormUrl动态引入写死的表单  -->
  <component
    v-if="dynamicComponent"
    ref="flexibleForm"
    :is="dynamicComponent"
    :showOnly="showOnly"
    :btnIsShow="btnIsShow"
    :deployId="deployId"
    :procDefId="procDefId"
    :taskForm="taskForm"
    :flowKey="flowKey"
  />
</template>

<script>
export default {
  name: "FormExample",
  props: {
    // 死表单路由
    currentFormUrl: {
      required: true,
      type: String,
      default: "",
    },
    /**
     * 控制表单按钮是否显示
     *  save: 保存按钮
     *  submit: 保存并提交按钮
     * */
    btnIsShow: {
      required: true,
      type: Array,
      default: () => [],
    },
    // 是否只是展示表单
    showOnly: {
      required: true,
      type: Boolean,
      default: true,
    },
    // 审核意见弹窗内的form表单字段
    taskForm: {
      // required: true,
      type: Object,
      default: () => {},
    },
    // 流程实例名称, 流程唯一id
    procDefId: {
      type: String,
      default: "",
    },
    // 流程定义编号, 模型唯一id
    deployId: {
      type: String,
      default: "",
    },
    // 流程唯一标识, 我的流程页面中需要传
    flowKey: {
      type: String,
      default: "",
    },
  },
  computed: {
    // 父组件引用此组件时, 会传过来需要显示的死表单的文件路径, 这里引入
    dynamicComponent() {
      let currentFormUrl = this.currentFormUrl;
      if (currentFormUrl) {
        return () => import("@/views/" + currentFormUrl);
      } else {
        return null;
      }
    },
  },
  methods: {
    // 获取对应业务表单的详情数据
    getInfo() {
      setTimeout(() => {
        this.$refs["flexibleForm"].getFormInfo(
          this.taskForm.taskId,
          this.taskForm.deployId,
          this.taskForm.procInsId
        );
      }, 1000);
    },
  },
};
</script>

<style>
</style>
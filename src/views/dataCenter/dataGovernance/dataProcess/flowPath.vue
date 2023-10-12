<template>
  <component
    :is="com"
    :flowPathForm="flowPathForm"
    @cutCom="cutCom"
    @addFlowPath="addFlowPath"
  />
</template>

<script>
import list from "./components/flowPath/list";
import panel from "./components/flowPath/panel";
export default {
  name: "FlowPath",
  components: {
    list,
    panel,
  },
  data() {
    return {
      com: "list",
      flowPathForm: {},
    };
  },
  methods: {
    cutCom(val) {
      this.com = val;
    },
    addFlowPath(form) {
      this.flowPathForm = form;
    },
  },
};
</script>

<style>
</style>
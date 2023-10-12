<template>
  <component :is="componentId" :ids="queryParams" @cut="cut"></component>
</template>

<script>
import launch from "@/views/support/oa/task/myProcess/send";
export default {
  components: {
    launch,
  },
  data() {
    return {
      componentId: "launch",
      queryParams: {
        deployId: 80012,
        procDefId: "flow_l7zn9ah8:4:80015",
      },
    };
  },
  methods: {
    cut() {
      this.$router.push({
        name: "MyProcess",
      });
    },
  },
};
</script>

<style>
</style>
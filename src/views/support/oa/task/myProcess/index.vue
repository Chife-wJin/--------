<template>
  <component
    :is="componentId"
    :ids="queryParams"
    @cut="cut"
  ></component>
</template>

<script>
import list from "./list";
import launch from "./send";
export default {
  name: "MyProcess",
  components: {
    list,
    launch,
  },
  data() {
    return {
      componentId: "list",
      queryParams: {},
    };
  },
  methods: {
    cut(val) {
      this.componentId = val.is;
      this.queryParams = val;
    },
  },
};
</script>

<style>
</style>
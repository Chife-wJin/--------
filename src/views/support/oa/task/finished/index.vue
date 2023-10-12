<template>
  <component
    :is="componentId"
    :params="queryParams"
    @cut="cut"
  ></component>
</template>

<script>
import list from "./list";
import launch from "./detail";
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
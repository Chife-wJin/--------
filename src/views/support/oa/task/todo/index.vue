<template>
  <component
    :is="componentId"
    :params="params"
    @cut="cut"
  ></component>
</template>

<script>
import list from "./list";
import launch2 from "./detail";
export default {
  name: "MyProcess",
  components: {
    list,
    launch2,
  },
  data() {
    return {
      componentId: "list",
      params: {},
    };
  },
  methods: {
    cut(val) {
      this.componentId = val.is;
      this.params = val;
    },
  },
};
</script>

<style>
</style>
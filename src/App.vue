<template>
  <div id="app">
    <keep-alive include="center">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>

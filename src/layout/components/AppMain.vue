<template>
  <div class="platform-layout-content">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive> -->
      <router-view :key="key" />
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>


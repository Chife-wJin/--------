<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="废气" name="first">
        <Air/>
      </el-tab-pane>
      <el-tab-pane label="废水" name="second">
        <Water/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Air from './air.vue'
import Water from './water.vue'
export default {
  name: "onlineMonitor",
  components: {
    Air,
    Water
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  created() { },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
      },
  }
};
</script>

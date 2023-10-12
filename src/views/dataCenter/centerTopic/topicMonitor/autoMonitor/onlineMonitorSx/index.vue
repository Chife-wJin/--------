<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="废气" name="first">
        <List :type=1 ref="gas"/>
      </el-tab-pane>
      <el-tab-pane label="废水" name="second">
        <List :type=2 ref="water"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import List from './list.vue'
export default {
  name: "onlineMonitorSx",
  components: {
    List
  },
  data() {
    return {
      activeName: 'first',
      type: 1
    };
  },
  created() { },
  methods: {
    handleClick(tab, event) {
        if(tab.index == 0){
          // this.$refs.gas.getListData();
          this.$refs.gas.getT3centerpriseList()
          this.$refs.gas.show();
        }else{
          // this.$refs.water.getListData();
          this.$refs.water.getT3centerpriseList()
          this.$refs.water.show()
        }
      },
  }
};
</script>

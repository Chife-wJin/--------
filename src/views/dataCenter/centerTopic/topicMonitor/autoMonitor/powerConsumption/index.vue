<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="企业小时用电量" name="first">
        <HourEnergy/>
      </el-tab-pane>
      <el-tab-pane label="生产设施监测数据" name="second">
        <ProductData/>
      </el-tab-pane>
      <el-tab-pane label="治理设施监测数据" name="third ">
        <GovernanceData/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HourEnergy from './hourEnergy.vue'
import ProductData from './productData.vue'
import GovernanceData from './governanceData.vue'
export default {
  name: "onlineMonitor",
  components: {
    HourEnergy,
    ProductData,
    GovernanceData
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

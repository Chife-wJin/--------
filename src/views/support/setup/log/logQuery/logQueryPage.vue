<template>
  <div class="information-inner information-styem" ref="informationInner">
    <log-query-list @handleSee="handleSee"></log-query-list>
    <el-dialog title="统计图表" :visible.sync="seeShow" width="1000px">
      <log-query-see></log-query-see>
    </el-dialog>
  </div>
</template>

<script>
import logQueryList from "./logQueryList";
import logQuerySee from "./logQuerySee";
export default {
  components: {
    logQueryList,
    logQuerySee,
  },
  data() {
    return {
      seeShow: false,
    };
  },
  methods: {
    handleSee(val) {
      this.seeShow = val;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
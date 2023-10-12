<template>
  <div class="tab-header-edit">
    <el-drawer
      title="表头编辑"
      :visible="true"
      v-if="isOpen"
      :before-close="handleClose"
      size="50%"
      >{{ headerList }}
      <el-table :data="headerList" border style="width: 100%">
        <el-table-column prop="name" label="列名"> </el-table-column>
        <el-table-column label="隐藏">
          <template slot-scope="scope">
            <el-checkbox
              @change="handeleCheckChange($event, 'hide', scope.$index)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="冻结"
          ><template slot-scope="scope">
            <el-checkbox
              @change="handeleCheckChange($event, 'fixed', scope.$index)"
              v-model="scope.row.fixed"
            ></el-checkbox> </template
        ></el-table-column>
        <el-table-column label="过滤"
          ><template slot-scope="scope">
            <el-checkbox
              @change="handeleCheckChange($event, 'filter', scope.$index)"
              v-model="scope.row.filter"
            ></el-checkbox> </template
        ></el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-checkbox
              @change="handeleCheckChange($event, 'sort', scope.$index)"
              v-model="scope.row.sort"
            ></el-checkbox> </template
        >
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      curIndex: 0,
    };
  },
  props: {
    isOpen: Boolean,
  },
  computed: {
    headerList() {
      return this.$store.state.tableSetting.headerList;
    },
  },
  methods: {
    toggleItem: function (index) {
      this.curIndex = index;
      this.$emit("toggleStep", index);
    },
    handeleCheckChange: function (value, type, idx) {
      let arr = this.headerList;
      arr[idx][type] = value;
      this.$store.commit("SET_Header_List", arr);
    },
    handleClose() {
      this.$emit("changeStauts", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-header-edit {
}
</style>
<template>
  <div class="app-container">
    <el-table :data="tableData"
              class="container-table"
              :stripe="true"
              border
              v-loading="tableLoading">
      <el-table-column v-for="item in tableList"
                       :type="item.type"
                       :prop="item.prop"
                       :key="item.prop"
                       :label="item.label">
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: 'assessLog',
  props: {
    tableData: {
      type: Array,
      defualt: () => [],
    },
    tableLoading: {
      type: Boolean,
      defualt: false,
    },
  },
  data() {
    return {
      tableList: [
        {
          prop: '0',
          label: '序号',
          type: 'index',
          width: '',
        },
        {
          prop: 'assessTableName',
          label: '模型名称',
          width: '',
        },
        {
          prop: 'taskListName',
          label: '所属任务',
          width: '',
        },
        {
          prop: 'startDatetime',
          label: '任务开始时间',
          width: '',
        },
        {
          prop: 'exceTime',
          label: '耗时',
          width: '',
        },
        {
          prop: 'exceState',
          label: '执行结果',
          width: '',
        },
        {
          prop: 'exceMistaken',
          label: '异常信息',
          width: '',
        },
      ],
    }
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
// .table-heardr {
//   background: #f5f7fa;
// }
</style>

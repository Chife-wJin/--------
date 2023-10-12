<template>
  <div>
    <div class="search-tool">
      <el-input class="search-input"
                v-model="searchParams.ruleTableName"
                size="small"
                placeholder="请输入所选模型" />
      <el-input class="search-input"
                v-model="searchParams.taskName"
                size="small"
                placeholder="请输入任务名称" />

      <el-select v-model="searchParams.exceState"
                 class="search-input"
                 clearable
                 @clear="getTableData"
                 size="small"
                 placeholder="请选择执行结果">
        <el-option label="预执行状态"
                   value="0" />
        <el-option label="成功状态"
                   value="1" />
        <el-option label="执行失败状态"
                   value="2" />
      </el-select>
      <el-button size="small"
                 @click="handleCurrentChange(1)"
                 style="margin:0 10px"
                 type="primary">搜索</el-button>
    </div>
    <Table :tableData="tableData"
           :tableLoading="tableLoading"></Table>
    <div class="page">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageInfo.pageNum"
                     :page-sizes="[15, 25, 35, 45]"
                     :page-size="pageInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>



<script>
import { getLogTableData } from '@/api/dataCenter/dataGovernance'
import { formatDate } from '@/utils/date'
import Table from './table'
export default {
  name: 'assessLog',
  data() {
    return {
      input: '',
      total: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 15,
      },
      searchParams: {
        ruleTableName: '',
        taskName: '',
        exceState: '',
      },
      tableData: [],
      tableLoading: false,
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val
      this.getTableData()
    },
    getTableData(
      {
        pageNum = this.pageInfo.pageNum,
        pageSize = this.pageInfo.pageSize,
        ruleTableName = searchParams.ruleTableName,
        taskName = searchParams.taskName,
        exceState = searchParams.exceState,
      } = { ...this.searchParams, ...this.pageInfo }
    ) {
      this.tableLoading = true
      let params = { pageNum, pageSize, ruleTableName, taskName, exceState }
      getLogTableData(params).then(({ data }) => {
        if (data) {
          let stateArr = ['预执行状态', '成功状态', '执行失败状态']
          this.tableData = data.records.map((item) => {
            item.startDatetime = formatDate(item.startDatetime)
            item.exceState = stateArr[item.exceState]
            return item
          })
          this.total = data.total
        }
        this.tableLoading = false
      })
    },
  },
  components: {
    Table,
  },
}
</script>
<style lang="scss" scoped>
.search-tool {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  .search-input {
    width: 200px;
    margin-left: 10px;
  }
}
.page {
  background: #fff;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>

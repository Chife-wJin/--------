<template>
  <div>
    <!-- <div class="top-tool">
      <el-button size="mini"
                 type="primary"
                 @click="toggleDialog(true)">新增</el-button>
      <el-button @click="deleteAllItem"
                 size="mini">
        删除
      </el-button>
      <div class="search-tool">
        <el-input v-model="searchInfo.encryptionName"
                  class="search-input"
                  size="mini"
                  :clearable="true"
                  placeholder="请输入规则名称">
        </el-input>
        <el-select size="mini"
                   class="search-input"
                   v-model="searchInfo.isCountry"
                   placeholder="请选择">
          <el-option label="否"
                     value="0"></el-option>
          <el-option label="是"
                     value="1"></el-option>
        </el-select>
        <el-button size="mini"
                   type="primary"
                   @click='handleCurrentChange(1)'>
          搜索
        </el-button>
      </div>
    </div> -->
    <Table :isLoading="isLoading"
           :tableData="tableData"
           @toggleDialog="toggleDialog"
           @getSelectData="getSelectData"
           @getItemInfo="getItemInfo"></Table>
    <Dialog v-if="isShow"
            @toggleDialog="toggleDialog"
            @getTableData="getTableData"
            @resetTable="resetTable"
            :itemInfo="itemInfo"></Dialog>
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
import {
  deleteCommonDesensitization,
  getCommonEncryptionPage,
} from '@/api/dataCenter/dataGovernance'
import { formatDate } from '@/utils/date'
import Dialog from './dialog'
import Table from './table'
export default {
  name: 'secretKey',
  data() {
    return {
      isShow: false,
      tableData: [],
      isLoading: false,
      searchInfo: {
        encryptionName: '',
        isCountry: '',
      },
      total: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 15,
      },
      selectData: [],
      itemInfo: {},
    }
  },
  components: {
    Table,
    Dialog,
  },
  created() {
    this.getTableData()
  },
  methods: {
    toggleDialog(bool) {
      if (!bool) {
        this.itemInfo = {}
      }
      this.isShow = bool
    },
    getItemInfo(info) {
      this.itemInfo = info
    },
    getTableData(
      {
        encryptionName = '',
        isCountry = '',
        pageNum = this.pageInfo.pageNum,
        pageSize = this.pageInfo.pageSize,
      } = { ...this.searchInfo, ...this.pageInfo }
    ) {
      this.isLoading = true
      let params = {
        encryptionName,
        isCountry,
        pageNum,
        pageSize,
      }
      getCommonEncryptionPage(params).then(({ data }) => {
        if (data) {
          let { total, records } = data
          this.total = total
          this.tableData = records.map((item) => {
            item.createDate = formatDate(item.createDate)
            item.updateDate = formatDate(item.updateDate)
            item.isCountry = +item.isCountry === 1 ? '是' : '否'
            return item
          })
        }
        this.isLoading = false
      })
    },
    getSelectData(data) {
      this.selectData = data
    },
    async deleteAllItem() {
      if (
        this.selectData.length &&
        (await this.$confirm('是否要删除？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }))
      ) {
        let selectIds = this.selectData.map((item) => {
          return deleteCommonDesensitization({ ids: item.id })
        })

        Promise.all(selectIds)
          .then((res) => {
            this.handleCurrentChange(1)
            this.$message.success('删除成功')
          })
          .catch((e) => {
            this.$message.error('删除失败')
          })
      }
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val
      this.getTableData()
    },
    resetTable(searchInfo, pageInfo) {
      this.searchInfo = searchInfo
      this.pageInfo = pageInfo
    },
  },
}
</script>


<style lang="scss" scoped>
.top-tool {
  margin-bottom: 10px;
  .search-tool {
    padding: 0 10px;
    float: right;
    .search-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
.page {
  background: #fff;
  padding: 20px 0 10px 5px;
  display: flex;
  justify-content: flex-end;
}
</style>
<template>
  <div>
    <div class="top-tool">
      <el-button size="mini"
                 type="primary"
                 @click="toggleDialog(true)" icon="el-icon-plus">新增</el-button>
      <el-button @click="deleteAllItem"
                  type="danger"
          plain
          icon="el-icon-delete"
          size="mini">
        批量删除
      </el-button>
      <div class="search-tool">
        <el-input v-model="searchInfo.fieldName"
                  class="search-input"
                  size="mini"
                  :clearable="true"
                  placeholder="请输入字段名称">
        </el-input>
        <el-button size="mini"
                   type="primary"
                   @click='handleCurrentChange(1)'>
          搜索
        </el-button>
      </div>
    </div>
    <Table :isLoading="isLoading"
           :tableData="tableData"
           @toggleDialog="toggleDialog"
           @getSelectData="getSelectData"
           @getItemInfo="getItemInfo"
           @deleteItem="deleteItem"></Table>
    <Dialog v-if="isShow"
            @toggleDialog="toggleDialog"
            @getTableData="getTableData"
            @resetTable="resetTable"
            :aligorthmList="aligorthmList"
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
  deleteEncryptionRule,
  getCommonEncryptionList,
  getEncryptionRulenPage,
} from '@/api/dataCenter/dataGovernance'
import Dialog from './dialog'
import Table from './table'
export default {
  name: 'dataEncryption',
  data() {
    return {
      isShow: false,
      tableData: [],
      isLoading: false,
      searchInfo: {
        fieldName: '',
      },
      total: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 15,
      },
      aligorthmList: [],
      selectData: [],
      itemInfo: {},
    }
  },
  components: {
    Table,
    Dialog,
  },
  created() {
    getCommonEncryptionList({
      pageNum: 1,
      pageSize: 1000,
    }).then(({ data }) => {
      this.aligorthmList = data || []
    })
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
        fieldName = '',
        pageNum = this.pageInfo.pageNum,
        pageSize = this.pageInfo.pageSize,
      } = { ...this.searchInfo, ...this.pageInfo }
    ) {
      this.isLoading = true
      let params = {
        fieldName,
        pageNum,
        pageSize,
      }
      getEncryptionRulenPage(params).then(({ data }) => {
        if (data) {
          let { total, records } = data
          this.total = total
          this.tableData = records.map((item) => {
            item.isEncryption = item.isEncryption === 1 ? '是' : '否'
            let { encryptionName } =
              this.aligorthmList.find(
                (ele) => ele.id === item.commonEncryptionId
              ) || {}
            item.aligorthmName = encryptionName
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
          return deleteEncryptionRule({ ids: item.id })
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
    deleteItem(rowId) {
      console.log(rowId)
      let id = rowId
      this.$confirm("确认要删除该信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteEncryptionRule({ ids:id }).then((reponse) => {
            if (reponse.code == 200) {
              this.$message({
                message: reponse.msg,
                type: "success",
              });
             this.getTableData()
            }
          });
        })
        .catch((e) => e);
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
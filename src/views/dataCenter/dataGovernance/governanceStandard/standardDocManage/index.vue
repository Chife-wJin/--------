<template>
  <div>
    <div class="top-tool">
      <el-button size="mini"
                 type="primary"
                 icon="el-icon-upload2"
                 @click="toggleDialog(true)">上传</el-button>
      <!-- <el-button size="mini"
                 @click="downloadAll">下载</el-button> -->
      <el-button @click="deleteAllItem"
                 type="danger"
          plain
          icon="el-icon-delete"
          size="mini">
        批量删除
      </el-button>
      <div class="search-input">
        <el-input v-model="searchKey"
                  size="mini"
                  :clearable="true"
                  placeholder="请输入文件名称"
                  @clear="searchFun(1,'')">
        </el-input>
        <el-button size="mini"
                   type="primary"
                   @click='searchFun(1,searchKey)'>
          搜索
        </el-button>
      </div>
    </div>
    <Table @toggleDialog="toggleDialog"
           @getItemInfo='getItemInfo'
           @getSelectData="getSelectData"
           :tableData="tableData"
           :isLoading='isLoading'
           @deleteItem="deleteItem">
    </Table>
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
    <Dialog :itemInfo="itemInfo"
            @toggleDialog="toggleDialog"
            v-if="isShow"
            ref="dialog"
            @searchFun='searchFun'>
    </Dialog>
  </div>
</template>

<script>
import { deleteItemById, getTableData } from '@/api/dataCenter/dataGovernance'
import { formatDate } from '@/utils/date'
import Dialog from './dialog'
import Table from './table'
export default {
  name: 'WqzhhjglptUiIndex',

  data() {
    return {
      total: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 15,
      },
      searchKey: '', // 搜索值
      isShow: false,
      itemInfo: {}, //单元信息
      tableData: [], //表格信息
      selectData: [], //表格选中信息
      isLoading: true,
    }
  },
  components: {
    Table,
    Dialog,
  },
  async created() {
    await this.getTableData()
  },

  methods: {
    toggleDialog(bool) {
      this.isShow = bool
      if (!bool) {
        this.itemInfo = {}
      }
      if (this.$refs.dialog) {
        this.$refs.dialog.dialogVisible = bool
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
    async getTableData(
      {
        name = '',
        pageNum = this.pageInfo.pageNum,
        pageSize = this.pageInfo.pageSize,
      } = { name: '', ...this.pageInfo }
    ) {
      this.isLoading = true
      let params = {
        name,
        pageNum,
        pageSize,
      }
      let { data } = await getTableData(params)
      if (data) {
        this.isLoading = false
        let { total, records } = data
        this.total = total
        this.tableData = records.map((item) => {
          item.createDate = formatDate(item.createDate)
          return item
        })
      }
    },
    getSelectData(data) {
      this.selectData = data
    },

    //搜索
    searchFun(pageNum, key) {
      this.searchKey = key
      this.pageInfo.pageNum = pageNum
      this.getTableData({ name: key })
    },
    getItemInfo(info) {
      this.itemInfo = info
    },
    downloadAll() {
      //todo
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
          return deleteItemById({ ids: item.id })
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
      // console.log(rowId)
      let id = rowId
      this.$confirm("确认要删除该信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteItemById({ ids:id }).then((reponse) => {
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
  },
}
</script>

<style lang="scss" scoped>
.top-tool {
  margin-bottom: 10px;
  .search-input {
    width: 220px;
    display: flex;
    float: right;
    margin-right: 10px;
  }
}
.page {
  background: #fff;
  padding: 20px 0 10px 5px;
  display: flex;
  justify-content: flex-end;
}
</style>
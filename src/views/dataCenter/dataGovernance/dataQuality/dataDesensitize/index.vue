<template>
  <div>
    <div class="top-tool">
      <el-button size="mini"
                 type="primary"
                 @click="toggleDialog(true)" icon="el-icon-plus">新增</el-button>
      <el-button 
          @click="deleteAllItem"
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
        <el-select class="search-input"
                   size="mini"
                   :clearable="true"
                   @clear="handleCurrentChange(1)"
                   v-model="searchInfo.desensitizationMode"
                   placeholder="请选择脱敏方式">
          <el-option v-for="item in desensitizationModeCheck"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
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
           @deleteItem="deleteItem"
           ></Table>
    <Dialog v-if="isShow"
            @toggleDialog="toggleDialog"
            @getTableData="getTableData"
            @resetTable="resetTable"
            :userList="userList"
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
  deleteDesensitizationRule,
  getDesensitizationRulePage,
} from '@/api/dataCenter/dataGovernance'
import { roleList } from '@/api/styem/role'
import Dialog from './dialog'
import { desensitizationModeCheck } from './status.js'
import Table from './table'
export default {
  name: 'dataDesensitize',
  data() {
    return {
      desensitizationModeCheck,
      isShow: false,
      tableData: [],
      isLoading: false,
      searchInfo: {
        fieldName: '',
        desensitizationMode: '',
      },
      total: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 15,
      },
      selectData: [],
      userList: [],
      itemInfo: {},
    }
  },
  components: {
    Table,
    Dialog,
  },
  async created() {
    let userData = await roleList()
    this.userList = userData.data || []

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
        desensitizationMode = '',
        pageNum = this.pageInfo.pageNum,
        pageSize = this.pageInfo.pageSize,
      } = { ...this.searchInfo, ...this.pageInfo }
    ) {
      this.isLoading = true
      let params = {
        fieldName,
        desensitizationMode,
        pageNum,
        pageSize,
      }
      getDesensitizationRulePage(params).then(({ data }) => {
        if (data) {
          let { total, records } = data
          this.total = total
          let arr = ['替换', '截取', '运算', '随机化', '常用规则']
          this.tableData = records.map((item) => {
            let { name } =
              this.userList.find((user) => user.id === item.roleId) || {}
            item.userName = name
            item.desensitizationMode = arr[item.desensitizationMode - 1]
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
          return deleteDesensitizationRule({ ids: item.id })
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
          deleteDesensitizationRule({ ids:id }).then((reponse) => {
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
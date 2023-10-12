<template>
  <div class="app-container">
    <el-table :data="tableData"
              v-loading="isLoading"
              class="container-table"
              stripe
              :border="true"
              @select="handleSelectionChange"
              @select-all='handleSelectionChange'>
      <el-table-column v-for="item in tableInfo"
                       :prop="item.key "
                       :key="item.key"
                       :type='item.type'
                       :label="item.name ">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text"
            icon="el-icon-edit"
                     @click="handleEdit( scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              class="delete-state-btn"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { getItemInfoById } from '@/api/dataCenter/dataGovernance'
export default {
  name: 'WqzhhjglptUTable',
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tableInfo: [
        {
          type: 'selection',
          key: '2',
        },
        {
          name: '序号',
          key: '1',
          type: 'index',
        },
        {
          name: '字段名称',
          key: 'fieldName',
        },
        {
          name: '脱敏方式',
          key: 'desensitizationMode',
        },

        {
          name: '原始值权限',
          key: 'userName',
        },
        {
          name: '字段类型',
          key: 'fieldType',
        },
        {
          name: '所属表',
          key: 'assessTableName',
        },
        {
          name: '所属数据源',
          key: 'datasourceName',
        },
      ],
      downloading: false,
    }
  },

  mounted() {},

  methods: {
    async handleEdit(itemInfo) {
      this.$emit('getItemInfo', itemInfo) //获取单元信息
      this.$emit('toggleDialog', true) // 打开弹窗
    },
    handleSelectionChange(data) {
      this.$emit('getSelectData', data)
    },
    handleDelete(row){
      this.$emit("deleteItem",row.id)
    }

    // async getItemDetail(id) {
    //   let { data } = await getItemInfoById({ id })
    //   this.$emit('getItemInfo', data) //获取单元信息
    // },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .cell {
  text-overflow: clip;
}
.delete-state-btn{color: #F56C6C;}
</style>
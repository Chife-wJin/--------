<template>
  <div class="app-container">
    <el-table :data="tableData"
              v-loading="isLoading"
              class="container-table"
              stripe
              :border="true"
              @select="handleSelectionChange"
              @select-all='handleSelectionChange'
              style="width: 100%">
      <el-table-column v-for="item in tableInfo"
                       :prop="item.key "
                       :key="item.key"
                       :type='item.type'
                       :label="item.name ">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
          type="text"
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
          name: '资源名称',
          key: 'datasourceName',
        },

        // {
        //   name: '是否加密',
        //   key: 'isEncryption',
        // },
        {
          name: '加密算法',
          key: 'aligorthmName',
        },
        // {
        //   name: '加密条件',
        //   key: 'conditionValue',
        // },
      ],
      downloading: false,
    }
  },

  mounted() {},

  methods: {
    async handleEdit(itemInfo) {
      this.$emit('toggleDialog', true) // 打开弹窗
      this.$emit('getItemInfo', itemInfo)
    },
    handleSelectionChange(data) {
      this.$emit('getSelectData', data)
    },
    handleDelete(row){
      this.$emit("deleteItem",row.id)
    }

    // async getItemDetail(id) {
    //   let { data } = await getRuleInfoById({ id })
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
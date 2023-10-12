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
                       :prop="item.key || ''"
                       :key="item.key"
                       :type='item.type || ""'
                       :label="item.name || ''">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
          type="text"
            icon="el-icon-edit"
             @click="handleEdit( scope.row)">编辑</el-button>
          <el-button size="mini"
                      type="text"
            icon="el-icon-download"
                     @click="handleDownload(scope.row)">下载</el-button>
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
import {
  getDownloadUrl,
  getItemInfoById,
} from '@/api/dataCenter/dataGovernance'
import { downloadFile } from '@/api/file'
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
          name: '序号',
          key: '1',
          type: 'index',
        },
        {
          type: 'selection',
          key: '2',
        },
        {
          name: '文件编号',
          key: 'fileCode',
        },
        {
          name: '文件名称',
          key: 'fileName',
        },

        {
          name: '文件说明',
          key: 'fileExplain',
        },
        {
          name: '上传时间',
          key: 'createDate',
        },
      ],
      downloading: false,
    }
  },

  mounted() {},

  methods: {
    async handleEdit(itemInfo) {
      await this.getItemDetail(itemInfo.id)
      this.$emit('toggleDialog', true) // 打开弹窗
    },
    handleDelete(row){
      this.$emit("deleteItem",row.id)
    },
    handleDownload(itemInfo) {
      getDownloadUrl({ id: itemInfo.fileAttachmentId }).then(({ data }) => {
        downloadFile({ savePath: data[0].save_path }).then((res) => {
          if (res.code === 500) {
            this.$message.error('下载失败')
          } else {
            this.download(res, data[0].file_name)
            this.$message.success('下载成功')
          }
        })
      })
      // await this.getItemDetail(itemInfo.id)
    },
    download(data, fileName) {
      let ele = document.createElement('a')
      var blob = new Blob([data])
      const url = URL.createObjectURL(blob)
      ele.download = fileName
      ele.href = url
      ele.click()
      window.URL.revokeObjectURL(url)
      ele.remove()
    },

    handleSelectionChange(data) {
      this.$emit('getSelectData', data)
    },

    async getItemDetail(id) {
      let { data } = await getItemInfoById({ id })
      this.$emit('getItemInfo', data) //获取单元信息
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .cell {
  text-overflow: clip;
}
.delete-state-btn{color: #F56C6C;}
</style>
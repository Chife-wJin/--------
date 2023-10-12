<template>
  <div>
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="30%"
               @close="closeForm"
               :destroy-on-close="true">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="120px">
        <el-form-item label="文件编号"
                      maxlength="10"
                      prop="fileCode">
          <el-input v-model="form.fileCode"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item required
                      label="选择本地文件"
                      prop="fileAttachmentId">
          <Upload @setUrlPath="setUrlPath"
                  :limit="1"
                  ref='upload'
                  :fileId="fileId"></Upload>
        </el-form-item>
        <el-form-item label="文件名称"
                      maxlength="50"
                      prop="fileName">
          <el-input v-model="form.fileName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="文件说明"
                      prop="fileExplain">
          <el-input type="textarea"
                    :rows="2"
                    placeholder="请输入"
                    v-model="form.fileExplain"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeForm">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveFileData, updateFileData } from '@/api/dataCenter/dataGovernance'
import Upload from '@/components/Upload'
export default {
  name: 'dialog',
  components: {
    Upload,
  },
  props: {
    itemInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: true,
      url: '/center/accessFile/uploadFile',
      form: {
        fileCode: '', //文件编号
        fileName: '', //文件名称
        fileExplain: '', //文件详情
        fileAttachmentId: '', //文件ID
      },
      fileId: '', //回显文件id  
      isEdit: false, //是否修改模式
      rules: {
        fileCode: [
          { required: true, message: '请输入文件编号', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        fileAttachmentId: [
          { required: true, message: '请上传文件', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    if (Object.keys(this.itemInfo).length) {
      this.isEdit = true
      let { fileCode, fileName, fileExplain, fileAttachmentId } = this.itemInfo
      this.fileId = fileAttachmentId
      this.form = { fileCode, fileName, fileExplain, fileAttachmentId }
      this.$nextTick(() => {
        this.$refs.upload.getFileMessageInfo()
      })
    }
  },
  computed: {
    title() {
      return `文件${this.isEdit ? '修改' : '上传'} `
    },
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateFileData({ ...this.form, id: this.itemInfo.id })
              .then((res) => {
                if (res.code == 200) {
                  this.closeForm()
                  this.$emit('searchFun', 1, '')
                } else {
                  this.$message.error('文件修改失败')
                }
              })
              .catch((e) => {
                this.$message.error('保修改失败')
              })
          } else {
            saveFileData({
              ...this.form,
            })
              .then((res) => {
                if (res.code == 200) {
                  this.closeForm()
                  this.$emit('searchFun', 1, '')
                } else {
                  this.$message.error('文件上传失败')
                }
              })
              .catch((e) => {
                this.$message.error('保存失败')
              })
          }
        } else {
          return false
        }
      })
    },
    closeForm() {
      this.$emit('toggleDialog', false)
    },
    setUrlPath({ fileId }) {
      this.form.fileAttachmentId = fileId
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  border-top: 1px solid #ebeef5;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 30px;
}
</style>
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
        <el-form-item label="算法名称"
                      prop="encryptionName">
          <el-input disabled
                    v-model="form.encryptionName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否国密"
                      prop="encryptionName">
          <el-select disabled
                     v-model="form.isCountry"
                     placeholder="请选择">
            <el-option label="否"
                       value="0">
            </el-option>
            <el-option label="是"
                       value="1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密钥"
                      prop="privateKey">
          <el-input v-model="form.privateKey"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="偏移量"
                      :prop="isOffset">
          <el-input v-model="form.offset"
                    placeholder="请输入"></el-input>
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
import { saveCommonEncryption } from '@/api/dataCenter/dataGovernance'
export default {
  name: 'dialog',

  props: {
    itemInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: true,
      form: {
        encryptionName: '', //算法名称
        isCountry: '0', // 是否国密
        privateKey: '', //密钥
        offset: '', //偏移量
      },
      isEdit: false, //是否修改模式
      rules: {
        encryptionName: [
          { required: true, message: '请输入算法名称', trigger: 'blur' },
        ],
        isCountry: [
          { required: true, message: '请选择是否国密', trigger: 'blur' },
        ],
        privateKey: [
          { required: true, message: '请输入密钥', trigger: 'blur' },
        ],
        offset: [{ required: true, message: '请输入偏移量', trigger: 'blur' }],
      },
    }
  },
  created() {
    if (Object.keys(this.itemInfo).length) {
      let { isCountry, encryptionName, offset, privateKey } = this.itemInfo
      isCountry = isCountry === '是' ? '1' : '0'
      this.form = { isCountry, encryptionName, offset, privateKey }
      this.isEdit = true
    }
  },
  computed: {
    title() {
      return `密钥${this.isEdit ? '修改' : '设置'}`
    },
    isOffset() {
      let { encryptionName } = this.itemInfo
      return encryptionName.includes('SM4') || encryptionName.includes('RC4')
        ? ''
        : 'offset'
    },
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            saveCommonEncryption({ ...this.form, id: this.itemInfo.id }).then(
              (res) => {
                if (res.code == 200) {
                  this.closeForm()
                  this.$emit(
                    'resetTable',
                    { encryptionName: '', isCountry: '' },
                    { pageNum: 1, pageSize: 15 }
                  )
                  this.$emit('getTableData')
                } else {
                  this.$message.error('规则修改失败')
                }
              }
            )
          }
        } else {
          return false
        }
      })
    },
    closeForm() {
      this.$emit('toggleDialog', false)
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
.form-input {
  width: 190px;
}
</style>
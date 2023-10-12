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
        <el-form-item label="规则名称"
                      maxlength="10"
                      prop="desensitizationName">
          <el-input v-model="form.desensitizationName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item required
                      label="脱敏方式"
                      prop="desensitizationMode">
          <el-radio-group v-model="form.desensitizationMode"
                          size="medium">
            <el-radio-button label="1">替换</el-radio-button>
            <el-radio-button label="2">截取</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="+form.desensitizationMode===2"
                      label="截取方式"
                      maxlength="50"
                      prop="desensitizationType">
          <el-radio v-model.number="form.desensitizationType"
                    :label="1">保留</el-radio>
          <el-radio v-model="form.desensitizationType"
                    :label="2">去除</el-radio>
        </el-form-item>
        <el-form-item v-else
                      label="替换方式"
                      maxlength="50"
                      prop="desensitizationType">
          <el-radio v-model.number="form.desensitizationType"
                    :label="1">按位数替换</el-radio>
          <el-radio v-model="form.desensitizationType"
                    :label="2">按固定值替换</el-radio>
        </el-form-item>
        <el-form-item :label="beginLabel"
                      prop="beginIndex">
          <el-input class="form-input"
                    placeholder="请输入"
                    v-model="form.beginIndex"></el-input>
          -
          <el-input placeholder="请输入"
                    class="form-input"
                    v-model="form.engIndex"></el-input>
          位
        </el-form-item>
        <el-form-item v-if="+form.desensitizationMode===1"
                      label="替换字符"
                      prop="resultValue">
          <el-input placeholder="请输入"
                    v-model="form.resultValue"></el-input>
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
import { saveRule } from '@/api/dataCenter/dataGovernance'
let validatePass = function (rule, value, callback) {
  let { beginIndex, engIndex } = this.form
  if (!beginIndex && !engIndex) {
    callback(new Error('请输入替换位置'))
  } else if (!beginIndex) {
    callback(new Error('请输入替换前值'))
  } else if (!engIndex) {
    callback(new Error('请输入替换后值'))
  }
  if (isNaN(Number(beginIndex)) || isNaN(Number(engIndex))) {
    callback(new Error('替换位置应为数字'))
  }
  callback()
}
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
      url: '/center/accessFile/uploadFile',
      form: {
        desensitizationName: '', //规则名称
        desensitizationMode: '1', //脱敏方式
        desensitizationType: 1, //替换方式  or 截取方式
        beginIndex: '', //替换位置 开始
        engIndex: '', //替换位置 结束
        resultValue: '', //替换字符
      },
      fileId: '', //回显文件id
      isEdit: false, //是否修改模式
      rules: {
        desensitizationName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
        ],
        desensitizationType: [
          { required: true, message: '请选择脱敏方式', trigger: 'blur' },
        ],
        targetValue: [{ required: true, message: '', trigger: 'blur' }],
        beginIndex: [
          {
            validator: validatePass.bind(this),
            trigger: 'blur',
            required: true,
          },
        ],
        resultValue: [
          { required: true, message: '请输入替换字符', trigger: 'blur' },
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
      },
    }
  },
  created() {
    if (Object.keys(this.itemInfo).length) {
      let {
        desensitizationName,
        desensitizationMode,
        desensitizationType,
        beginIndex,
        engIndex,
        resultValue,
        roleId,
      } = this.itemInfo
      this.form = {
        desensitizationName,
        desensitizationMode,
        desensitizationType,
        beginIndex,
        engIndex,
        resultValue,
        roleId,
      }
      this.isEdit = true
    }
  },
  computed: {
    title() {
      return `规则${this.isEdit ? '修改' : '设置'}`
    },
    beginLabel() {
      return +this.form.desensitizationMode === 1 ? '替换位置' : '截取位置'
    },
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.resultValue =
            +this.form.desensitizationMode === 1 ? this.form.resultValue : ''
          if (this.isEdit) {
            saveRule({ ...this.form, id: this.itemInfo.id }).then((res) => {
              if (res.code == 200) {
                this.closeForm()
                this.$emit(
                  'resetTable',
                  { desensitizationName: '', desensitizationValue: '' },
                  { pageNum: 1, pageSize: 15 }
                )
                this.$emit('getTableData')
              } else {
                this.$message.error('规则修改失败')
              }
            })
          } else {
            saveRule({ ...this.form, id: '' }).then((res) => {
              if (res.code == 200) {
                this.closeForm()
                this.$emit(
                  'resetTable',
                  { desensitizationName: '', desensitizationValue: '' },
                  { pageNum: 1, pageSize: 15 }
                )
                this.$emit('getTableData')
              } else {
                this.$message.error('规则设置失败')
              }
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
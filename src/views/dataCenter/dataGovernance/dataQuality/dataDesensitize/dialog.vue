<template>
  <div>
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="50%"
               @close="closeForm"
               :destroy-on-close="true">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="120px">
        <el-form-item label="脱敏字段"
                      prop="fieldName">
          <el-cascader v-model="form.fieldName"
                       :show-all-levels="false"
                       @change="selectData"
                       ref="cascader"
                       :options="options"
                       :props="cascaderProps"></el-cascader>
        </el-form-item>
        <el-form-item label="脱敏方式"
                      :show-all-levels="false"
                      prop="desensitizationMode">
          <el-radio-group v-model="form.desensitizationMode"
                          size="medium">
            <el-radio-button v-for='item in desensitizationModeCheck'
                             :key="item.key"
                             :label="item.value">{{item.name}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if=" modeType!==3&& checkObj[form.desensitizationMode]"
                      :label="desensitizationTypeLabel"
                      prop="desensitizationType">
          <el-radio v-for="item in checkObj[form.desensitizationMode]"
                    v-model="form.desensitizationType"
                    :key="item.key"
                    :label="item.value">{{item.name}}</el-radio>
        </el-form-item>

        <el-form-item v-if=" modeType===3"
                      :label="desensitizationTypeLabel"
                      prop="operator">
          <el-radio v-for="item in checkObj[form.desensitizationMode]"
                    v-model="form.operator"
                    :key="item.key"
                    :label="item.value">{{item.name}}</el-radio>
        </el-form-item>

        <!-- type=替换  or 截取-->
        <el-form-item v-if="modeType===1 || modeType===2"
                      :label="beginLabel+'位置'"
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
        <el-form-item v-if="modeType===1 "
                      label="替换字符"
                      prop="resultValue">
          <el-input placeholder="请输入"
                    v-model="form.resultValue"></el-input>
        </el-form-item>
        <!--  type=运算 -->
        <el-form-item v-if="modeType===3"
                      label="运算数值"
                      prop="operatorValue">
          <el-input placeholder="请输入"
                    v-model="form.operatorValue"></el-input>
        </el-form-item>
        <!--  type=常用规则 -->
        <el-form-item v-if="modeType===5"
                      label="常用规则"
                      prop="commonDesensitizationId">
          <el-select v-model="form.commonDesensitizationId"
                     placeholder="请选择">
            <el-option v-for="item in commonDesensitizationList"
                       :key="item.id"
                       :label="item.ruleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色"
                      prop="roleId">
          <el-select v-model="form.roleId"
                     placeholder="请选择角色">
            <el-option v-for="item in userList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
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
import {
  getColumns,
  getDataBase,
  getDataSource,
  getRuleList,
  getTables,
  saveDesensitizationRule,
} from '@/api/dataCenter/dataGovernance'
import { checkObj, desensitizationModeCheck } from './status.js'

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
    userList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkObj,
      desensitizationModeCheck,
      dialogVisible: true,
      form: {
        assessTable: {
          databaseName: '',
          datasourceName: '',
          datasourceId: '',
          tableContent: '',
          tableName: '',
        },
        fieldName: [], //脱敏字段
        desensitizationMode: '1', //脱敏方式
        desensitizationType: 1, //替换方式
        desensitizationValue: '',
        beginIndex: '', //起始点
        engIndex: '', //终止点
        operatorValue: '', //运算值
        resultValue: '', //替换成值
        operator: 1, //运算符
        commonDesensitizationId: '', //常用规则
        fieldType: '', //字段类型
        fieldContent: '', //字段中文名
        roleId: '',
      },
      options: [],
      commonDesensitizationList: [],
      isEdit: false, //是否修改模式
      cascaderProps: {
        lazy: true,
        value: 'id',
        emitPath: false,
        label: 'datasourceName',
        // children: 'jdbcUsername',
        lazyLoad: async (node, resolve) => {
          if (node && !node.data) {
            let { data } = await getDataSource()
            data = data.map((item) => {
              item.step = 0
              item.nextStep = 1
              item.leaf = false
              return item
            })
            data && resolve(data)
          } else if (
            node.data &&
            +node.data.step === 0 &&
            +node.data.nextStep === 1
          ) {
            this.form.assessTable.datasourceId = node.data.id
            this.form.assessTable.datasourceName = node.data.datasourceName
            let DataBase = await getDataBase({ id: node.data.id })
            DataBase = DataBase.data.map((item) => ({
              datasourceName: item.SCHEMA_NAME,
              id: item.SCHEMA_NAME,
              ids: node.data.id,
              nextStep: 2,
              step: 1,
              leaf: false,
            }))
            DataBase && resolve(DataBase)
          } else if (
            node.data &&
            +node.data.step === 1 &&
            +node.data.nextStep === 2
          ) {
            this.form.assessTable.databaseName = node.data.datasourceName
            let tableData = await getTables({
              id: node.data.ids,
              dataBase: node.data.datasourceName,
            })
            tableData = tableData.data.map((item) => ({
              datasourceName: item.TABLE_NAME,
              tableContent: item.tableContent,
              id: item.TABLE_NAME,
              ids: node.data.ids,
              dataBase: node.data.datasourceName,
              step: 2,
              leaf: false,
            }))
            tableData && resolve(tableData)
          } else if (node.data && +node.data.step === 2) {
            this.form.assessTable.tableName = node.data.datasourceName
            this.form.assessTable.tableContent = node.data.tableContent
            let columsData = await getColumns({
              id: node.data.ids,
              dataBase: node.data.dataBase,
              tables: node.data.datasourceName,
            })
            columsData =
              columsData.data &&
              (columsData.data.result || []).map((item) => ({
                datasourceName: item.COLUMN_NAME,
                id: item.COLUMN_NAME,
                leaf: true,
                fieldType: item.DATA_TYPE,
                COLUMN_COMMENT: item.COLUMN_COMMENT,
              }))
            columsData && resolve(columsData)
          } else {
            resolve()
          }
        },
      },
      rules: {
        fieldName: [
          { required: true, message: '请选择脱敏字段', trigger: 'blur' },
        ],
        beginIndex: [
          {
            validator: validatePass.bind(this),
            trigger: 'blur',
            required: true,
          },
        ],
        desensitizationMode: [
          { required: true, message: '请选择脱敏方式', trigger: 'blur' },
        ],
        desensitizationType: [
          { required: true, message: '请选择替换方式', trigger: 'blur' },
        ],
        resultValue: [
          {
            required: true,
            message: `请输入字符`,
            trigger: 'blur',
          },
        ],
        operatorValue: [
          { required: true, message: '请输入运算值', trigger: 'blur' },
        ],
        operator: [
          { required: true, message: '请选择运算符', trigger: 'blur' },
        ],
        commonDesensitizationId: [
          { required: true, message: '请选择常用规则', trigger: 'blur' },
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
      },
    }
  },
  async created() {
    let { data } = await getRuleList({ pageNum: 1, pageSize: 1000 })
    this.commonDesensitizationList = data || []
    if (Object.keys(this.itemInfo).length) {
      Object.keys(this.form).forEach((item) => {
        if (!this.itemInfo[item] || typeof this.itemInfo[item] !== 'object') {
          this.form[item] = this.itemInfo[item]
        } else {
          Object.keys(this.form[item]).forEach((ele) => {
            this.form[item][ele] = this.itemInfo[item][ele]
          })
        }
      })
      let arr = { 替换: '1', 截取: '2', 运算: '3', 随机化: '4', 常用规则: '5' }
      this.form.desensitizationMode = arr[this.form.desensitizationMode]
      let { datasourceId, databaseName, tableName } = this.itemInfo.assessTable
      this.form.fieldName = [
        datasourceId + '',
        databaseName,
        tableName,
        this.itemInfo.fieldName,
      ]
      this.options = await this.initLoadArea({
        id: datasourceId,
        dataBase: databaseName,
        tables: tableName,
      })
      this.isEdit = true
    }
  },
  computed: {
    title() {
      return `脱敏${this.isEdit ? '修改' : '设置'}`
    },
    beginLabel() {
      return +this.form.desensitizationMode === 1 ? '替换' : '截取'
    },
    desensitizationTypeLabel() {
      let arr = ['截取方式', '替换方式', '运算符']
      return arr[this.form.desensitizationMode - 1]
    },
    modeType() {
      return +this.form.desensitizationMode
    },
  },
  methods: {
    selectData(val) {
      let { data } = this.$refs.cascader.getCheckedNodes()[0]
      this.form.fieldType = data.fieldType
      this.form.fieldContent = data.COLUMN_COMMENT
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let { desensitizationMode } = this.form
          this.setUpData(+desensitizationMode)

          if (this.isEdit) {
            saveDesensitizationRule({
              ...this.form,
              id: this.itemInfo.id,
            }).then((res) => {
              if (res.code == 200) {
                this.closeForm()
                this.$emit(
                  'resetTable',
                  { desensitizationName: '', desensitizationMode: '' },
                  { pageNum: 1, pageSize: 15 }
                )
                this.$emit('getTableData')
              } else {
                this.$message.error('脱敏修改失败')
              }
            })
          } else {
            saveDesensitizationRule(this.form).then((res) => {
              if (res.code == 200) {
                this.closeForm()
                this.$emit(
                  'resetTable',
                  { desensitizationName: '', desensitizationMode: '' },
                  { pageNum: 1, pageSize: 15 }
                )
                this.$emit('getTableData')
              } else {
                this.$message.error('脱敏设置失败')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    setUpData(mode) {
      switch (mode) {
        case 2: //截取
          this.form.resultValue = ''
        case 1: //替换
          this.form.operator = ''
          this.form.commonDesensitizationId = ''
          this.form.operatorValue = ''
          break
        case 3: //运算
          this.form.beginIndex = ''
          this.form.desensitizationType = ''
          this.form.engIndex = ''
          this.form.resultValue = ''
          this.form.commonDesensitizationId = ''
          break
        case 4: //随机化
          this.form['commonDesensitizationId'] = ''
        case 5: //常用规则
          Object.keys(this.form).forEach((item) => {
            if (
              item !== 'fieldName' &&
              item !== 'desensitizationMode' &&
              item !== 'commonDesensitizationId' &&
              item !== 'assessTable' &&
              item !== 'fieldContent' &&
              item !== 'fieldType' &&
              item !== 'roleId'
            ) {
              this.form[item] = ''
            }
          })
          break
        default:
          break
      }
    },
    async initLoadArea({ id, dataBase, tables }) {
      let dataSource = await getDataSource()
      let dataBaseList = await getDataBase({ id })
      let table = await getTables({ id, dataBase })
      let columns = await getColumns({ id, dataBase, tables })
      let [SourceArr, baseListArr, tableArr, columnsArr] = [
        dataSource.data,
        dataBaseList.data,
        table.data,
        columns.data,
      ]
      let columnsArrs = columnsArr.result.map((ele) => {
        ele.datasourceName = ele.COLUMN_NAME
        ele.leaf = true
        ele.id = ele.COLUMN_NAME
        return ele
      })
      tableArr = tableArr.map((item) => {
        if (item.TABLE_NAME === tables) {
          item.children = columnsArrs
        }
        item.leaf = false
        item.datasourceName = item.TABLE_NAME
        item.id = item.TABLE_NAME
        return item
      })
      baseListArr = baseListArr.map((item) => {
        if (item.SCHEMA_NAME === dataBase) {
          item.children = tableArr
        }
        item.leaf = false
        item.id = item.SCHEMA_NAME
        item.datasourceName = item.SCHEMA_NAME
        return item
      })
      SourceArr = SourceArr.map((item) => {
        item.id / 1 === +id && (item.children = baseListArr)
        item.leaf = false
        return item
      })
      return SourceArr
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
::v-deep .el-input__inner::placeholder {
  color: rgba(0, 0, 0, 0.685) !important;
}
</style>
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
        <el-form-item label="加密字段"
                      prop="fieldName">
          <el-cascader v-model="form.fieldName"
                       :placeholder="form.fieldName"
                       :show-all-levels="false"
                       @change="selectData"
                       ref="cascader"
                       :props="cascaderProps"></el-cascader>
        </el-form-item>
        <el-form-item label="加密方式"
                      prop="commonEncryptionId">
          <el-select v-model="form.commonEncryptionId"
                     placeholder="请选择算法">
            <el-option v-for="item in aligorthmList"
                       :key="item.id"
                       :label="item.encryptionName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="数据表"
                      prop="commonEncryptionId">
          <el-select v-model="form.assessTableId"
                     placeholder="请选择数据表">
            <el-option v-for="item in assessTableList"
                       :key="item.id"
                       :label="item.tableName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否加密"
                      prop="isEncryption">
          <el-select class="search-input"
                     v-model="form.isEncryption"
                     placeholder="请选择是否加密">
            <el-option label="否"
                       value="0"></el-option>
            <el-option label="是"
                       value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="规则名称"
                      prop="ruleName">
          <el-input v-model="form.ruleName"
                    placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="加密条件"
                      prop="conditionValue">
          <el-input v-model="form.conditionValue"
                    placeholder="请输入"></el-input>
        </el-form-item> -->
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
  getTables,
  saveEncryptionRule,
} from '@/api/dataCenter/dataGovernance'
export default {
  name: 'dialog',

  props: {
    itemInfo: {
      type: Object,
      default: () => ({}),
    },
    aligorthmList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: true,
      form: {
        assessTable: {
          databaseName: '',
          datasourceName: '',
          datasourceId: '',
          tableContent: '',
          tableName: '',
        },
        fieldName: '',
        fieldType: '',
        fieldContent: '',
        commonEncryptionId: '',
        assessTableId: '',
        conditionValue: '',
        isEncryption: '1',
        ruleName: '',
      },
      assessTableList: [],
      isEdit: false, //是否修改模式
      rules: {
        fieldName: [
          { required: true, message: '请输入字段名', trigger: 'blur' },
        ],
        commonEncryptionId: [
          { required: true, message: '请选择加密方式', trigger: 'blur' },
        ],
        conditionValue: [
          { required: true, message: '请输入加密条件', trigger: 'blur' },
        ],
        ruleName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
        ],
        isEncryption: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
        ],
      },
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
    }
  },
  async created() {
    // getqualityRulesTree().then(({ data }) => {
    //   this.assessTableList = data
    // })
    if (Object.keys(this.itemInfo).length) {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = this.itemInfo[key]
      })
      let { datasourceId, databaseName, tableName } =
        this.itemInfo.assessTable || {}
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
      this.form.isEncryption = this.form.isEncryption === '是' ? '1' : '0'
      this.isEdit = true
    }
  },
  computed: {
    title() {
      return `数据加密${this.isEdit ? '修改' : '设置'}`
    },
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            saveEncryptionRule({ ...this.form, id: this.itemInfo.id }).then(
              (res) => {
                if (res.code == 200) {
                  this.closeForm()
                  this.$emit(
                    'resetTable',
                    { fieldName: '' },
                    { pageNum: 1, pageSize: 15 }
                  )
                  this.$emit('getTableData')
                } else {
                  this.$message.error('加密设置修改失败')
                }
              }
            )
          } else {
            saveEncryptionRule({ ...this.form, id: '' }).then((res) => {
              if (res.code == 200) {
                this.closeForm()
                this.$emit(
                  'resetTable',
                  { fieldName: '' },
                  { pageNum: 1, pageSize: 15 }
                )
                this.$emit('getTableData')
              } else {
                this.$message.error('加密设置失败')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    selectData(val) {
      let { data } = this.$refs.cascader.getCheckedNodes()[0]
      this.form.fieldType = data.fieldType
      this.form.fieldContent = data.COLUMN_COMMENT
    },
    closeForm() {
      this.$emit('toggleDialog', false)
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
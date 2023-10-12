<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      :disabled="disabled"
      ref="ruleForm"
      label-width="138px"
      size="small"
      class="dialog-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="monitorName" label="规则名称：">
            <el-input v-model="ruleForm.monitorName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="monitorType" label="规则类型：">
            <el-select
              v-model="ruleForm.monitorType"
              clearable
              @change="ruleChange"
            >
              <el-option
                v-for="item in ruleTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.monitorType == 4">
          <el-form-item prop="monitorClass" label="JAVA类名：">
            <el-input v-model="ruleForm.monitorClass" placeholder="填写Spring Bean名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12"  v-if="ruleForm.monitorType != 4">
          <el-form-item prop="datasourceId" label="选择数据源：">
            <el-select
              v-model="ruleForm.datasourceId"
              @change="datasourceChange"
            >
              <el-option
                v-for="item in dataSourceList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="ruleForm.monitorType != 4" prop="databaseName" label="选择数据库：">
            <el-select
              v-model="ruleForm.databaseName"
              filterable
              :disabled="!ruleForm.datasourceId"
              @change="databaseNameChange"
            >
              <el-option
                v-for="item in sjkDataList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.monitorType != 3 && ruleForm.monitorType != 4">
          <el-form-item prop="tableModel" label="选择数据表：">
            <el-select
              v-model="ruleForm.tableModel"
              :disabled="!ruleForm.databaseName"
              @change="tableModelChange"
            >
              <el-option
                v-for="item in tableDataList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.monitorType == 2">
          <el-form-item prop="monitorField" label="选择字段：">
            <el-select
              v-model="ruleForm.monitorField"
              :disabled="!ruleForm.tableModel"
            >
              <el-option
                v-for="item in fieldDataList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.monitorType != 3 && ruleForm.monitorType != 4" :span="12">
          <el-form-item prop="monitorWay" label="采样方式：">
            <el-select v-model="ruleForm.monitorWay" clearable>
              <el-option
                v-for="item in samplingList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.monitorType == 1" :span="12">
          <el-form-item prop="monitorCondition" label="过滤条件：">
            <el-input
              v-model="ruleForm.monitorCondition"
              placeholder="多个条件之间用逗号分隔"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="monitorCheckType" label="校检类型：">
            <el-select
              v-model="ruleForm.monitorCheckType"
              clearable
              @change="checkTypeChange"
            >
              <el-option
                v-for="item in checkList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.monitorCheckType != 1" :span="12">
          <el-form-item prop="monitorRange" label="校检方式：">
            <el-select v-model="ruleForm.monitorRange" clearable>
              <el-option
                v-for="item in MethodsList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.monitorType != 4">
          <el-form-item
            prop="monitorCheckCondition"
            label="比较方式："
            class="longLabel"
          >
            <el-select v-model="ruleForm.monitorCheckCondition" clearable>
              <el-option
                v-for="item in compareList"
                :key="item.value"
                :value="item.value - 0"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            v-if="ruleForm.monitorCheckType == 1"
            prop="monitorCheckValue"
            label="期望值："
          >
            <el-input-number
              v-model="ruleForm.monitorCheckValue"
              :precision="0"
              :step="1"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item v-else prop="monitorCheckValue" label="波动值比较(%)：">
            <el-input-number
              v-model="ruleForm.monitorCheckValue"
              :precision="0"
              :step="1"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="ruleForm.monitorType == 3">
        <el-col :span="22">
          <el-form-item prop="monitorSql" label="自定义SQL：">
            <monaco-editor
              language="sql"
              theme="vs-dark"
              :monitorValue="ruleForm.monitorSql"
              :selectOnLineNumbers="false"
              height="100px"
              @setEditorValue="setEditorValue"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button size="small" @click="sqlCheck">sql 验证</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button
        type="primary"
        v-if="rowInfo.type != '查看'"
        size="small"
        @click="submitForm('ruleForm')"
      >
        保存
      </el-button>
      <el-button @click="formCancel('ruleForm')" size="small">返回</el-button>
    </div>
  </div>
</template>

<script>
import monacoEditor from "@/components/monacoEditor";
import {
  getDataSource,
  getDataBase,
  getTables,
  getColumns,
} from "@/api/dataCenter/dataGovernance";
import { dictListType } from "@/api/styem/dict/type";
import {
  saveList,
  editList,
  getInfoById,
  checkSql,
} from "@/api/datax/datax-access-monitoring";

function getDictList(type) {
  return new Promise((resolve) => {
    dictListType({ type }).then(({ code, data }) => {
      if (code == 200) {
        resolve(data);
      }
    });
  });
}
export default {
  props: {
    rowInfo: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  components: {
    monacoEditor,
  },
  data() {
    return {
      isStart: true,
      dataSourceList: [],
      sjkDataList: [],
      tableDataList: [],
      fieldDataList: [],
      dataSource: undefined, // 选中的数据源
      sjkData: undefined, // 选中数据库
      tableData: undefined, // 选中的数据表
      fieldData: undefined, // 选中字段
      ruleForm: {
        monitorName: undefined,
        monitorType: undefined,
        monitorWay: undefined,
        monitorCondition: undefined,
        monitorSql: undefined,
        monitorCheckType: undefined,
        monitorRange: undefined,
        monitorCheckCondition: undefined,
        monitorCheckValue: undefined,
        datasourceId: undefined,
        databaseName: undefined,
        tableModel: undefined,
        monitorField: undefined,
        monitorClass: undefined,
      },
      rules: {
        monitorName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        monitorClass:[
          { required: true, message: "请输入JAVA类名", trigger: "blur" },
        ],
        monitorType: [
          { required: true, message: "请选择规则类型", trigger: "change" },
        ],
        dataSource: [
          { required: true, message: "请选择数据源", trigger: "change" },
        ],
        databaseName: [
          { required: true, message: "请选择数据库", trigger: "change" },
        ],
        tableModel: [
          { required: true, message: "请选择数据表", trigger: "change" },
        ],
        monitorField: [
          { required: true, message: "请选择字段", trigger: "change" },
        ],
        monitorWay: [
          { required: true, message: "请选择采样方式", trigger: "change" },
        ],
        monitorCondition: [
          { required: true, message: "请输入过滤条件", trigger: "blur" },
        ],
        monitorSql: [
          { required: true, message: "请输入自定义SQL", trigger: "blur" },
        ],
        monitorCheckType: [
          { required: true, message: "请选择校捡类型", trigger: "change" },
        ],
        monitorRange: [
          { required: true, message: "请选择校捡方式", trigger: "change" },
        ],
        monitorCheckCondition: [
          { required: true, message: "请选择比较方式", trigger: "change" },
        ],
        monitorCheckValue: [
          { required: true, message: "请输入值", trigger: "blur" },
        ],
      },
      disabled: false,
      ruleTypeList: [
        { value: 1, label: "表级规则" },
        { value: 2, label: "字段规则" },
        { value: 3, label: "自定义SQL" },
        { value: 4, label: "JAVA类" },
      ],
      samplingList: [],
      checkList: [],
      MethodsList: [],
      compareList: [],
    };
  },
  computed: {
    isOver() {
      if (this.ruleForm.monitorType == 3) {
        return (
          this.dataSourceList.length > 0 &&
          this.sjkDataList.length > 0 &&
          this.tableDataList.length > 0
        );
      } else {
        return (
          this.dataSourceList.length > 0 &&
          this.sjkDataList.length > 0 &&
          this.tableDataList.length > 0 &&
          this.fieldDataList.length > 0
        );
      }
    },
  },
  watch: {
    isOver: {
      handler: function (newV) {
        if (newV && this.rowInfo.type == "修改" && this.isStart) {
          this.ruleForm.datasourceId = this.dataSource;
          this.ruleForm.databaseName = this.sjkData;
          this.ruleForm.tableModel = this.tableData;
          this.ruleForm.monitorField = this.fieldData;
          this.isStart = false;
          this.$forceUpdate();
        }
      },
    },
  },
  created() {
    this.resetFieldsTap("ruleForm");
    this.dataSource = undefined;
    this.sjkData = undefined;
    this.tableData = undefined;
    this.fieldData = undefined;
    this.isStart = true;
    if (this.rowInfo.type == "修改") {
      this.getInfo();
    } else if (this.rowInfo.type == "添加") {
      this.$delete(this.ruleForm, "id");
    }
    this.getLevel();
  },

  methods: {
    // 获取数据源
    async getLevel() {
      const { code, data } = await getDataSource();
      if (code == 200) {
        // 处理接口数据
        this.dataSourceList = data.map((item) => {
          return {
            label: item.datasourceName,
            value: item.id,
          };
        });
      }
    },
    // 获取数据库数组
    async datasourceChange(val) {
      this.dataSource = val;
      this.ruleForm.databaseName = undefined;
      this.ruleForm.tableModel = undefined;
      this.ruleForm.monitorField = undefined;
      const { code, data } = await getDataBase({ id: val });
      if (code == 200) {
        this.sjkDataList = data.map((item) => {
          return {
            value: item.SCHEMA_NAME,
            label: item.SCHEMA_NAME,
          };
        });
      }
    },
    // 获取数据表数组
    async databaseNameChange(val) {
      this.sjkData = val;
      this.ruleForm.tableModel = undefined;
      this.ruleForm.monitorField = undefined;
      const params = {
        id: this.dataSource,
        dataBase: this.sjkData,
      };
      const { code, data } = await getTables(params);
      if (code == 200) {
        this.tableDataList = data.map((item) => {
          return {
            value: item.TABLE_COMMENT + "," + item.TABLE_NAME,
            label: item.TABLE_NAME,
          };
        });
      }
    },
    // 获取字段数组
    async tableModelChange(val) {
      this.tableData = val;
      this.ruleForm.monitorField = undefined;
      const params = {
        id: this.dataSource,
        dataBase: this.sjkData,
        tables: this.tableData.split(",")[1],
      };
      const { code, data } = await getColumns(params);
      if (code == 200) {
        this.fieldDataList = data.result.map((item) => {
          return {
            value: item.COLUMN_COMMENT + "," + item.COLUMN_NAME,
            label: item.COLUMN_COMMENT + item.COLUMN_NAME,
          };
        });
      }
    },
    // 选择表/字段级联请求获取数据 end

    // 选择规则类型
    ruleChange(val) {
      this.ruleForm.monitorCheckType = undefined;
      this.ruleForm.monitorRange = undefined;
      this.ruleForm.monitorWay = undefined;
      this.ruleForm.monitorCondition = undefined;
      this.ruleForm.monitorSql = undefined;
      this.ruleForm.monitorCheckCondition = undefined;
      this.ruleForm.monitorCheckValue = undefined;
      this.ruleForm.datasourceId = undefined;
      this.ruleForm.databaseName = undefined;
      this.ruleForm.tableModel = undefined;
      this.ruleForm.monitorField = undefined;
      if (val == 1 || val == 3 || val == 4) {
        this.samplingList = [
          { value: 1, label: "count" },
          { value: 2, label: "size" },
        ];
        this.checkList = [
          { value: 1, label: "数值型" },
          { value: 2, label: "波动率型" },
          { value: 3, label: "平均波动" },
        ];
      } else {
        this.samplingList = [
          { value: 1, label: "空值个数" },
          { value: 2, label: "重复值个数" },
          { value: 3, label: "唯一值个数" },
        ];
        this.checkList = [{ value: 1, label: "数值型" }];
      }
    },
    // 选择校验类型
    async checkTypeChange(val) {
      console.log(val)
      this.ruleForm.monitorRange = undefined;
      this.ruleForm.monitorCheckCondition = undefined;
      if (val == 1) {
        getDictList("comparison_method").then((res) => {
          this.compareList = res;
          console.log(this.compareList)
        });
      } else if (val == 2 || val == 3) {
        getDictList("comparison_methods").then((res) => {
          this.compareList = res;
        });
        this.MethodsList = [
          { value: 1, label: "1天波动率" },
          { value: 7, label: "7天波动率" },
          { value: 30, label: "30天波动率" },
        ];
      }
    },

    // 获取详情
    async getInfo() {
      const { id } = this.rowInfo;
      const { code, data } = await getInfoById({ id });
      if (code == 200) {
        // 选中规则类型
        this.ruleChange(data.monitorType);
        // 选中校捡类型
        this.checkTypeChange(data.monitorCheckType);
        this.ruleForm = data;
        // if (data.monitorType == 3) {
        //   return false;
        // }
        this.dataSource = this.ruleForm.monitorTable.datasourceId + "";
        this.sjkData = this.ruleForm.monitorTable.databaseName;
        this.tableData =
          this.ruleForm.monitorTable.tableContent +
          "," +
          this.ruleForm.monitorTable.tableName;
        this.fieldData =
          this.ruleForm.monitorFieldName + "," + this.ruleForm.monitorField;
        this.datasourceChange(this.dataSource);
        this.databaseNameChange(this.sjkData);
        this.tableModelChange(this.tableData);
      }
    },
    // sql 编辑器双向绑定
    setEditorValue(val) {
      this.ruleForm.monitorSql = val;
    },
    // sql 验证
    async sqlCheck() {
      if (
        this.ruleForm.datasourceId == undefined ||
        this.ruleForm.databaseName == undefined ||
        this.ruleForm.monitorSql == undefined
      ) {
        this.$message.info("请选择数据源、数据库, 以及填写sql !!!");
        return false;
      }
      const params = {
        monitorTable: {
          datasourceId: this.ruleForm.datasourceId,
          databaseName: this.ruleForm.databaseName,
        },
        monitorSql: this.ruleForm.monitorSql,
      };
      const { code, msg } = await checkSql(params);
      if (code == 200) {
        this.$message.success(msg);
      }
    },
    // 将表单中的数据处理成接口想要的
    setFormData(params) {
      params.formData = {
        ...this.ruleForm,
        monitorTable: {
          datasourceId: this.ruleForm.datasourceId,
          databaseName: this.ruleForm.databaseName,
        },
      };
      if (this.ruleForm.monitorType != 3) {
        params.formData.monitorTable.tableContent = this.ruleForm.tableModel.split(
          ","
        )[0];
        params.formData.monitorTable.tableName = this.ruleForm.tableModel.split(
          ","
        )[1];
      }
      if (this.ruleForm.monitorType == 2) {
        // 选择字段规则获取字段
        params.formData.monitorFieldName = this.ruleForm.monitorField.split(
          ","
        )[0];
        params.monitorField = this.ruleForm.monitorField.split(",")[1];
      } else {
        params.formData.monitorFieldName = undefined;
        params.formData.monitorField = undefined;
      }
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = {
            formData: undefined,
          };
          this.setFormData(params);
          let res;
          if (this.rowInfo.type == "添加") {
            res = await saveList(params.formData);
          } else {
            res = await editList(params.formData);
          }
          if (res.code == 200) {
            this.$emit("setDetailModal", false);
          }
        } else {
          return false;
        }
      });
    },
    // 返回
    formCancel() {
      this.$emit("setDetailModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
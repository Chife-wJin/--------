<template>
  <div class="dialog-form">
    <el-form
      ref="addForm"
      :rules="addRules"
      label-width="140px"
      :model="addForm"
      style="margin-top: 15px"
      :inline="true"
      :disabled="dialogTitle == '查看'"
    >
      <el-form-item label="数据源名称：" prop="datasourceName">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.datasourceName"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="数据源类型：" prop="datasource">
        <el-select v-model="addForm.datasource">
          <el-option
            v-for="item in datasourceList"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="jdbcUrl：" prop="jdbcUrl">
        <el-input
          v-model="addForm.jdbcUrl"
          placeholder="如：jdbc:mysql://localhost:3306"
          maxlength="100"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item label="数据库名：" prop="databaseName" class="three">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.databaseName"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="模式：" prop="schema" class="three">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.schema"
          placeholder="数据库无模式可为空"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="jdbcUsername">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.jdbcUsername"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="密码：" prop="jdbcPassword">
        <el-input
          maxlength="30"
          show-word-limit
          v-model="addForm.jdbcPassword"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button
        type="primary"
        size="medium"
        @click="submitForm"
        v-if="dialogTitle != '查看'"
        v-formScroll
      >
        保存
      </el-button>
      <el-button
        type="primary"
        size="medium"
        v-if="dialogTitle != '查看'"
        @click="handleTest()"
      >
        测试
      </el-button>
      <el-button size="medium" plain @click="handleDialogclose">关闭</el-button>
    </div>
  </div>
</template>

<script>
import {
  genJdbcDatasourceSave,
  genJdbcDatasourceById,
} from "@/api/styem/develop";

export default {
  name: "DataSourceConfigDialog",
  components: {},
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
    dialogTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      addForm: {
        driverClassName: undefined,
        password: undefined,
        poolName: undefined,
        url: undefined,
        username: undefined,
        schema: undefined,
      },
      datasourceList: [
        { label: "mysql" },
        { label: "oracle" },
        { label: "mssql" },
        { label: "kingbase8" },
        { label: "highgo" },
        { label: "dm" },
      ],
      addRules: {
        datasourceName: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        jdbcUrl: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        databaseName: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        jdbcUsername: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        jdbcPassword: {
          required: true,
          message: "请输入",
          trigger: "change",
        },
        datasource: {
          required: true,
          message: "请选择",
          trigger: "change",
        },
      },
    };
  },
  created() {
    this.getInfoById();
  },
  computed: {},
  methods: {
    async getInfoById() {
      if (this.detail.id) {
        let { data } = await genJdbcDatasourceById({ id: this.detail.id });
        if (data) {
          this.addForm = data;
        }
      }
    },
    submitForm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          await genJdbcDatasourceSave(this.addForm);
          this.$message.success("操作成功");
          this.$emit("getTableData");
          this.$emit("handleCloseDialog");
        }
      });
    },
    handleTest() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          this.$emit("handleTest", this.addForm);
        }
      });
    },
    handleDialogclose() {
      this.$emit("handleCloseDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item {
    width: 550px !important;
    &.three {
      &:nth-child(4) {
        width: 311px !important;
        .el-form-item__content {
          width: calc(100% - 140px);
          .el-input__inner {
            width: 100% !important;
          }
        }
      }
      &:nth-child(5) {
        width: 230px !important;
        .el-form-item__content {
          width: calc(100% - 50px);
          .el-input__inner {
            width: 100% !important;
          }
        }
        .el-form-item__label {
          width: 50px !important;
        }
      }
    }
  }
  .el-input__inner,
  .el-textarea__inner {
    width: 410px !important;
  }
}
</style>

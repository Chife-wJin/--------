<template>
  <el-dialog
    title="模型输入"
    :visible.sync="dialog"
    :show-close="true"
    center
    width="700px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="small"
      ref="ruleForm"
      label-width="98px"
      class="dialog-form"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="类型：" prop="type">
            <el-input v-model="ruleForm.type" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="模型：" prop="assessTableId">
            <el-select v-model="ruleForm.assessTableId" @change="assessSelect">
              <el-option
                v-for="item in assessList"
                :key="item.id"
                :value="item.id"
                :label="item.tableName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="table-content">
      <div class="title">输入字段：</div>
      <el-table
        border
        :data="List"
        max-height="500"
        @selection-change="handleSelectionChange"
        class="container-table"
        ref="table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="业务名称"
          prop="dataName"
        ></el-table-column>
        <el-table-column label="数据类型" prop="dataType"></el-table-column>
      </el-table>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')" size="small">
        确认
      </el-button>
      <el-button @click="formCancel('ruleForm')" size="small">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { cloneDeep } from "lodash";
import {
  getqualityRulesTree,
  getColumnsByDataProcess,
  getColumns,
} from "@/api/dataCenter/dataGovernance";
export default {
  props: {
    isShow: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      },
    },
  },
  data() {
    return {
      type: "node",
      node: {},
      data: {},
      serveData: {},
      rules: {
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        assessTableId: [
          { required: true, message: "请选择模型", trigger: "change" },
        ],
      },
      ruleForm: {
        type: undefined,
        name: undefined,
        assessTableId: undefined,
        tableName: undefined,
        input: [],
        output: [],
      },
      assessList: [],
      List: [],
    };
  },
  created() {
    this.getModalList();
  },
  methods: {
    // 获取编辑节点信息
    nodeInit(data, id, serveData) {
      this.type = "node";
      this.data = data;
      this.serveData = serveData;
      data.nodeList.filter((node) => {
        if (node.nodeId === id) {
          this.node = cloneDeep(node);
        }
      });
      const { name, type, tableName, assessTableId } = this.node;
      this.ruleForm.name = name;
      this.ruleForm.type = type;
      if (assessTableId != undefined) {
        this.ruleForm.assessTableId = assessTableId;
        this.ruleForm.tableName = tableName;
      }
    },
    // 获取模型下拉数据
    getModalList() {
      getqualityRulesTree().then((res) => {
        this.assessList = res.data.length ? res.data : [];
        if (this.ruleForm.assessTableId != undefined) {
          const { output } = this.node;
          this.ruleForm.output = output;
          this.assessSelect(this.ruleForm.assessTableId, output);
        }
      });
    },
    // 模型下拉选中事件
    assessSelect(val, output = []) {
      if (output.length == 0) {
        this.$refs["table"].clearSelection();
      }
      let node = {};
      this.assessList.forEach((item) => {
        if (item.id == val) {
          node = item;
        }
      });
      const { id, databaseName, tableName } = node;
      this.ruleForm.tableName = tableName;
      getColumnsByDataProcess({
        id,
        dataBase: databaseName,
        tables: tableName,
      }).then(res => {
        if (res.code == 200) {
          this.List = res.data;
          // 设置回显选中表格
          if (output && output.length > 0) {
            this.$nextTick(function () {
              for (let i = 0; i < output.length; i++) {
                const item = output[i];
                this.$refs["table"].toggleRowSelection(
                  this.List.find((tx) => {
                    return tx.dataName == item.dataName;
                  }),
                  true
                );
              }
            });
          } else {
            this.$refs["table"].clearSelection();
          }
        }
      })
      // getColumns({
      //   id,
      //   dataBase: databaseName,
      //   tables: tableName,
      // }).then((res) => {
      //   if (res.code == 200) {
      //     this.List = res.data.result;
      //     // 设置回显选中表格
      //     if (output && output.length > 0) {
      //       this.$nextTick(function () {
      //         for (let i = 0; i < output.length; i++) {
      //           const item = output[i];
      //           this.$refs["table"].toggleRowSelection(
      //             this.List.find((tx) => {
      //               return tx.COLUMN_NAME == item.COLUMN_NAME;
      //             }),
      //             true
      //           );
      //         }
      //       });
      //     } else {
      //       this.$refs["table"].clearSelection();
      //     }
      //   }
      // });
    },
    // 表格复选框选择事件
    handleSelectionChange(val) {
      this.ruleForm.output = val;
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 数据处理, 前端用(修改this.data)
          this.setData();
          // 数据处理成后端需要的结构
          this.setServeData();
          this.$message.success("设置成功");
          this.dialog = false;
        } else {
          return false;
        }
      });
    },
    // 返回
    async formCancel() {
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-content {
  display: flex;
  align-items: center;
  .title {
    width: 98px;
    text-align: right;
  }
  .container-table {
    width: calc(100% - 98px);
  }
}
</style>
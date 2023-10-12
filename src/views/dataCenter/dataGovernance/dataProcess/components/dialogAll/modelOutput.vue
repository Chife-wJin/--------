<template>
  <el-dialog
    title="模型输出"
    :visible.sync="dialog"
    :show-close="true"
    center
    width="1200px"
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
        <el-col :span="12">
          <el-form-item label="类型：" prop="type">
            <el-input v-model="ruleForm.type" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="输出目标：" prop="type">
            <el-radio v-model="ruleForm.isNew" label="1">输出到新模型</el-radio>
            <el-radio v-model="ruleForm.isNew" label="2">
              输出到已有模型
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="ruleForm.isNew == 1">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="outTableName" label="模型名称：">
              <el-input v-model="ruleForm.outTableName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <template v-if="ruleForm.isNew == 1">
      <el-table
        border
        :data="List"
        max-height="500"
        @selection-change="handleSelectionChange"
        class="container-table"
        ref="table"
      >
        <el-table-column type="selection" width="50px" />
        <el-table-column prop="dataName" label="字段名称" />
        <el-table-column label="字段类型">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.isEdit"
              v-model="scope.row.dataType"
              size="mini"
            />
            <span v-else>{{ scope.row.dataType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="字段长度">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.isEdit"
              v-model="scope.row.dataLength"
              size="mini"
            />
            <span v-else>{{ scope.row.dataLength }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小数点长度">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.isEdit"
              v-model="scope.row.dataPointLength"
              size="mini"
            />
            <span v-else>{{ scope.row.dataPointLength }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否为空">
          <template slot-scope="scope">
            <el-select
              v-if="!scope.row.isEdit"
              v-model="scope.row.dataNull"
              size="mini"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
            <span v-else>
              <span v-if="scope.row.dataNull == 0">是</span>
              <span v-if="scope.row.dataNull == 1">否</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="是否主键">
          <template slot-scope="scope">
            <el-select
              v-if="!scope.row.isEdit"
              v-model="scope.row.dataPk"
              size="mini"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
            <span v-else>
              <span v-if="scope.row.dataPk == 0">是</span>
              <span v-if="scope.row.dataPk == 1">否</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="对应的原始字段">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.isEdit"
              v-model="scope.row.detailsField"
              size="mini"
            />
            <span v-else>{{ scope.row.detailsField }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.isEdit"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" v-else @click="handleEdit(scope.row)"
              >确定</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
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
import { compileApi } from "@/api/dataCenter/dataGovernance";
export default {
  props: {
    isShow: {
      required: true,
      type: Boolean,
      default: false,
    },
    // 新增工程表单数据
    flowPathForm: {
      required: true,
      type: Object,
      default: () => {},
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
        outTableName: [
          { required: true, message: "请输入模型名称", trigger: "blur" },
        ],
      },
      ruleForm: {
        type: undefined,
        name: undefined,
        isNew: "1",
        outTableName: undefined,
      },
      assessList: [],
      List: [],
      output: [],
    };
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
      const { name, type } = this.node;
      this.ruleForm.name = name;
      this.ruleForm.type = type;
      // 如果没有编辑过当前节点从上个节点取数据
      // 如果编辑过当前节点直接从this.node中取数
      if (!this.node.output) {
        // 找出当前节点的入口节点, 将入口节点选中的字段拿过来
        const sourceList = [];
        this.data.lineList.forEach((item) => {
          if (item.to == this.node.nodeId) {
            sourceList.push(item.from);
          }
        });
        this.data.nodeList.forEach((item) => {
          if (sourceList.includes(item.nodeId)) {
            const { output } = item;
            this.List = output;
          }
        });
        // 初始化操作按钮状态
        this.List = this.List.map((item) => {
          return {
            ...item,
            isEdit: true,
          };
        });
      } else {
        this.List = this.node.output;
        this.$nextTick(() => {
          this.node.output.forEach((item) => {
            this.$refs["table"].toggleRowSelection(
              this.List.find((tx) => {
                return tx.dataName == item.dataName;
              }),
              true
            );
          });
        });
      }
      if (this.node.jsonObject) {
        const { isNew, outTableName } = JSON.parse(this.node.jsonObject);
        this.ruleForm.isNew = isNew || "1";
        this.ruleForm.outTableName = outTableName;
      }
    },
    // 表格复选框选择事件
    handleSelectionChange(val) {
      // 由于val返回的是原始的数据, 编辑改变表格数据不会在val中体现, 所以这里需要将新的数据赋值给output
      const dataNameList = [];
      val.forEach((item) => {
        dataNameList.push(item.dataName);
      });
      this.output = this.List.filter((item) => {
        return dataNameList.includes(item.dataName);
      });
    },
    // 编辑
    handleEdit(row) {
      row.isEdit = !row.isEdit;
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
          // 调用编译接口
          // this.$emit("compile", this.serveData);
          console.log(this.flowPathForm);
          const params = {
            name: this.flowPathForm.name,
            processClassificationId: 1,
            processDetails: this.serveData.processDetails,
          };
          const { code, data } = await compileApi(params);
          if (code == 200) {
            console.log(data);
          }
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
</style>
<template>
  <el-dialog
    title="横向链接"
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
          <el-form-item label="连接方式：" prop="connectType">
            <el-radio-group v-model="ruleForm.connectType">
              <el-radio-button label="1">内连接</el-radio-button>
              <el-radio-button label="2">左连接</el-radio-button>
              <el-radio-button label="3">右连接</el-radio-button>
              <el-radio-button label="4">全连接</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="tabs" type="card" @tab-click="handleClick">
      <el-tab-pane label="连接条件" name="1">
        <condition ref="condition" :data="data" :node="node" />
      </el-tab-pane>
      <el-tab-pane label="结果字段" name="2">
        <result ref="result" :data="data" :node="node" />
      </el-tab-pane>
    </el-tabs>
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
import condition from "./condition";
import result from "./result";
export default {
  components: {
    condition,
    result,
  },
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
        connectType: [
          { required: true, message: "请选择连接方式", trigger: "change" },
        ],
      },
      ruleForm: {
        type: undefined,
        name: undefined,
        connectType: undefined,
      },
      tabs: "1",
    };
  },
  created() {},
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
      // 初始化连接条件表格表头
      this.$refs["condition"].setTableColumn();
      // 初始化结果字段表格数据
      this.$refs["result"].setTableList();
      // 编辑时回显数据
      if (this.node.jsonObject) {
        this.ruleForm.connectType = JSON.parse(this.node.jsonObject).connectType;
        this.$refs["condition"].setTableList();
      }
      // 这里自动做一个tab切换, 防止在不切换tab就保存的情况下结果字段表格选中项丢失
      this.tabs = "2";
      this.$nextTick(() => {
        this.handleClick({ index: 1 });
        this.tabs = "1";
      });
    },
    // tab签切换
    handleClick(val) {
      if (val.index == 1) {
        // 编辑时选择已选表格项
        this.$refs["result"].setTableSelect();
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 数据处理, 前端用(修改this.data)
          this.setData();
          // 数据处理成后端需要的结构
          this.setServeData();
          // console.log(JSON.stringify(this.serveData.processDetails),JSON.stringify(this.serveData.lineList));
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
</style>
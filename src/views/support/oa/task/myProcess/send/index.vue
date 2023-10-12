<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="el-icon-document">发起任务</span>
        <el-button
          style="float: right"
          size="small"
          type="danger"
          @click="goBack"
          >关闭</el-button
        >
      </div>
      <el-tabs tab-position="top" v-model="activeName" @tab-click="handleClick">
        <!--表单信息-->
        <el-tab-pane label="表单信息" name="1">
          <!--初始化流程加载表单信息-->
          <el-col :span="24">
            <div class="test-form">
              <!-- 活表单 -->
              <parser
                v-if="Object.keys(formConf).length > 0"
                :key="new Date().getTime()"
                :form-conf="formConf"
                @submit="submitForm"
                ref="parser"
                @getData="getData"
              />
              <!-- 死表单 -->
              <form-example
                v-else-if="formUrl"
                ref="formRef"
                :showOnly="false"
                :currentFormUrl="formUrl"
                :btnIsShow="['submit']"
                :taskForm="ids"
                :flowKey="this.ids.flowKey"
              />
            </div>
          </el-col>
        </el-tab-pane>
        <!--流程图-->
        <el-tab-pane label="流程图" name="2">
          <flow :flowData="flowData" />
        </el-tab-pane>
      </el-tabs>
      <!--选择流程接收人-->
      <el-dialog
        :title="taskTitle"
        :visible.sync="taskOpen"
        width="65%"
        append-to-body
      >
        <flow-user
          v-if="checkSendUser"
          :checkType="checkType"
          @handleUserSelect="handleUserSelect"
        />
        <flow-role v-if="checkSendRole" @handleRoleSelect="handleRoleSelect" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="taskOpen = false">取 消</el-button>
          <el-button type="primary" @click="submitTask">提 交</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Parser from "@/views/support/oa/components/parser/Parser";
import { definitionStart, flowXmlAndNode } from "@/api/oa/flowable/definition";
import flow from "./flow";
import {
  flowFormData,
  getFlowData,
  submitFlowLive,
} from "@/api/oa/task/myProcess";
import {
  getNextFlowNodeByStart,
  getNextDeathFlowNodeByStart,
} from "@/api/oa/task/todo";
import { flowTaskForm } from "@/api/oa/task/todo";
import FlowUser from "@/views/support/oa/components/flow/User";
import FlowRole from "@/views/support/oa/components/flow/Role";
import formExample from "@/views/support/oa/components/formExample";
import Bus from "@/utils/vueBus";

export default {
  name: "Record",
  components: {
    Parser,
    flow,
    FlowUser,
    FlowRole,
    formExample,
  },
  props: {
    ids: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 模型xml数据
      flowData: {},
      activeName: "1", // 切换tab标签
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        deptId: undefined,
      },
      // 遮罩层
      loading: true,
      deployId: "", // 流程定义编号, 模型唯一id
      procDefId: "", // 流程名称, 流程唯一id, 会生成多个procInsId实例
      procInsId: "", // 流程实例编号, 流程实例id
      taskId: "", // 流程id, 流程走到了哪一步
      formConf: {}, // 默认表单数据
      formUrl: "", // 写死表单组件文件地址
      variables: [], // 流程变量数据
      taskTitle: null,
      taskOpen: false,
      checkSendUser: false, // 是否展示人员选择模块
      checkSendRole: false, // 是否展示角色选择模块
      checkType: "", // 选择类型
      checkValues: null, // 选中任务接收人员数据
      formData: {}, // 填写的表单数据,
      queryParamsData: {}, // 死表单数据
      multiInstanceVars: "", // 会签节点
    };
  },
  created() {
    Bus.$off("ProcessSuccess");
    this.deployId = this.ids && this.ids.deployId;
    // 初始化表单
    this.procDefId = this.ids && this.ids.procDefId;
    // this.getNextFlowNodeByStart(this.deployId);
    if (this.ids.taskId) {
      // 点击详情回显
      this.taskId = this.ids && this.ids.taskId;
      // this.getFlowData();
      // 死表单只获取 formKeyExist, formType, formUrl 三个字段, 具体表单详情数据在业务表单页面调用
      this.getFlowData2(this.ids.taskId, this.ids.deployId);
    } else {
      // 点击发起流程获取表单
      this.getFlowFormData(this.deployId);
    }
  },
  mounted() {
    Bus.$on("ProcessSuccess", () => {
      this.goBack();
    });
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "2") {
        flowXmlAndNode({ deployId: this.deployId }).then((res) => {
          this.flowData = res.data;
        });
      }
    },
    /** 流程表单数据 */
    getFlowFormData(deployId) {
      const that = this;
      const params = { deployId: deployId };
      flowFormData(params)
        .then((res) => {
          const { code, data } = res;
          if (code == 200) {
            // formType 0动态表单 1写死表单
            if (data.formType == 0) {
              // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
              that.formConf = data;
              that.formUrl = "";
            } else if (data.formType == 1) {
              that.formConf = {};
              that.formUrl = data.formUrl;
            }
          }
        })
        .catch((res) => {
          this.goBack();
        });
    },
    /** 流程节点表单 */
    async getFlowData2(taskId, deployId) {
      if (taskId && deployId) {
        const { code, data } = await flowTaskForm({
          deployId: deployId,
          taskId: taskId,
        });
        if (code == 200) {
          if (data.formData && data.formData.formType == 0) {
            this.formConf = data.formData;
            this.formUrl = "";
          } else if (data.formType == 1) {
            this.formUrl = data.formUrl;
            this.formConf = {};
            this.$nextTick(() => {
              this.$refs["formRef"].getInfo();
            });
          }
        }
      }
    },
    /** 流程表单数据, 点击详情进来需要回显 */
    getFlowData() {
      getFlowData({
        deployId: this.deployId,
        taskId: this.taskId,
        procInsId: this.ids.procInsId,
      }).then((res) => {
        const { code, data } = res;
        if (code == 200) {
          if (data.data.formData && data.data.formData.formType == 0) {
            this.formConf = data.data.formData;
            this.formUrl = "";
          } else if (data.data.formType == 1) {
            this.formUrl = data.data.formUrl;
            this.queryParamsData = { ...data.bean };
            this.formConf = {};
          }
        }
      });
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      // this.$store.dispatch("tagsView/delView", this.$route);
      // this.$router.go(-1)
      const params = {
        is: "list",
      };
      this.$emit("cut", params);
    },
    /** 接收子组件传的值 */
    getData(data) {
      if (data) {
        const variables = [];
        data.fields.forEach((item) => {
          let variableData = {};
          variableData.label = item.__config__.label;
          // 表单值为多个选项时
          if (item.__config__.defaultValue instanceof Array) {
            const array = [];
            item.__config__.defaultValue.forEach((val) => {
              array.push(val);
            });
            variableData.val = array;
          } else {
            variableData.val = item.__config__.defaultValue;
          }
          variables.push(variableData);
        });
        this.variables = variables;
      }
    },
    /** 申请流程表单数据提交 */
    submitForm(formData) {
      // 根据当前任务或者流程设计配置的下一步节点 todo 暂时未涉及到考虑网关、表达式和多节点情况
      const { valData } = formData;
      // formType = 1 死表单
      // if (valData.formType && valData.formType == 1) {
      //   // 死表单提交保存
      //   getNextDeathFlowNodeByStart(valData).then((res) => {
      //     // 死表单保存成功后调用活表单保存接口以及启动流程接口, 因为死表单保存接口是后加的没在流程内, 所以调用一下之前的接口确保流程没问题
      //     this.nextSave(formData);
      //   });
      // } else {
      //   this.nextSave(formData);
      // }
      this.submit(formData);
    },
    /** 三个接口合并, 活表单保存并启动流程 */
    submit(formData) {
      const { valData } = formData;
      let params = {};
      if (formData.formData?.formType == 0) {
        // 活表单保存, 死表单在对应的表单页面保存
        params = {
          deploymentId: this.deployId,
          procDefId: this.procDefId,
          flowKey: this.ids.flowKey,
          variables: {
            ...formData.formData,
            ...formData.valData,
          },
        };
      }
      submitFlowLive(params).then((res) => {
        const { code } = res;
        if (code == 200) {
          this.$message.success(res.msg);
          this.goBack();
        }
      });
    },
    /** 活表单保存以及启动流程 */
    nextSave(formData) {
      getNextFlowNodeByStart({
        deploymentId: this.deployId,
        variables: formData.valData,
      }).then((res) => {
        const data = res.data;
        if (data) {
          this.formData = formData;
          if (data.dataType === "dynamic") {
            if (data.type === "assignee") {
              // 指定人员
              this.checkSendUser = true;
              this.checkType = "single";
            } else if (data.type === "candidateUsers") {
              // 候选人员(多个)
              this.checkSendUser = true;
              this.checkType = "multiple";
            } else if (data.type === "candidateGroups") {
              // 指定组(所属角色接收任务)
              this.checkSendRole = true;
            } else {
              // 会签
              // 流程设计指定的 elementVariable 作为会签人员列表
              this.multiInstanceVars = data.vars;
              this.checkSendUser = true;
              this.checkType = "multiple";
            }
            this.taskOpen = true;
            this.taskTitle = "选择任务接收";
          } else {
            const variables = this.formData.valData;
            const formData = this.formData.formData;
            if (formData) {
              formData.disabled = true;
              formData.formBtns = false;
            }
            if (this.procDefId) {
              variables.variables = formData;
              // 启动流程并将表单数据加入流程变量
              definitionStart(this.procDefId, JSON.stringify(variables)).then(
                (res) => {
                  this.$message.success(res.msg);
                  this.goBack();
                }
              );
            }
          }
        }
      });
    },
    /** 提交流程 */
    submitTask() {
      if (!this.checkValues && this.checkSendUser) {
        this.$message.error("请选择任务接收!");
        return;
      }
      if (!this.checkValues && this.checkSendRole) {
        this.$message.error("请选择流程接收角色组!");
        return;
      }
      if (this.formData) {
        const variables = this.formData.valData;
        const formData = this.formData.formData;
        // 表单是否禁用
        formData.disabled = true;
        // 是否显示按钮
        formData.formBtns = false;
        variables.variables = formData;
        if (this.multiInstanceVars) {
          this.$set(variables, this.multiInstanceVars, this.checkValues);
        } else {
          this.$set(variables, "approval", this.checkValues);
        }
        console.log(variables, "流程发起提交表单数据");
        // 启动流程并将表单数据加入流程变量
        definitionStart(this.procDefId, JSON.stringify(variables)).then(
          (res) => {
            this.$message.success(res.msg);
            this.goBack();
          }
        );
      }
    },
    /** 根据当前任务获取流程设计配置的下一步节点 */
    getNextFlowNodeByStart(deploymentId, variables) {
      // 根据当前任务或者流程设计配置的下一步节点 todo 暂时未涉及到考虑网关、表达式和多节点情况
      getNextFlowNodeByStart({
        deploymentId: deploymentId,
        variables: variables,
      }).then((res) => {
        const data = res.data;
        if (data) {
          if (data.type === "assignee") {
            // 指定人员
            this.checkSendUser = true;
            this.checkType = "single";
          } else if (data.type === "candidateUsers") {
            // 候选人员(多个)
            this.checkSendUser = true;
            this.checkType = "multiple";
          } else if (data.type === "candidateGroups") {
            // 指定组(所属角色接收任务)
            this.checkSendRole = true;
          } else if (data.type === "multiInstance") {
            // 会签?
            // 流程设计指定的 elementVariable 作为会签人员列表
            this.multiInstanceVars = data.vars;
            this.checkSendUser = true;
            this.checkType = "multiple";
          }
        }
      });
    },
    // 用户信息选中数据
    handleUserSelect(selection) {
      if (selection) {
        if (selection instanceof Array) {
          const selectVal = selection.map((item) => item.userId);
          if (this.multiInstanceVars) {
            this.checkValues = selection;
          } else {
            this.checkValues = selectVal.join(",");
          }
        } else {
          this.checkValues = selection.userId;
        }
      }
    },
    // 角色信息选中数据
    handleRoleSelect(selection) {
      if (selection) {
        if (selection instanceof Array) {
          const selectVal = selection.map((item) => item.roleId);
          this.checkValues = selectVal.join(",");
        } else {
          this.checkValues = selection;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  height: 500px;
  padding: 15px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.my-label {
  background: #e1f3d8;
}
</style>

<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="el-icon-document">已办任务</span>
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
          <el-col :span="24" v-if="variableOpen">
            <div class="test-form">
              <parser
                v-if="Object.keys(variablesData).length"
                :key="new Date().getTime()"
                :form-conf="variablesData"
              />
              <form-example
                v-else-if="formUrl"
                ref="formRef"
                :showOnly="false"
                :taskForm="taskForm"
                :btnIsShow="[]"
                :currentFormUrl="formUrl"
              />
            </div>
          </el-col>
        </el-tab-pane>
        <!--流程流转记录-->
        <!-- <el-tab-pane label="流转记录" name="2">
          <el-col :span="16" :offset="4">
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in flowRecordList"
                  :key="index"
                  :icon="setIcon(item.finishTime)"
                  :color="setColor(item.finishTime)"
                >
                  <p style="font-weight: 700">{{ item.taskName }}</p>
                  <el-card :body-style="{ padding: '10px' }">
                    <el-descriptions
                      class="margin-top"
                      :column="1"
                      size="small"
                      border
                    >
                      <el-descriptions-item
                        v-if="item.assigneeName"
                        label-class-name="my-label"
                      >
                        <template slot="label"
                          ><i class="el-icon-user"></i>办理人</template
                        >
                        {{ item.assigneeName }}
                        <el-tag type="info" size="small">{{
                          item.deptName
                        }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.candidate"
                        label-class-name="my-label"
                      >
                        <template slot="label"
                          ><i class="el-icon-user"></i>候选办理</template
                        >
                        {{ item.candidate }}
                      </el-descriptions-item>
                      <el-descriptions-item label-class-name="my-label">
                        <template slot="label"
                          ><i class="el-icon-date"></i>接收时间</template
                        >
                        {{ item.createTime }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.finishTime"
                        label-class-name="my-label"
                      >
                        <template slot="label"
                          ><i class="el-icon-date"></i>处理时间</template
                        >
                        {{ item.finishTime }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.duration"
                        label-class-name="my-label"
                      >
                        <template slot="label"
                          ><i class="el-icon-time"></i>耗时</template
                        >
                        {{ item.duration }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        v-if="item.comment"
                        label-class-name="my-label"
                      >
                        <template slot="label"
                          ><i class="el-icon-tickets"></i>处理意见</template
                        >
                        {{ item.comment.comment }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
        </el-tab-pane> -->
        <el-tab-pane label="流转记录" name="3">
          <flow :flowData="flowData" />
          <process-detail :flowRecordList="flowRecordList" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { flowRecord } from "@/api/oa/task/finished";
import Parser from "@/views/support/oa/components/parser/Parser";
import { flowXmlAndNode } from "@/api/oa/flowable/definition";
import { getFlowData } from "@/api/oa/task/myProcess";
import {
  flowTaskForm,
} from "@/api/oa/task/todo";
import flow from "@/views/support/oa/task/finished/detail/flow";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import formExample from "@/views/support/oa/components/formExample";
import processDetail from "@/views/support/oa/components/processDetail";

export default {
  name: "Record",
  components: {
    Parser,
    flow,
    formExample,
    processDetail,
  },
  props: {
    params: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 模型xml数据
      flowData: {},
      activeName: "1",
      // 用户表格数据
      userList: null,
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
      flowRecordList: [], // 流程流转数据
      formConfCopy: {},
      src: null,
      taskForm: {
        multiple: false,
        comment: "", // 意见内容
        procInsId: "", // 流程实例编号
        instanceId: "", // 流程实例编号
        deployId: "", // 流程定义编号
        taskId: "", // 流程任务编号
        procDefId: "", // 流程编号
        vars: "",
        targetKey: "",
      },
      formData: {}, // 表单回显
      variables: [], // 流程变量数据
      variablesData: {}, // 流程变量数据
      formUrl: "", // 写死表单组件文件地址
      variableOpen: false, // 是否加载流程变量数据
    };
  },
  created() {
    this.taskForm.deployId = this.params && this.params.deployId;
    this.taskForm.taskId = this.params && this.params.taskId;
    this.taskForm.procInsId = this.params && this.params.procInsId;
    // 回显流程记录
    // 流程任务重获取变量表单
    if (this.taskForm.taskId) {
      // this.processVariables(this.taskForm.taskId);
      this.processVariables2(this.taskForm.taskId, this.taskForm.deployId);
    }
    this.getFlowRecordList(this.taskForm.procInsId, this.taskForm.deployId);
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "3") {
        flowXmlAndNode({
          procInsId: this.taskForm.procInsId,
          deployId: this.taskForm.deployId,
        }).then((res) => {
          this.flowData = res.data;
        });
      }
    },
    setIcon(val) {
      if (val) {
        return "el-icon-check";
      } else {
        return "el-icon-time";
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418";
      } else {
        return "#b3bdbb";
      }
    },
    /** 流程流转记录 */
    getFlowRecordList(procInsId, deployId) {
      const that = this;
      const params = { procInsId: procInsId, deployId: deployId };
      flowRecord(params)
        .then((res) => {
          that.flowRecordList = res.data.flowList;
        })
        .catch((res) => {
          this.goBack();
        });
    },
    /** 获取流程变量内容 */
    async processVariables2(taskId, deployId) {
      if (taskId && deployId) {
        const { code, data } = await flowTaskForm({
          deployId: deployId,
          taskId: taskId,
        });
        if (code == 200) {
          if (data.formData && data.formData.formType == 0) {
            this.variablesData = data.formData;
            this.formUrl = "";
            this.variableOpen = true;
          } else if (data.formType == 1) {
            this.formUrl = data.formUrl;
            this.variableOpen = true;
            this.variablesData = {};
            this.$nextTick(() => {
              this.$refs["formRef"].getInfo();
            });
          }
        }
      }
    },
    /** 获取流程变量内容 */
    processVariables(taskId) {
      if (taskId) {
        // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
        getFlowData({
          deployId: this.taskForm.deployId,
          taskId: this.taskForm.taskId,
          procInsId: this.taskForm.procInsId,
        }).then((res) => {
          const { code, data } = res;
          if (code == 200) {
            if (data.data.formData && data.data.formData.formType == 0) {
              this.variablesData = data.data.formData;
              this.variableOpen = true;
              this.formUrl = "";
            } else if (data.data.formType == 1) {
              this.formUrl = data.data.formUrl;
              this.formData = { ...data.bean };
              this.variableOpen = true;
              this.variablesData = {};
            }
          }
        });
      }
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      // this.$store.dispatch("tagsView/delView", this.$route);
      // this.$router.go(-1)
      this.$emit("cut", { is: "list" });
    },
  },
};
</script>
<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 100%;
  height: 100%;
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
::v-deep .el-card__body {
  height: calc(100vh - 178px);
  .el-tabs  {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 55px);
    overflow-y: auto;
    .el-tab-pane {
      height: 100%;
      .el-col {
        height: 100%;
      }
    }
  }
}
</style>

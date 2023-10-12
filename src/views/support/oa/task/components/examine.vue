<template>
  <div>
    <!--审批任务-->
    <el-dialog
      :title="completeTitle"
      :visible.sync="completeOpen"
      width="60%"
      append-to-body
    >
      <el-form ref="taskForm" :model="taskForm">
        <el-form-item prop="targetKey">
          <flow-user
            v-if="checkSendUser"
            :checkType="checkType"
            @handleUserSelect="handleUserSelect"
          ></flow-user>
          <flow-role
            v-if="checkSendRole"
            @handleRoleSelect="handleRoleSelect"
          ></flow-role>
        </el-form-item>
        <el-form-item
          label="是否通过"
          label-width="80px"
          prop="pass"
          :rules="[
            { required: true, message: '请选择是否通过', trigger: 'change' },
          ]"
        >
          <el-radio v-model="taskForm.pass" :label="1">通过</el-radio>
          <el-radio v-model="taskForm.pass" :label="0">驳回</el-radio>
        </el-form-item>
        <el-form-item
          label="处理意见"
          label-width="80px"
          prop="comment"
          :rules="[
            { required: true, message: '请输入处理意见', trigger: 'blur' },
          ]"
        >
          <el-input
            type="textarea"
            v-model="taskForm.comment"
            placeholder="请输入处理意见"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="completeOpen = false">取 消</el-button>
        <el-button type="primary" @click="taskComplete">确 定</el-button>
      </span>
    </el-dialog>
    <!--退回流程-->
    <el-dialog
      :title="returnTitle"
      :visible.sync="returnOpen"
      width="40%"
      append-to-body
    >
      <el-form ref="taskForm" :model="taskForm" label-width="80px">
        <el-form-item label="退回节点" prop="targetKey">
          <el-radio-group v-model="taskForm.targetKey">
            <el-radio-button
              v-for="item in returnTaskList"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="退回意见"
          prop="comment"
          :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]"
        >
          <el-input
            style="width: 50%"
            type="textarea"
            v-model="taskForm.comment"
            placeholder="请输入意见"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnOpen = false">取 消</el-button>
        <el-button type="primary" @click="taskReturn">确 定</el-button>
      </span>
    </el-dialog>
    <!--驳回流程-->
    <el-dialog
      :title="rejectTitle"
      :visible.sync="rejectOpen"
      width="40%"
      append-to-body
    >
      <el-form ref="taskForm" :model="taskForm" label-width="80px">
        <el-form-item
          label="驳回意见"
          prop="comment"
          :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]"
        >
          <el-input
            style="width: 50%"
            type="textarea"
            v-model="taskForm.comment"
            placeholder="请输入意见"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectOpen = false">取 消</el-button>
        <el-button type="primary" @click="taskReject">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 转办流程 -->
    <el-dialog
      :title="transferTitle"
      :visible.sync="transferOpen"
      width="60%"
      append-to-body
    >
      <el-form ref="taskForm" :model="taskForm" label-width="108px">
        <el-form-item label="当前环节" prop="currentKey">
          <el-input v-model="currentKey" disabled style="width: 100%" />
        </el-form-item>
        <el-form-item
          label="目标环节"
          prop="targetKey"
          :rules="[
            { required: true, message: '请选择目标环节', trigger: 'change' },
          ]"
        >
          <el-select v-model="taskForm.targetKey" clearable style="width: 100%">
            <el-option
              v-for="(item, index) in targetList"
              :key="index"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          prop="comment"
          :rules="[
            { required: true, message: '请选择处理人', trigger: 'change' },
          ]"
        >
          <template slot="label">
            <span title="若不选择处理人，则有流程自动分配">
              处理人
              <svg-icon icon-class="wenhao" class="icon" />
            </span>
          </template>
          <user-tree
            :treeValue.sync="taskForm.comment"
            :options="treeList"
            :multiple="true"
          />
        </el-form-item> -->
        <el-form-item
          label="跳转原因"
          prop="comment"
          :rules="[
            { required: true, message: '请选择处理人', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="taskForm.comment"
            type="textarea"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferOpen = false">取 消</el-button>
        <el-button type="primary" @click="taskTransfer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FlowUser from "@/views/support/oa/components/flow/User";
import FlowRole from "@/views/support/oa/components/flow/Role";
// import UserTree from "@/components/UserTree";
import { getTreeList, getNodeKey, transfer } from "@/api/oa/task/examine";
import Bus from "@/utils/vueBus";
import {
  complete,
  rejectTask,
  returnList,
  returnTask,
  getNextFlowNode,
  // delegate,
  // flowTaskForm,
} from "@/api/oa/task/todo";
export default {
  name: "Examine",
  props: {
    // 审核意见弹窗内的form表单字段
    taskForm: {
      // required: true,
      type: Object,
      default: () => {},
    },
  },
  components: {
    FlowUser,
    FlowRole,
    // UserTree,
  },
  data() {
    return {
      completeTitle: null,
      completeOpen: false,
      returnTitle: null,
      returnOpen: false,
      rejectOpen: false,
      rejectTitle: null,
      transferTitle: null,
      transferOpen: false,
      checkSendUser: false, // 是否展示人员选择模块
      checkSendRole: false, // 是否展示角色选择模块
      checkType: "single", // 选择类型
      returnTaskList: [], // 回退列表数据
      currentKey: undefined, // 当前节点
      targetList: [], // 目标节点数组
      treeList: [], // 处理人树数据
    };
  },

  methods: {
    /** 初始化表单 */
    resetForm() {
      this.$nextTick(() => {
        this.resetFieldsTap("taskForm");
      });
    },
    /** 加载审批任务弹框 */
    handleComplete() {
      this.completeOpen = true;
      this.completeTitle = "流程审批";
      this.resetForm();
    },
    /** 用户审批任务 */
    taskComplete() {
      if (!this.taskForm.variables && this.checkSendUser) {
        this.$message.warning("请选择流程接收人员!");
        return;
      }
      if (!this.taskForm.variables && this.checkSendRole) {
        this.$message.warning("请选择流程接收角色组!");
        return;
      }
      if (!this.taskForm.comment) {
        this.$message.warning("请输入审批意见!");
        return;
      }
      if (this.taskForm.formData && this.formKeyExist) {
        // 表单是否禁用
        this.taskForm.formData.formData.disabled = true;
        // 是否显示按钮
        this.taskForm.formData.formData.formBtns = false;
        this.taskForm.variables = Object.assign(
          {},
          this.taskForm.variables,
          this.taskForm.formData.valData
        );
        this.taskForm.variables.variables = this.taskForm.formData.formData;
        complete(this.taskForm).then((response) => {
          this.$message.success(response.msg);
          Bus.$emit("goBack");
        });
      } else {
        // 流程设计人员类型配置为固定人员接收任务时,直接提交任务到下一步
        this.taskForm.variables.pass = this.taskForm.pass;
        complete(this.taskForm).then((response) => {
          this.$message.success(response.msg);
          Bus.$emit("goBack");
        });
      }
    },
    /** 可退回任务列表弹窗 */
    handleReturn() {
      this.returnOpen = true;
      this.returnTitle = "退回流程";
      returnList(this.taskForm).then((res) => {
        this.returnTaskList = res.data;
        this.taskForm.variables = null;
      });
    },
    /** 提交退回任务 */
    taskReturn() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          returnTask(this.taskForm).then((res) => {
            this.$message.success(res.msg);
            Bus.$emit("goBack");
          });
        }
      });
    },
    /** 提交驳回任务 */
    taskReject() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          rejectTask(this.taskForm).then((res) => {
            this.$message.success(res.msg);
            Bus.$emit("goBack");
          });
        }
      });
    },
    /** 委派任务 */
    handleDelegate() {
      this.taskForm.delegateTaskShow = true;
      this.taskForm.defaultTaskShow = false;
    },
    /** 转办任务 */
    handleAssign() {
      this.transferTitle = "转办任务";
      this.getData();
    },
    /** 获取转办任务处理人下拉框数据以及节点数据 */
    async getData() {
      const { code: code1, data: data1 } = await getNodeKey({
        taskId: this.taskForm.taskId,
      });
      if (code1 == 200) {
        this.currentKey = data1.index;
        this.targetList = data1.next;
        this.transferOpen = true;
        this.resetForm();
      }
      // 转办任务处理人下拉框数据-魏桥项目后台已经有这个接口了, 要用的话后台去找一下
      // const { code, data } = await getTreeList();
      // if (code == 200) {
      //   this.setList(data);
      //   this.treeList = data;
      // }
    },
    // 如果没有子节点清除children字段
    setList(treeData) {
      treeData.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.setList(item.children);
        } else {
          delete item.children;
        }
      });
    },
    taskTransfer() {
      this.$refs["taskForm"].validate(async (valid) => {
        if (valid) {
          const { code } = await transfer(this.taskForm);
          if (code == 200) {
            this.$message.success("转办成功");
            this.transferOpen = false;
            this.$router.go(-1);
          }
        }
      });
    },
    /** 驳回任务弹窗 */
    handleReject() {
      this.rejectOpen = true;
      this.rejectTitle = "驳回流程";
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  margin: 0px;
  cursor: pointer;
}
</style>
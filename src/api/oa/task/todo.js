// 待办任务页面 api
import {
  getAction,
  postForm,
  put,
  del,
} from '@/api/manage';
const path = process.env.VUE_APP_FLOWABLE_API;

// 查询待办任务列表
const todoList = params => getAction(path + `/center/flowable/task/todoList`, params);

// 完成任务
const complete = data => postForm(path + `/center/flowable/task/complete`, data);

// 委派任务
const delegate = data => postForm(path + `/center/flowable/task/delegate`, data);

// 退回任务
const returnTask = data => postForm(path + `/center/flowable/task/return`, data);

// 驳回任务
const rejectTask = data => postForm(path + `/center/flowable/task/reject`, data);

// 可退回任务列表
const returnList = data => postForm(path + `/center/flowable/task/returnList`, data);

// 下一节点
const getNextFlowNode = data => postForm(path + `/center/flowable/task/nextFlowNode`, data);

// 下一节点 活表单
const getNextFlowNodeByStart = data => postForm(path + `/center/flowable/task/nextFlowNodeByStart`, data);

// 下一节点 死表单
const getNextDeathFlowNodeByStart = data => postForm(path + `/center/testAudit/save`, data);


// 部署流程实例
const deployStart = deployId => getAction(path + `/center/flowable/process/startFlow/${deployId}`);

// 查询流程定义详细
const getDeployment = id => getAction(path + `/center/system/deployment/${id}`);

// 新增流程定义
const addDeployment = data => postForm(path + `/center/system/deployment`, data);

// 修改流程定义
const updateDeployment = data => put(path + `/center/system/deployment`, {}, data);

// 删除流程定义
const delDeployment = id => del(path + `/center/system/deployment/${id}`);

// 导出流程定义
const exportDeployment = params => getAction(path + `/center/system/deployment/export`, params);

// 流程节点表单
const flowTaskForm = params => getAction(path + `/center/flowable/task/flowTaskForm`, params);

export {
  todoList,
  complete,
  delegate,
  returnTask,
  rejectTask,
  returnList,
  getNextFlowNode,
  getNextFlowNodeByStart,
  getNextDeathFlowNodeByStart,
  deployStart,
  getDeployment,
  addDeployment,
  updateDeployment,
  delDeployment,
  exportDeployment,
  flowTaskForm,
}
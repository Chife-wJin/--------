// 我的流程页面 api
import {
  getAction,
  postForm,
  put,
  del,
} from '@/api/manage';
const path = process.env.VUE_APP_FLOWABLE_API;
const pathDemo = process.env.VUE_APP_DEMO_API;

// 我的发起的流程
const myProcessList = params => getAction(path + `/center/flowable/task/myProcess`, params);

// 发起流程回显
const getFlowData = params => getAction(pathDemo + `/center/oa/getNodeById`, params);

const flowFormData = params => getAction(path + `/center/flowable/task/flowFormData`, params);

// 完成任务
const complete = data => postForm(path + `/center/flowable/task/complete`, data);

// 取消申请
const stopProcess = data => postForm(path + `/center/flowable/task/stopProcess`, data);

// 驳回任务
const rejectTask = data => postForm(path + `/center/flowable/task/reject`, data);

// 可退回任务列表
const returnList = data => postForm(path + `/center/flowable/task/returnList`, data);

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

// 发起流程保存并提交活表单
const submitFlowLive = params => postForm(path + `/center/flowable/definition/submit`, params);

export {
  myProcessList,
  getFlowData,
  flowFormData,
  complete,
  stopProcess,
  rejectTask,
  returnList,
  deployStart,
  getDeployment,
  addDeployment,
  updateDeployment,
  delDeployment,
  exportDeployment,
  submitFlowLive,
}
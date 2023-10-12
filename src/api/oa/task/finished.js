// 我的流程页面 api
import {
  getAction,
  postForm,
  put,
  del,
} from '@/api/manage';
const path = process.env.VUE_APP_FLOWABLE_API;


// 查询已办任务列表
const finishedList = params => getAction(path + `/center/flowable/task/finishedList`, params);

// 任务流转记录
const flowRecord = params => getAction(path + `/center/flowable/task/flowRecord`, params);

// 撤回任务
const revokeProcess = data => postForm(path + `/center/flowable/task/revokeProcess`, data);

// 部署流程实例
const deployStart = deployId => getAction(path + `/center/flowable/process/startFlow/` + deployId);

// 查询流程定义详细
const getDeployment = id => getAction(path + `/center/system/deployment/` + id);

// 新增流程定义
const addDeployment = data => postForm(path + `/center/system/deployment`, data);

// 修改流程定义
const updateDeployment = data => put(path + `/center/system/deployment`, {}, data);

// 删除流程定义
const delDeployment = id => del(path + `/center/flowable/instance/delete/` + id);

// 导出流程定义
const exportDeployment = params => getAction(path + `/center/system/deployment/export`, params);

export {
  finishedList,
  flowRecord,
  revokeProcess,
  deployStart,
  getDeployment,
  addDeployment,
  updateDeployment,
  delDeployment,
  exportDeployment,
}
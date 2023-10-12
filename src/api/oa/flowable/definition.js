// 流程管理页面 api

import {
  getAction,
  postForm,
  put,
  del,
} from '@/api/manage';
const path = process.env.VUE_APP_FLOWABLE_API;

// 查询流程定义列表
const listDefinition = params => getAction(path + `/center/flowable/definition/list`, params);

// 部署流程实例
const definitionStart = (procDefId, data) => postForm(path + '/center/flowable/definition/start/' + procDefId, data, "application/json");

// 获取流程变量
const getProcessVariables = taskId => getAction(path + '/center/flowable/task/processVariables/' + taskId);

// 激活/挂起流程
const updateState = params => put(path + '/center/flowable/definition/updateState', params, {});

// 指定流程办理人员列表
const userList = params => getAction(path + '/center/flowable/definition/userList', params);

// 指定流程办理组列表
const roleList = params => getAction(path + '/center/flowable/definition/roleList', params);

// 指定流程表达式
const expList = params => getAction(path + '/center/flowable/definition/expList', params);

// 读取xml文件
const readXml = (deployId) => getAction(path + '/center/flowable/definition/readXml/' + deployId);

// 读取image文件
const readImage = (deployId) => getAction(path + '/center/flowable/definition/readImage/' + deployId);

// 获取流程执行节点
const getFlowViewer = (procInsId, executionId) => getAction(path + '/center/flowable/task/flowViewer/' + procInsId + '/' + executionId);

// 流程节点数据
const flowXmlAndNode = (params) => getAction(path + '/center/flowable/task/flowXmlAndNode', params);

// 读取xml文件
const saveXml = (data) => postForm(path + '/center/flowable/definition/save', data);

// 新增流程定义
const addDeployment = (data) => postForm(path + '/center/system/deployment', data);

// 修改流程定义
const updateDeployment = (data) => put(path + '/center/system/deployment', {}, data);

// 删除流程定义
const delDeployment = (deployId) => del(path + '/center/flowable/definition/' + deployId);

// 导出流程定义
const exportDeployment = (params) => getAction(path + '/center/system/deployment/export', params);

export {
  listDefinition,
  definitionStart,
  getProcessVariables,
  updateState,
  userList,
  roleList,
  expList,
  readXml,
  readImage,
  getFlowViewer,
  flowXmlAndNode,
  saveXml,
  addDeployment,
  updateDeployment,
  delDeployment,
  exportDeployment,
}
// demo样例页面api
import {
  getAction,
  postForm,
} from '@/api/manage';
const path = process.env.VUE_APP_DEMO_API;

// 查询流程表单列表
const getFormList = params => getAction(path + `/center/oa/page`, params);

// 删除流程表单列表
const delFormList = params => getAction(path + `/center/oa/delete`, params);

// 发起流程保存并提交死表单
const submitFlow = params => postForm(path + `/center/oa/submit`, params);

// 发起流程保存不提交
const saveFlow = params => postForm(path + `/center/oa/save`, params);

// 代办已办页面获取表单详情
const getNodeById = params => getAction(path + `/center/oa/getNodeById`, params);;

export {
  getFormList,
  delFormList,
  submitFlow,
  saveFlow,
  getNodeById,
}
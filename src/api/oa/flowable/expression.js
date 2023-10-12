
// 流程表达式页面 api
import {
  getAction,
  postForm,
  put,
  del,
} from '@/api/manage';
const path = process.env.VUE_APP_FLOWABLE_API;

// 查询流程达式列表
const listExpression = params => getAction(path + `/center/system/expression/list`, params);

// 查询流程达式详细
const getExpression = id => getAction(path + `/center/system/expression/${id}`);

// 新增流程达式
const addExpression = data => postForm(path + `/center/system/expression`, data);

// 修改流程达式
const updateExpression = data => put(path + `/center/system/expression`, {}, data);

// 删除流程达式
const delExpression = id => del(path + `/center/system/expression/${id}`);

export {
  listExpression,
  getExpression,
  addExpression,
  updateExpression,
  delExpression,
}
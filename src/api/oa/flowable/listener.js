// 流程监听页面 api
import {
  getAction,
  postForm,
  put,
  del,
} from '@/api/manage';
const path = process.env.VUE_APP_FLOWABLE_API;

// 查询流程定义列表
const listListener = params => getAction(path + `/center/system/listener/list`, params);

// 查询流程监听详细
const getListener = id => getAction(path + `/center/system/listener/` + id);

// 新增流程监听
const addListener = data => postForm(path + `/center/system/listener`, data);

// 修改流程监听
const updateListener = data => put(path + `/center/system/listener`, {}, data);

// 删除流程监听
const delListener = id => del(path + `/center/system/listener/${id}`);

export {
  listListener,
  getListener,
  addListener,
  updateListener,
  delListener,
}
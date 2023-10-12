// 拖拉拽流程页面 api
import {
  getAction,
  postForm,
  put,
  del,
} from '@/api/manage';
const path = process.env.VUE_APP_FLOWABLE_API;

// 查询流程表单列表
const listForm = params => getAction(path + `/center/flowable/form/list`, params);

const listAllForm = params => getAction(path + `/center/flowable/form/formList`, params);

// 查询流程表单详细
const getForm = formId => getAction(path + `/center/flowable/form/` + formId);

// 新增流程表单
const addForm = data => postForm(path + `/center/flowable/form`, data);

// 修改流程表单
const updateForm = data => put(path + `/center/flowable/form`, {}, data);

// 挂载表单
const addDeployForm = data => postForm(path + `/center/flowable/form/addDeployForm`, data);

// 删除流程表单
const delForm = formId => del(path + `/center/flowable/form/` + formId);

// 导出流程表单
const exportForm = params => getAction(path + `/center/flowable/form/export`, params);

export {
  listForm,
  listAllForm,
  getForm,
  addForm,
  updateForm,
  addDeployForm,
  delForm,
  exportForm,
}
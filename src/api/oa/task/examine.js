// 我的流程页面 api
import {
  getAction,
  postForm,
} from '@/api/manage';
const path = process.env.VUE_APP_BASE_API;
const flowPath = process.env.VUE_APP_FLOWABLE_API;


// 查询处理人树数据
const getTreeList = params => getAction(path + '/center/sys/office/selectOfficeUserList', params);
// 查询当前节点以及目标节点数据
const getNodeKey = params => getAction(flowPath + '/center/flowable/task/getToDoNode', params);
const transfer = params => postForm(flowPath + '/center/flowable/task/goNode', params);


export {
  getTreeList,
  getNodeKey,
  transfer,
}
/* 补充数据页面 api */

import {
  getAction,
  postAction,
  postForm,
} from '../manage'
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;

/*补充数据 -> 其他页面接口 */
const getAllList = params => getAction(`${carbonPath}/center/carbonmonitor/tzcSuppleData/list`, params);
const allDel = params => postAction(`${carbonPath}/center/carbonmonitor/tzcSuppleData/delete`, params);
const getAllInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcSuppleData/getInfoById`, params);
const allSave = params => postAction(`${carbonPath}/center/carbonmonitor/tzcSuppleData/save`, params);
const getBranch = params => postForm(`${carbonPath}/center/carbonassets/tzcProductionLine/selectDown`, params);

export {
  getAllList,
  allDel,
  getAllInfo,
  allSave,
  getBranch,
}
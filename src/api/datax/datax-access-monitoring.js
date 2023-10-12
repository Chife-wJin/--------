// 数据集成 -> 数据接入监控页面 api
import {
  getAction,
  postAction,
  postForm
} from '../manage';

const path = process.env.VUE_APP_BASE_API_DATA;

// const path = process.env.VUE_APP_BASE_API1

const getPageList = params => getAction(`${path}/center/monitorRule/page`, params);

const saveList = params => postForm(`${path}/center/monitorRule/save`, params);

const deleteList = params => getAction(`${path}/center/monitorRule/delete`, params);

const getInfoById = params => getAction(`${path}/center/monitorRule/getInfoById`, params);

const checkSql = params => postForm(`${path}/center/monitorRule/test`, params);

const editList = params => postForm(`${path}/center/monitorRule/update`, params);

const monitorTaskSave = params => postForm(`${path}/center/monitorTask/save`, params);

const monitorTaskResultsPage = params => getAction(`${path}/center/monitorTaskResults/page`, params);

const monitorAlertSave = params => postForm(`${path}/center/monitorAlert/save`, params);

const monitorTaskStart = params => getAction(`${path}/center/monitorTask/start`, params); //启动

const monitorTaskStop = params => getAction(`${path}//center/monitorTask/stop`, params); //停止

const monitorAlertGetInfoById = params => getAction(`${path}/center/monitorAlert/getInfoById`, params);


export {
  getPageList,
  saveList,
  editList,
  deleteList,
  getInfoById,
  checkSql,
  monitorTaskSave,
  monitorTaskResultsPage,
  monitorAlertSave,
  monitorTaskStart,
  monitorTaskStop,
  monitorAlertGetInfoById
};
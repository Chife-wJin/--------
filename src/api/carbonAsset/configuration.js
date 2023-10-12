/* 配置管理页面 api */

import {
  getAction,
  postAction,
} from '../manage'
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;

/* 配置管理-> 碳排放核算设置*/
const getCoalOxidationInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcOxidationRate/getOxiByBelongUnitId`, params);
const coalOxidationSave = params => postAction(`${carbonPath}/center/carbonmonitor/tzcOxidationRate/save`, params);

/** 配置管理 -> 预估配额设置 */
const getEstimatedQuotaInfo = params => getAction(`${carbonPath}/center/carbonMonitor/tzcSettingQuota/getInfoByBelongUnitId`, params);
const estimatedQuotaSave = params => postAction(`${carbonPath}/center/carbonMonitor/tzcSettingQuota/save`, params);

export {
  getCoalOxidationInfo,
  coalOxidationSave,
  getEstimatedQuotaInfo,
  estimatedQuotaSave,
}
/* 碳监测页面-热电 api */

import {
  getAction,
  postAction,
  postForm,
} from '../manage'
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;
const dataCenterPath = process.env.VUE_APP_BASE_API_DATA;

/* 碳监测-热电 -> 统一填报 */
const getUnifiedFillElectricityList = params => getAction(`${carbonPath}/center/carbonmonitor/tzcUnifyEle/list`, params);
const unifiedFillElectricityDel = params => postAction(`${carbonPath}/center/carbonmonitor/tzcUnifyEle/delete`, params);
const unifiedFillEleSave = params => postForm(`${carbonPath}/center/carbonmonitor/tzcUnifyEle/save`, params);
const unifiedFillEleSubmit = params => postForm(`${carbonPath}/center/carbon/oa/unifyEleSubmit`, params);
const getUnifiedFillEleInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcUnifyEle/getInfoById`, params);
const unifiedFillEleAudit = params => postForm(`${carbonPath}/center/carbonmonitor/tzcUnifyEle/auditBatch`, params);
const auditSubmit = params => postForm(`${carbonPath}/center/carbonmonitor/tzcUnifyEle/auditSubmit`, params);
const getJson  = params => getAction(`${carbonPath}/center/carbon/oa/getNodeByIdUnifyEle`, params);
const updatedFlowStatus = params => postAction(`${carbonPath}/center/carbonmonitor/tzcUnifyEle/updateTaskById`, params);

/* 碳监测-热电 -> 化石燃料数据 */
const getBelongGroupListApi = params => getAction(`${dataCenterPath}/center/generatorset/jcGeneratorSet/selectDownGenerateSetName`, params);
const getStoveCoalList = params => getAction(`${carbonPath}/center/carbonmonitor/tzcFuelData/list`, params);
const stoveCoalDel = params => postAction(`${carbonPath}/center/carbonmonitor/tzcFuelData/delete`, params);
const stoveCoalSave = params => postAction(`${carbonPath}/center/carbonmonitor/tzcFuelData/save`, params);
const getStoveCoalInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcFuelData/getInfoById`, params);
const getCoefficient = params => postForm(`${carbonPath}/center/carbonmonitor/tzcFuelData/getCO2Total`, params);

/* 碳监测-热电 -> 生产数据 */
const getProductionDataList = params => getAction(`${carbonPath}/center/carbonMonitor/tzcProductionData/list`, params);
const productionDataDel = params => postAction(`${carbonPath}/center/carbonMonitor/tzcProductionData/delete`, params);
const getProductionDataInfo = params => getAction(`${carbonPath}/center/carbonMonitor/tzcProductionData/getInfoById`, params);
const productionDataSave = params => postAction(`${carbonPath}/center/carbonMonitor/tzcProductionData/save`, params);

/* 碳监测-热电 -> 实验室数据 -> 实验室管理 */
const getLaboratoryList = params => getAction(`${carbonPath}/center/carbonMonitor/tzcLaboratoryInfo/list`, params);
const laboratoryDel = params => postAction(`${carbonPath}/center/carbonMonitor/tzcLaboratoryInfo/delete`, params);
const getLaboratoryInfo = params => getAction(`${carbonPath}/center/carbonMonitor/tzcLaboratoryInfo/getInfoById`, params);
const laboratorySave = params => postForm(`${carbonPath}/center/carbonMonitor/tzcLaboratoryInfo/save`, params);

/* 碳监测-热电 -> 实验室数据 -> 人员信息 */
const getPersonList = params => getAction(`${carbonPath}/center/carbonmonitor/tzcPersonalInfo/list`, params);
const personDel = params => postAction(`${carbonPath}/center/carbonmonitor/tzcPersonalInfo/delete`, params);
const getPersonInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcPersonalInfo/getInfoById`, params);
const personSave = params => postForm(`${carbonPath}/center/carbonmonitor/tzcPersonalInfo/save`, params);
const getLaboratorySelectList = params => getAction(`${carbonPath}/center/carbonMonitor/tzcLaboratoryInfo/selectDown`, params);

/* 碳监测-热电 -> 实验室数据 -> 测量任务管理 */
const getTaskList = params => getAction(`${carbonPath}/center/carbonmonitor/tzcMeasureTask/list`, params);
const taskDel = params => postAction(`${carbonPath}/center/carbonmonitor/tzcMeasureTask/delete`, params);
const getTaskInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcMeasureTask/getInfoById`, params);
const taskSave = params => postAction(`${carbonPath}/center/carbonmonitor/tzcMeasureTask/save`, params);
const getFacilitySelectList = params => getAction(`${carbonPath}/center/carbonMonitor/tzcEquipmentManagement/selectEquipmentName`, params);

/* 碳监测-热电 -> 实验室数据 -> 测量设备校准 */
const getCalibrationList = params => getAction(`${carbonPath}/center/carbonMonitor/tzcEquipmentCalibration/list`, params);
const calibration = params => postForm(`${carbonPath}/center/carbonMonitor/tzcEquipmentCalibration/updateBatch`, params);

/* 碳监测-热电 -> 实验室数据 -> 测量设备基础信息 */
const getInformationList = params => getAction(`${carbonPath}/center/carbonMonitor/tzcEquipmentManagement/list`, params);
const informationDel = params => postAction(`${carbonPath}/center/carbonMonitor/tzcEquipmentManagement/delete`, params);
const getInformationInfo = params => getAction(`${carbonPath}/center/carbonMonitor/tzcEquipmentManagement/getInfoById`, params);
const informationSave = params => postAction(`${carbonPath}/center/carbonMonitor/tzcEquipmentManagement/save`, params);

/* 碳监测-热电 -> 保存碳核查资料库所需文件数组 */
const saveFiles = params => postForm(`${carbonPath}/center/carbonassets/tzcEnclosureAndMaterial/save`, params);



export {
  getUnifiedFillElectricityList,
  unifiedFillElectricityDel,
  unifiedFillEleSave,
  unifiedFillEleSubmit,
  getUnifiedFillEleInfo,
  unifiedFillEleAudit,
  auditSubmit,
  getJson,
  updatedFlowStatus,
  getBelongGroupListApi,
  getStoveCoalList,
  stoveCoalSave,
  stoveCoalDel,
  getStoveCoalInfo,
  getCoefficient,
  getProductionDataList,
  productionDataDel,
  getProductionDataInfo,
  productionDataSave,
  getLaboratoryList,
  laboratoryDel,
  getLaboratoryInfo,
  laboratorySave,
  getPersonList,
  personDel,
  getPersonInfo,
  personSave,
  getLaboratorySelectList,
  getTaskList,
  taskDel,
  getTaskInfo,
  taskSave,
  getFacilitySelectList,
  getCalibrationList,
  calibration,
  getInformationList,
  informationDel,
  getInformationInfo,
  informationSave,
  saveFiles,
}
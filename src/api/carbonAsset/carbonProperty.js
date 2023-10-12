/* 碳资产页面 api */

import {
  getAction,
  postAction,
  postForm,
  downLoadAction,
} from '../manage'
const path = process.env.VUE_APP_BASE_API;
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;


/* 碳资产 -> 排放核算 -> 热电核算 -> 自动核算 */
const getPyroelectricityAutoList = params => postForm(`${carbonPath}/center/carbonassets/tzcAccountEleResult/caculationResult`, params);
/* 碳资产 -> 排放核算 -> 热电核算 -> 手动核算 */
// const pyroelectricityCalculate = params => postAction(`${carbonPath}/center/carbonprepare/tzcThermoelectricAccounting/manualEleCalculation`, params);
// const getPyroelectricityList = params => getAction(`${carbonPath}/center/carbonprepare/tzcThermoelectricAccounting/list`, params);
const pyroelectricityCalculate = params => postForm(`${carbonPath}/center/carbonassets/tzcAccountEleResult/customizeManualAccount`, params);
const plantCheck = params => postForm(`${carbonPath}/center/carbonassets/tzcAccountEleResult/factoryManualAccount`, params);

/* 碳资产 -> 排放核算 -> 电解铝铝核算 -> 自动核算 */
const getAluminiumAutoList = params => postForm(`${carbonPath}/center/carbonassets/tzcAccountEleResult/calculationAutoAlResult-v2`, params);
/* 碳资产 -> 排放核算 -> 电解铝铝核算 -> 手动核算 */
const aluminiumCalculate = params => postForm(`${carbonPath}/center/carbonassets/tzcAccountEleResult/customizeManualAccount`, params);
const plantCheckAluminium = params => postForm(`${carbonPath}/center/carbonassets/tzcAccountEleResult/factoryManualAlAccount`, params);

/* 碳资产 -> 碳排放报告 -> 碳排放报告 */
const getReportList = params => getAction(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/list`, params);
const reportDel = params => postAction(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/delete`, params);
const getReportInfo = params => getAction(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/getInfoById`, params);
const reportSubmit = params => postForm(`${carbonPath}/center/carbon/oa/carbonReportSubmit`, params);
const reportSave = params => postForm(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/save`, params);
const getJson = params => getAction(`${carbonPath}/center/carbon/oa/getNodeByIdCarbonReport`, params);
const getindustryType = params => getAction(`${path}/center/sys/office/getOfficeById`, params);
const synchronousDataE = params => postAction(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/synchronizationData`, params);
const synchronousDataA = params => postAction(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/synchronizationAlData`, params);
const reportCreate = params => postForm(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/generateNominaReport`, params);
const updatedFlowStatus = params => postAction(`${carbonPath}/center/carbonprepare/tzcCarbonEmissionReport/updateTaskById`, params);


/* 碳资产 -> 碳排放报告 -> 报告生成规则 */
const getRuleList = params => getAction(`${carbonPath}/center/carbonprepare/tzcReportGenerationRules/list`, params);
const ruleDel = params => postAction(`${carbonPath}/center/carbonprepare/tzcReportGenerationRules/delete`, params);
const ruleSave = params => postAction(`${carbonPath}/center/carbonprepare/tzcReportGenerationRules/save`, params);
const getRuleInfo = params => getAction(`${carbonPath}/center/carbonprepare/tzcReportGenerationRules/getInfoById`, params);

/* 碳资产 -> 碳账本 */
const getAccountBookList = params => getAction(`${carbonPath}/center/carbonprepare/tzcCarbonLedgerInfo/list`, params);
const getAccountBookInfo = params => getAction(`${carbonPath}/center/carbonprepare/tzcCarbonLedgerInfo/getInfoById`, params);

/* 碳资产 -> 配额管理 */
const getQuotaList = params => getAction(`${carbonPath}/center/carbonprepare/tzcQuotaManagement/list`, params);
const exportExcel = params => downLoadAction(`${carbonPath}/center/carbonprepare/tzcQuotaManagement/export`, params);
const quotaSave = params => postAction(`${carbonPath}/center/carbonprepare/tzcQuotaManagement/save`, params);
const getQuotaInfo = params => getAction(`${carbonPath}/center/carbonprepare/tzcQuotaManagement/getInfoById`, params);
const getGroup = params => getAction(`${carbonPath}/center/carbonprepare/tzcQuotaGroup/getListByBelongUnitId`, params);
const groupQuotaSave = params => postForm(`${carbonPath}/center/carbonprepare/tzcQuotaGroup/save`, params);
const quotaDel = params => postAction(`${carbonPath}/center/carbonprepare/tzcQuotaManagement/delete`, params);
const quotaInitList = params => postAction(`${carbonPath}/center/carbonprepare/tzcQuotaManagement/initDataByYear`, params);
const quotaInitCO2 = params => postAction(`${carbonPath}/center/carbonprepare/tzcQuotaManagement/updateTotalCo2`, params);
const getEstimateInfo = params => postForm(`${carbonPath}/center/carbon/tzcQuotaBudget/getListByQuotaManagement`, params);




export {
  getPyroelectricityAutoList,
  pyroelectricityCalculate,
  plantCheck,
  getAluminiumAutoList,
  aluminiumCalculate,
  plantCheckAluminium,
  getReportList,
  reportDel,
  getReportInfo,
  reportSubmit,
  reportSave,
  getJson,
  getRuleList,
  ruleDel,
  ruleSave,
  getRuleInfo,
  getindustryType,
  synchronousDataE,
  synchronousDataA,
  reportCreate,
  updatedFlowStatus,
  getAccountBookList,
  getAccountBookInfo,
  getQuotaList,
  exportExcel,
  quotaSave,
  getQuotaInfo,
  getGroup,
  groupQuotaSave,
  quotaDel,
  quotaInitList,
  quotaInitCO2,
  getEstimateInfo,
}
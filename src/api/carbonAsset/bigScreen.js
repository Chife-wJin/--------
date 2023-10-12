// 大屏展示页面
import {
  getAction,
  postAction,
  postForm,
} from '../manage'
const path = process.env.VUE_APP_BASE_API;
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;

const carbonYear = params => postForm(`${carbonPath}/center/index/currentYearEveryCO2`, params);
const carbonUnit = params => getAction(`${carbonPath}/center/index/quotaSituation`, params);
const carbonLet = params => postForm(`${carbonPath}/center/index/currentYearFossilCO2`, params);
const overallSituation = params => postForm(`${carbonPath}/center/index/yearCo2Discharge`, params);
const fiveYearLet = params => postForm(`${carbonPath}/center/index/latelyFiveYearCO2`, params);

// 地图弹窗-碳资产-碳资产情况-企业总体情况
const generalSituation = params => getAction(`${carbonPath}/center/bigScreenMapV2/generalSituation`, params);
// 碳资产 - 月度排放量
const yearCo2Discharge = params => postForm(`${carbonPath}/center/index/everyMonthCO2`, params);
// 碳资产 - 机组信息
const GroupInfo = params => getAction(`${carbonPath}/center/bigScreenMapV2/pePflGroupName`, params);
// 碳资产 - 机组发电量信息
const getEleGeneration = params => getAction(`${carbonPath}/center/bigScreenMapV2/unitParams`, params);


export {
  carbonYear,
  carbonUnit,
  carbonLet,
  overallSituation,
  fiveYearLet,
  generalSituation,
  yearCo2Discharge,
  GroupInfo,
  getEleGeneration,
}
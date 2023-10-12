/* 碳分析页面 api */

import {
  getAction,
  postAction,
  postForm,
} from '../manage'
const path = process.env.VUE_APP_BASE_API;
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;


/* 碳分析 -> 碳排放主题 */
const getYearDetails = params => getAction(`${carbonPath}/carbonEmissionDetail`, params);
const getVariationTrend = params => getAction(`${carbonPath}/carbonEmissionChangeTrend`, params);
// const getCarbonForecast = params => getAction(`${carbonPath}/carbonEmissionChangeTrend`, params);

/* 新版页面 */
/* 碳分析 -> 碳排放主题 -> 二氧化碳排放统计 */
const getCarbonEmissionCo2List = params => postForm(`${carbonPath}/co2Discharge`, params);
const getPowerItemOutList = params => postForm(`${carbonPath}/thermalPowerProject`, params);

/* 碳分析 -> 碳排放主题 -> 热电公司月碳排放统计 */
const getPowerIMonthList = params => postForm(`${carbonPath}/eleMonthStatistics`, params);

/* 碳分析 -> 碳排放预测 */
const forecast = params => getAction(`${carbonPath}/forecast`, params);





export {
  getYearDetails,
  getVariationTrend,
  getCarbonEmissionCo2List,
  getPowerItemOutList,
  getPowerIMonthList,
  forecast,
}
/* 首页 api */

import {
  getAction,
  postAction,
  postForm,
  downLoadAction
} from '../manage'
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;
const dataCenterPath = process.env.VUE_APP_BASE_API_DATA;

/* 首页 -> 年度碳排放统计 */
const getEmissionYearNum = params => postForm(`${carbonPath}/center/index/yearCo2Discharge`, params);
const getCurentBar = params => postForm(`${carbonPath}/center/index/currentYearCo2Echarts`, params);
const getLastBar = params => postForm(`${carbonPath}/center/index/lastYearCo2Echarts`, params);

/* 首页 -> 魏桥集团每月碳排放量 + 企业月度排放统计*/
const co2Let = params => postForm(`${carbonPath}/center/index/everyMonthCO2`, params);
const carbonYear = params => postForm(`${carbonPath}/center/index/currentYearEveryCO2`, params);
const carbonMarket = params => getAction(`${dataCenterPath}/center/tzc/index/realTimeQuotes`, params);
const priceTrend = params => getAction(`${dataCenterPath}/center/tzc/index/priceTrend`, params);



export {
  getEmissionYearNum,
  getCurentBar,
  getLastBar,
  co2Let,
  carbonYear,
  carbonMarket,
  priceTrend,
}
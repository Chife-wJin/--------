import { getAction } from "../manage";
const path = process.env.VUE_APP_BASE_API_DATA;

const getHomepageData = (params) => getAction(`${path}/center/homepage/index`, params);//数据中心首页
const firstStatistics = (params) => getAction(`${path}/center/homepage/firstStatistics`, params);//增量数据
const dataIncrementProportion = (params) => getAction(`${path}/center/homepage/dataIncrementProportion`, params);//饼图
const dataIncrementStatistics = (params) => getAction(`${path}/center/homepage/dataIncrementStatistics`, params);//柱图
const meteDataStatistics = (params) => getAction(`${path}/center/homepage/meteDataStatistics`, params);//元数据
const dataQuality = (params) => getAction(`${path}/center/homepage/dataQuality`, params);//数据质量
const dataSharingStatistics = (params) => getAction(`${path}/center/homepage/dataSharingStatistics`, params);//数据共享


const dataSecurity = (params) => getAction(`${path}/center/homepage/dataSecurity`, params);//数据安全
const databaseStatistics = (params) => getAction(`${path}/center/homepage/databaseStatistics`, params);//数据库的统计信息



export {
    getHomepageData,
    firstStatistics,
    dataIncrementProportion,
    dataIncrementStatistics,
    meteDataStatistics,
    dataQuality,
    dataSharingStatistics,
    dataSecurity,
    databaseStatistics
 };




/* 专题数据页面api  */
import {
    getAction,
    postAction,
    postForm,
    upLoad,
    getExcel
  } from '../manage'
  // const path = process.env.VUE_APP_BASE_API;
  const path = process.env.VUE_APP_BASE_API_DATA;

  /* 监测数据 -> 自动监测 -> 空气质量微站api */
  const aqTableList = params => getAction(`${path}/center/insights/page`, params);
  const wzNameList = params => getAction(`${path}/center/insights/list`, params);
  const wzAirQualityMinPage = params => getAction(`${path}/center/wzAirQualityMin/page`, params);


  /* 监测数据 -> 自动监测 -> 污染源在线监测 */
  const companyName = params => getAction(`${path}/center/psinfo/list`, params);
  const airList = params => getAction(`${path}/center/air/list`, params);
  const mpPageAir = params => getAction(`${path}/center/air/page`, params);
  const waterList = params => getAction(`${path}/center/water/list`, params);
  const mpPageWater = params => getAction(`${path}/center/water/page`, params);

  /* 排污许可 */
  const permitRegistrationInformation = params => getAction(`${path}/center/permitRegistrationInformation/page`, params); // 排污许可登记信息
  const permitPublicInformation = params => getAction(`${path}/center/permitPublicInformation/page`, params); // 排污许可公开信息
  const permitBefore = params => getAction(`${path}/center/permitBefore/page`, params); // 申请前公开信息
  const permitCancellation = params => getAction(`${path}/center/permitCancellation/page`, params); // 许可注销信息
  const permitRectification = params => getAction(`${path}/center/permitRectification/page`, params); // 限期整改信息

  /* 碳排放数据 */
  const carbonTradingVolume = params => getAction(`${path}/center/carbonTradingVolume/page`, params); // 碳排放接口

  // 遥感数据
  const compressedImport = params => postForm(`${path}/center/compressed/compressedImport`, params);
  const remoteSenseList = params => getAction(`${path}/center/remoteSense/page`, params);
  //视频数据
  const wqVideoTreeData = params => getAction(`${path}/center/video/wqVideo/treeData`, params);
  const wqVideoCreateLive = params => getAction(`${path}/center/video/wqVideo/createLive`, params);
  

  //在线监测
  const t3cList = params => getAction(`${path}/center/t3c/list`, params);
  const t3centerpriseList = params => getAction(`${path}/center/t3c/t3cEnterprise/list`, params);
  const t3cSubstationList = params => getAction(`${path}/center/t3c/t3cSubstation/list`, params);
  


  const apiModelPage = params => getAction(`${path}/center/apiModel/page`, params); 

//DCS数据
const dcsPlcMetricList = params => getAction(`${path}/center/dcs/dcsPlcMetric/list`, params); 
const dcsPlcDataPage = params => getAction(`${path}/center/dcs/dcsPlcData/page`, params); 


  // 电量监测
  const ecmEnterpriseList = params => getAction(`${path}/center/electric/ecmEnterprise/list`, params); 
  const ecmEnterpriseHourEnergyPage = params => getAction(`${path}/center/electric/ecmEnterpriseHourEnergy/page`, params); 
  const ecmPollutantOutputPointList = params => getAction(`${path}/center/electric/ecmPollutantOutputPoint/list`, params);  //产污监测点
  const ecmHisdatPollutantOutputPage = params => getAction(`${path}/center/electric/ecmHisdatPollutantOutput/page`, params); //产污监测列表
  const ecmPollutantTreatmentPointList = params => getAction(`${path}/center/electric/ecmPollutantTreatmentPoint/list`, params);  //治污监测点
  const ecmHisdatPollutantTreatmentPage = params => getAction(`${path}/center/electric/ecmHisdatPollutantTreatment/page`, params); //治污监测列表
  
  
  //环境综合排名
  const environmentRankingPage = params => getAction(`${path}/center/environmentRanking/page`, params); 
  const environmentRankingInsert = params => postForm(`${path}/center/environmentRanking/insert`, params); 
  const environmentRankingGetOffice = params => getAction(`${path}/center/environmentRanking/getOffice`, params);
  const environmentRankingUpdateById = params => postForm(`${path}/center/environmentRanking/updateById`, params);
  const environmentRankingDeleteById = params => postForm(`${path}/center/environmentRanking/deleteById`, params);//id删除
  const environmentRankingDeleteByBean = params => getAction(`${path}/center/environmentRanking/deleteByBean`, params); //Bean删除
  const environmentRankingList = params => getAction(`${path}/center/environmentRanking/list`, params);
  const environmentRankingExcelExport = params => getAction(`${path}/center/environmentRanking/excelExport`, params); //模板导出
  const environmentRankingDataExport = params => getExcel(`${path}/center/environmentRanking/dataExport`, params);  //数据导出
  const environmentRankingGetAllIds = params => getAction(`${path}/center/environmentRanking/getAllIds`, params); //获取ids
  const environmentRankingExcelImport = params => upLoad(`${path}/center/environmentRanking/excelImport`, params); //导入

  const WeatherDay = params => getAction(`${path}/center/WeatherDay/page`, params);
  const cnemcAqiPage = params => getAction(`${path}/center/cnemcAqi/page`, params);
  const meteorologicalInfoPage = params => getAction(`${path}/center/meteorologicalInfo/page`, params);
  

  

  
  
  
  export {
    aqTableList,
    wzNameList,
    companyName,
    airList,
    mpPageAir,
    waterList,
    mpPageWater,
    permitRegistrationInformation,
    permitPublicInformation,
    permitBefore,
    permitCancellation,
    permitRectification,
    carbonTradingVolume,
    compressedImport,
    remoteSenseList,
    wqVideoTreeData,
    t3cList,
    t3centerpriseList,
    wqVideoCreateLive,
    apiModelPage,
    ecmEnterpriseList,
    ecmEnterpriseHourEnergyPage,
    ecmPollutantOutputPointList,
    ecmHisdatPollutantOutputPage,
    ecmPollutantTreatmentPointList,
    ecmHisdatPollutantTreatmentPage,
    environmentRankingPage,
    environmentRankingInsert,
    environmentRankingGetOffice,
    environmentRankingUpdateById,
    environmentRankingDeleteById,
    environmentRankingList,
    environmentRankingExcelExport,
    environmentRankingDeleteByBean,
    environmentRankingDataExport,
    environmentRankingGetAllIds,
    environmentRankingExcelImport,
    WeatherDay,
    cnemcAqiPage,
    meteorologicalInfoPage,
    dcsPlcMetricList,
    dcsPlcDataPage,
    t3cSubstationList,
    wzAirQualityMinPage
  }
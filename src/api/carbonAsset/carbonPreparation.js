/* 碳准备页面api  */
import {
  getAction,
  postAction,
  postForm,
} from '../manage'
const path = process.env.VUE_APP_BASE_API;
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;
const dataCenterPath = process.env.VUE_APP_BASE_API_DATA;



/* 公共api */
const mainProductDel = params => postAction(`${carbonPath}/center/sys/tzcMainProducts/delete`, params);
const getInformationInfo = params => getAction(`${path}/center/sys/office/getOfficeById`, params);

/* 碳准备 -> 基本情况管理 -> 单位基本信息 */
const getInformationList = params => postForm(`${path}/center/sys/office/pageList`, params);
const informationSaveTable = params => postForm(`${path}/center/sys/office/save`, params);
const informationDelTable = params => postAction(`${path}/center/sys/office/delete`, params);
const getMainProductList = params => getAction(`${carbonPath}/center/sys/tzcMainProducts/getListByUnitId`, params);
const getCategoryTree = params => postForm(`${dataCenterPath}/industry/treeData`, params);
const getProvinceList = params => getAction(`${path}/center/sys/area/threeLevelLink`, params);
const getBelongGroupListApi = params => getAction(`${dataCenterPath}/center/generatorset/jcGeneratorSet/selectDownGenerateSetName`, params);
const mainProductSave = params => postAction(`${carbonPath}/center/sys/tzcMainProducts/save`, params);

/**碳准备 -> 基本情况管理 -> 生产线管理 */
const getProductLine = params => getAction(`${carbonPath}/center/carbonassets/tzcProductionLine/list`, params);
const productLineDel = params => postAction(`${carbonPath}/center/carbonassets/tzcProductionLine/delete`, params);
const getProductLineInfo = params => getAction(`${carbonPath}/center/carbonassets/tzcProductionLine/getInfoById`, params);
const productLineSave = params => postAction(`${carbonPath}/center/carbonassets/tzcProductionLine/save`, params);


/* 碳准备 -> 基本情况管理 -> 机组信息 */
const getGroupTreeList = params => getAction(`${dataCenterPath}/center/generatorset/jcGeneratorSet/pageList`, params);
const groupSaveTable = params => postForm(`${dataCenterPath}/center/generatorset/jcGeneratorSet/save`, params);
const getGroupDetailInfo = params => getAction(`${dataCenterPath}/center/generatorset/jcGeneratorSet/detail`, params);

/* 碳准备 -> 基本情况管理 -> 设施信息 */
const getFacilityList = params => getAction(`${dataCenterPath}/center/productionfacilities/jcProductionFacilities/pageList`, params);
const getGroupSelectList = params => getAction(`${dataCenterPath}/center/generatorset/jcGeneratorSet/selectDownGenerateSetName`, params);


const getFacilityInfo = params => getAction(`${dataCenterPath}/center/productionfacilities/jcProductionFacilities/detail`, params);
const facilitySave = params => postForm(`${dataCenterPath}/center/productionfacilities/jcProductionFacilities/save`, params);


/* 碳准备 -> 数据质量控制计划 */
const getDataControlList = params => postForm(`${carbonPath}/center/plan/tzcDataControlPlanInfo/list`, params);
const getTemplateInfoJson = params => postForm(`${carbonPath}/center/plan/tzcDataControlPlanInfo/dataPlanCreateDetailInfo`, params);
const getInfoJson = params => getAction(`${carbonPath}/center/plan/tzcDataControlPlanInfo/getInfoById`, params);
const dataControlSave = params => postForm(`${carbonPath}/center/carbon/oa/saveControlPlan`, params);
const dataControlSubmit = params => postForm(`${carbonPath}/center/carbon/oa/dataControlSubmit`, params);
const dataControlDel = params => postAction(`${carbonPath}/center/plan/tzcDataControlPlanInfo/delete`, params);
const getUnitList = params => postAction(`${carbonPath}/center/plan/tzcDataControlPlanInfo/selectUnitName`, params);
const getIndustryByUnitId = params => postAction(`${carbonPath}/center/plan/tzcDataControlPlanInfo/getIndustryByUnitId`, params);
const getPlantList = params => postAction(`${carbonPath}/center/plan/tzcDataControlPlanInfo/getOfficesByUnitId`, params);
const getGroupList = params => postForm(`${dataCenterPath}/center/generatorset/jcGeneratorSet/selectGroupByBelongUnitIds`, params);
const getJson = params => getAction(`${carbonPath}/center/carbon/oa/getNodeById`, params);
const updatedFlowStatus = params => postAction(`${carbonPath}/center/plan/tzcDataControlPlanInfo/updateTaskById`, params);

export {
  getInformationList,
  informationSaveTable,
  informationDelTable,
  getInformationInfo,
  getGroupTreeList,
  getFacilityList,
  groupSaveTable,
  getGroupDetailInfo,
  getGroupSelectList,
  getFacilityInfo,
  facilitySave,
  getDataControlList,
  getMainProductList,
  getCategoryTree,
  getProvinceList,
  getBelongGroupListApi,
  mainProductSave,
  getProductLine,
  productLineDel,
  getProductLineInfo,
  productLineSave,
  mainProductDel,
  getTemplateInfoJson,
  dataControlSave,
  dataControlSubmit,
  getInfoJson,
  dataControlDel,
  getUnitList,
  getIndustryByUnitId,
  getPlantList,
  getGroupList,
  getJson,
  updatedFlowStatus,
};
import {
  getAction,
} from '../manage'
const path = process.env.VUE_APP_BASE_API;
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;
// 单位下拉树
const unitList = params => getAction(`${path}/center/sys/office/selectDownList`, params);

// 碳资产 -> 行业下拉树
const industryList = params => getAction(`${carbonPath}/center/configuration/tzcIndustryManageInfo/treeList`, params);

export {
  unitList,
  industryList,
}
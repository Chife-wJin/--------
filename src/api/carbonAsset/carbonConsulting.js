/* 碳讯服页面 api */

import {
  getAction,
  postAction,
  postForm,
  downLoadAction
} from '../manage'
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;

/* 碳讯服 -> 热点新闻 */
const getJournalismList = params => getAction(`${carbonPath}/center/information/tzcInfoHotNews/list`, params);
const journalismSave = params => postAction(`${carbonPath}/center/information/tzcInfoHotNews/save`, params);
const getJournalismInfo = params => getAction(`${carbonPath}/center/information/tzcInfoHotNews/getInfoById`, params);
const journalismDel = params => postAction(`${carbonPath}/center/information/tzcInfoHotNews/delete`, params);
const journalismPublish = params => postAction(`${carbonPath}/center/information/tzcInfoHotNews/release`, params);

/* 碳讯服 -> 政策通知 */
const getPolicyList = params => getAction(`${carbonPath}/center/information/tzcInfoPolicy/list`, params);
const policySave = params => postAction(`${carbonPath}/center/information/tzcInfoPolicy/save`, params);
const getPolicyInfo = params => getAction(`${carbonPath}/center/information/tzcInfoPolicy/getInfoById`, params);
const policyDel = params => postAction(`${carbonPath}/center/information/tzcInfoPolicy/delete`, params);
const policyPublish = params => postAction(`${carbonPath}/center/information/tzcInfoPolicy/release`, params);

/* 碳讯服 -> 市场行情 */
const getBazaarList = params => getAction(`${carbonPath}/center/information/tzcInfoMarket/list`, params);
const getBazaarInfo = params => postAction(`${carbonPath}/center/information/tzcInfoMarket/getInfoById`, params);

/* 碳讯服 -> 行业资料库 */
const getDataBankList = params => getAction(`${carbonPath}/center/information/tzcInfoIndustry/list`, params);
const getDataBankInfo = params => postAction(`${carbonPath}/center/information/tzcInfoIndustry/getInfoById`, params);

export {
  getJournalismList,
  journalismSave,
  getJournalismInfo,
  journalismDel,
  journalismPublish,
  getPolicyList,
  policySave,
  getPolicyInfo,
  policyDel,
  policyPublish,
  getBazaarList,
  getBazaarInfo,
  getDataBankList,
  getDataBankInfo,
}
/* 碳核查页面 api */

import {
  getAction,
  postAction,
  postForm,
  downLoadAction
} from '../manage'
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;
const dataCenterPath = process.env.VUE_APP_BASE_API_DATA;

/* 核查自证 -> 重点排放单位信息 */
const getMainMessageList = params => postForm(`${carbonPath}/center/carbonCheck/importantUnitPage`, params);

/* 核查自证 -> 核算边界 */
const getGroupSelectList = params => getAction(`${dataCenterPath}/center/generatorset/jcGeneratorSet/selectDownGenerateSetName`, params);
const getBoundaryList = params => postForm(`${carbonPath}/center/carbonCheck/accountBoundaryPage`, params);

/* 核查自证 -> 资料库 */
const getFileList = params => getAction(`${carbonPath}/center/carbonassets/tzcEnclosureAndMaterial/pageList`, params);

export {
  getMainMessageList,
  getGroupSelectList,
  getBoundaryList,
  getFileList,
}
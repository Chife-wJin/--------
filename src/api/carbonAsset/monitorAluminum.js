/* 碳监测页面-铝业 api */

import {
  getAction,
  postAction,
  postForm,
} from '../manage'
const carbonPath = process.env.VUE_APP_BASE_API_CARBON;

/* 碳监测-铝业 -> 统一填报 */
const getUnifiedFillAlumList = params => getAction(`${carbonPath}/center/carbonmonitor/tzcUnifyAl/list`, params);
const unifiedFillAlumDel = params => postAction(`${carbonPath}/center/carbonmonitor/tzcUnifyAl/delete`, params);
const getUnifiedFillAlumInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcUnifyAl/getInfoById`, params);
const unifiedFillAlumAudit = params => postForm(`${carbonPath}/center/carbonmonitor/tzcUnifyAl/auditBatch`, params);
const unifiedFillAlumSave = params => postForm(`${carbonPath}/center/carbonmonitor/tzcUnifyAl/save`, params);
const unifiedFillEleSubmit = params => postForm(`${carbonPath}/center/carbon/oa/unifyAlSubmit`, params);
const getCo2Let = params => postForm(`${carbonPath}/center/carbonmonitor/tzcSuppleData/suppleDataCo2`, params);
const auditSubmitA = params => postForm(`${carbonPath}/center/carbonmonitor/tzcUnifyAl/auditSubmit`, params);
const getJson = params => getAction(`${carbonPath}/center/carbon/oa/getNodeByIdUnifyAl`, params);
const updatedFlowStatus = params => postAction(`${carbonPath}/center/carbonmonitor/tzcUnifyAl/updateTaskById`, params);


/* 碳监测-铝业 */
const getAllList = params => getAction(`${carbonPath}/center/carbonmonitor/tzcFuelDataAl/list`, params);
const allDel = params => postAction(`${carbonPath}/center/carbonmonitor/tzcFuelDataAl/delete`, params);
const getAllInfo = params => getAction(`${carbonPath}/center/carbonmonitor/tzcFuelDataAl/getInfoById`, params);
const allSave = params => postAction(`${carbonPath}/center/carbonmonitor/tzcFuelDataAl/save`, params);

export {
  getUnifiedFillAlumList,
  unifiedFillAlumDel,
  getUnifiedFillAlumInfo,
  unifiedFillAlumAudit,
  unifiedFillAlumSave,
  unifiedFillEleSubmit,
  getCo2Let,
  auditSubmitA,
  getJson,
  updatedFlowStatus,
  getAllList,
  allDel,
  getAllInfo,
  allSave,
}
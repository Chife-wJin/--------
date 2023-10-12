/* 数据共享api */
import {
    getAction,
    postForm,
    postAction
  } from '../manage'
  // const path = process.env.VUE_APP_BASE_API;
  const path = process.env.VUE_APP_BASE_API_DATA;

  /* 服务列表 */
  const serviceList = params => getAction(`${path}/center/jwt/apiService/list`, params); //获取服务列表
  const getServiceById = params => getAction(`${path}/center/jwt/apiService/getServiceById`, params); //根据服务ID获取服务
  const saveAddInfo = params => postForm(`${path}/center/jwt/apiService/save`, params); //保存服务
  const getDocByServiceById = params => getAction(`${path}/center/jwt/apiServiceDoc/getDocByServiceById`, params);//查看文档byId
  const apiServiceDocSave = params => postForm(`${path}/center/jwt/apiServiceDoc/save`, params); //保存文档
  const editDocByServiceId = params => getAction(`${path}/center/jwt/apiServiceDoc/editDocByServiceId`, params);//编写文档
  const apiServiceDocDelete = params => postAction(`${path}/center/jwt/apiServiceDoc/delete`, params); //删除文档
  const apiLogView = params => getAction(`${path}/center/jwt/apiLog/view`, params); //查看日志
  const getApiLogList = params => getAction(`${path}/center/jwt/apiLog/list`, params); //调用日志列表
  const apiServiceFindByIds = params => getAction(`${path}/center/jwt/apiService/findByIds`, params); //服务管理列表findByIds
  const findTableList = params => getAction(`${path}/center/jwt/apiService/findTableList`, params); //获取所在库的表
  const dictListType = params => getAction(`${path}/center/datacenterDict/list`, params); //字典
  const accessFileList = params => getAction(`${path}/center/accessFile/list`, params); //文档列表查看
  
  
  


  /* 我的应用 */
  const apiAppList = params => getAction(`${path}/center/jwt/apiApp/list`, params);//获取应用列表
  const getAppById = params => getAction(`${path}/center/jwt/apiApp/getAppById`, params); //根据id获取应用
  const apiAppDelete = params => postForm(`${path}/center/jwt/apiApp/delete`, params); //删除应用
  const viewCountNumber = params => getAction(`${path}/center/jwt/apiApp/viewCountNumber`, params); //访问统计详情
  const clearCount = params => postAction(`${path}/center/jwt/apiApp/clearCount`, params); //清零
  const apiAppSave = params => postForm(`${path}/center/jwt/apiApp/save`, params); //保存应用
  const approvelist = params => getAction(`${path}/center/jwt/apiApp/approvelist`, params); //待审核应用列表
  const yshapprovelist = params => getAction(`${path}/center/jwt/apiApp/yshapprovelist`, params); //已审核应用列表
  const doapprove = params => postAction(`${path}/center/jwt/apiApp/doapprove`, params); //应用审核通过
  const donotapprove = params => postForm(`${path}/center/jwt/apiApp/donotapprove`, params); //应用审核不通过
  const accessLimit = params => getAction(`${path}/center/jwt/apiApp/accessLimit`, params); //分配接口-详情
  const doAccessLimit = params => postAction(`${path}/center/jwt/apiApp/doAccessLimit`, params); //分配

  
  
  export {
    serviceList,
    getServiceById,
    getApiLogList,
    saveAddInfo,
    getDocByServiceById,
    apiServiceDocSave,
    apiServiceDocDelete,
    apiLogView,
    editDocByServiceId,
    apiAppList,
    getAppById,
    apiAppDelete,
    viewCountNumber,
    clearCount,
    apiAppSave,
    approvelist,
    doapprove,
    donotapprove,
    accessLimit,
    doAccessLimit,
    yshapprovelist,
    apiServiceFindByIds,
    findTableList,
    dictListType,
    accessFileList
  }
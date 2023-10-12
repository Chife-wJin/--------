
import {
  getAction,
  postAction,
  postForm,
  downLoadAction,
  deleteAction,
  upLoad
} from '../manage'

// const path = process.env.VUE_APP_BASE_API1;
const path = process.env.VUE_APP_BASE_API_METADATA;


/* 资料目录明细 */
const getResourceDirectoryList = params => getAction(`${path}/center/tdicresourcedetail/tDicResourceDetail/index`, params);
const getResourceDirectoryTree = params => getAction(`${path}/center/tdicresourcedetail/tDicResourceDetail/treeData`, params);
const deleteResourceDirectory = params => getAction(`${path}/center/tdicresourcedetail/tDicResourceDetail/delete`, params);
const saveResourceDirectory = params => postAction(`${path}/center/tdicresourcedetail/tDicResourceDetail/save`, params);
const getTDicResources = params => getAction(`${path}/center/tdicresource/tDicResource/index`, params);
const getResourceDirectoryInfoById = params => getAction(`${path}/center/tdicresourcedetail/tDicResourceDetail/getResourceDetail`, params);


/* 资料目录 */
const getResourceDirectoryList2 = params => getAction(`${path}/center/tdicresource/tDicResource/list`, params);
const deleteResourceDirectory2 = params => getAction(`${path}/center/tdicresource/tDicResource/delete`, params);
const saveResourceDirectory2 = params => postAction(`${path}/center/tdicresource/tDicResource/save`, params);
const getResourceDirectoryInfoById2 = params => getAction(`${path}/center/tdicresource/tDicResource/form`, params);

/* 模版 */
const getTemplateList = params => getAction(`${path}/center/tmetatemplate/tMetaTemplate/list`, params);
const deleteTemplate = params => getAction(`${path}/center/tmetatemplate/tMetaTemplate/delete`, params);
const saveTemplate = params => postAction(`${path}/center/tmetatemplate/tMetaTemplate/save`, params);
const getTemplateInfoById = params => getAction(`${path}/center/tmetatemplate/tMetaTemplate/view`, params);

/* 模版明细 */
const getTemplateDetailList = params => getAction(`${path}/center/tmetatemplatedetail/tMetaTemplateDetail/index`, params);
const saveTemplateDetail = params => postAction(`${path}/center/tmetatemplatedetail/tMetaTemplateDetail/save`, params);
const getTemplateDetailTree = params => getAction(`${path}/center/tmetatemplatedetail/tMetaTemplateDetail/treeData`, params);
const deleteTemplateDetail = params => getAction(`${path}/center/tmetatemplatedetail/tMetaTemplateDetail/delete`, params);
const getTemplatePickList = params => getAction(`${path}/center/tmetatemplate/tMetaTemplate/index`, params);
const getElementPickList = params => getAction(`${path}/center/tmetaelement/tMetaElement/index`, params);
const getTemplateDetaiInfoById = params => getAction(`${path}/center/tmetatemplatedetail/tMetaTemplateDetail/view`, params);

/* 模版元素 */
const getElementList = params => getAction(`${path}/center/tmetaelement/tMetaElement/index`, params);
const deleteElement = params => getAction(`${path}/center/tmetaelement/tMetaElement/delete`, params);
const getElementInfoById = params => getAction(`${path}/center/tmetaelement/tMetaElement/view`, params);
const saveElement = params => postAction(`${path}/center/tmetaelement/tMetaElement/save`, params);
const getDatalist = params => getAction(`${path}/center/tdicmeta/tDicMeta/listData`, params);



/* 元数据著录 */
const getMetaList = params => getAction(`${path}/center/tmetarecord/tMetaRecord/list`, params);
const getprovideTree = params => getAction(`${path}/center/metadata/office/tree`, params);
const getRecordForm = params => getAction(`${path}/center/tmetarecord/tMetaRecord/recordForm`, params);
const onlineList = params => getAction(`${path}/center/tmetarecord/tMetaRecord/contactpartyselect`, params);
const getRecordFormData = params => getAction(`${path}/center/tmetarecord/tMetaRecord/recordFormData`, params);
const RecordSave = params => postForm(`${path}/center/tmetarecord/tMetaRecord/recordSave`, params);
const RecordTenplateSave = params => postForm(`${path}/center/tmetarecord/tMetaRecord/recordTenplateSave`, params);
const getRecordFormDatabyId = params => getAction(`${path}/center/tmetarecord/tMetaRecord/recordFormData1`, params);
const metaRecordDelete = params => deleteAction(`${path}/center/tmetarecord/tMetaRecord/delete`, params);
const metaRecordBatchDelete = params => deleteAction(`${path}/center/tmetarecord/tMetaRecord/batchDelete`, params);
const dictListType = params => getAction(`${path}/center/datacenterDict/list`, params); //字典


/* 元数据审核 */
const getListAudit = params => getAction(`${path}/center/tmetarecord/tMetaRecord/listAudit`, params);
const RecordPass = params => getAction(`${path}/center/tmetarecord/tMetaRecord/pass`, params); //审核
const BatchPass = params => getAction(`${path}/center/tmetarecord/tMetaRecord/batchPass`, params); //批量审核


/* 元数据发布 */
const getMetaDataRelease = params => getAction(`${path}/center/tmetarecord/tMetaRecord/listRelease`, params);
const Release = params => getAction(`${path}/center/tmetarecord/tMetaRecord/release`, params); //发布
const BatchRelease = params => getAction(`${path}/center/tmetarecord/tMetaRecord/batchRelease`, params); //批量发布
const ListServiceCheck = params => getAction(`${path}/center/tmetarecord/tMetaRecord/listServiceCheck`, params); //关联服务
const SaveServicelist = params => getAction(`${path}/center/tmetarecord/tMetaRecord/saveServicelist`, params)  //关联服务保存
const uploadFile = params => upLoad(`${path}/center/metadata/dict/uploadFile`, params) //文件上传
//const getLicenseFile = params => getAction(`${path}/center/file/getFileInfo`, params)//文件路径获取

const getAllMultiDimensional = params => getAction(`${path}/center/tmetarecord/tMetaRecordList/getAllMultiDimensional`, params)
const setMultiDimensional = params => postForm(`${path}/center/tmetarecord/tMetaRecordList/setMultiDimensional`, params)
const tMetaRecordListGetData = params => getAction(`${path}/center/tmetarecord/tMetaRecordList/getData`, params)
const searchTableData = params => getAction(`${path}/center/tmetarecord/tMetaRecord/${params}`) //表格

// 数据目录
const treeLevelBean = params => getAction(`${path}/center/tdicresourcedetail/tDicResourceDetail/treeLevelBean?level=1`, params); //数据目录








// const deleteElement = params => getAction(`${path}/center/tmetaelement/tMetaElement/delete`, params);
// const getElementInfoById = params => getAction(`${path}/center/tmetaelement/tMetaElement/view`, params);
// const saveElement = params => postAction(`${path}/center/tmetaelement/tMetaElement/save`, params);
// const getDatalist = params => getAction(`${path}/center/tdicmeta/tDicMeta/listData`, params);


export {
  getResourceDirectoryList,
  getResourceDirectoryTree,
  deleteResourceDirectory,
  saveResourceDirectory,
  getTDicResources,
  getResourceDirectoryInfoById,
  getResourceDirectoryList2,
  deleteResourceDirectory2,
  saveResourceDirectory2,
  getResourceDirectoryInfoById2,
  getTemplateList,
  saveTemplate,
  deleteTemplate,
  getTemplateInfoById,
  getTemplateDetailList,
  saveTemplateDetail,
  getTemplateDetailTree,
  deleteTemplateDetail,
  getTemplatePickList,
  getElementPickList,
  getTemplateDetaiInfoById,
  getElementList,
  deleteElement,
  getElementInfoById,
  saveElement,
  getDatalist,
  getMetaList,
  getprovideTree,
  getRecordForm,
  onlineList,
  getRecordFormData,
  RecordSave,
  RecordTenplateSave,
  getRecordFormDatabyId,
  getListAudit,
  RecordPass,
  BatchPass,
  metaRecordDelete,
  metaRecordBatchDelete,
  getMetaDataRelease,
  Release,
  BatchRelease,
  ListServiceCheck,
  SaveServicelist,
  uploadFile,
  getAllMultiDimensional,
  setMultiDimensional,
  tMetaRecordListGetData,
  searchTableData,
  dictListType,
  treeLevelBean
}
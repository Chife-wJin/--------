// 数据治理模块api
import {
  getAction,
  postAction,
  postForm
} from '../manage';

const path = process.env.VUE_APP_BASE_API_DATA;

/* 常用规则 */
const commonRulesList = params => getAction(`${path}/center/commonRules/page`, params); //规则列表
const getInfoById = params => getAction(`${path}/center/commonRules/getInfoById`, params); //根据id获取
const ruleSave = params => postAction(`${path}/center/commonRules/save`, params); //保存规则
const commonRulesDelete = params => postAction(`${path}/center/commonRules/delete`, params); //删除规则
const dictListType = params => getAction(`${path}/center/datacenterDict/list`, params); //字典
const rulesTest = params => postAction(`${path}/center/commonRules/test`, params); //数据校验


// 质量规则
const getqualityRulesTree = params => getAction(`${path}/center/accessRules/assessTable`, params); //树列表
const accessRulesDelete = params => getAction(`${path}/center/accessRules/deleteRule`, params); //删除规则
const accessRulesContent = params => getAction(`${path}/center/accessRules/assessRule`, params); //右侧主要表格内容
const getDataSource = params => getAction(`${path}/center/accessRules/getDataSource`, params); //查看所有数据源
const getDataBase = params => getAction(`${path}/center/accessRules/getDataBase`, params); //根据数据源查看所有的库
const getTables = params => getAction(`${path}/center/accessRules/getTables`, params); //根据数据源查看所有的表
const addRules = params => postForm(`${path}/center/accessRules/addRules`, params); //保存规则
const getColumns = params => getAction(`${path}/center/accessRules/getColumns`, params); //获取字段名称
const getRuleList = params => getAction(`${path}/center/commonRules/list`, params); //规则列表查看
const setWeight = params => postForm(`${path}/center/accessRules/setWeight`, params); //权重设置
const getOneRule = params => getAction(`${path}/center/accessRules/getOneRule`, params); //根据id查看规则详情
const grammarCheck = params => postForm(`${path}/center/accessRules/test`, params); //语法检查

//标准文档管理
const getTableData = params => getAction(`${path}/center/accessFile/page`, params); //获取表格内容 ///分页
const saveFileData = ({
  fileAttachmentId,
  fileCode,
  fileExplain,
  fileName
}) => postForm(`${path}/center/accessFile/save?fileAttachmentId=${fileAttachmentId}&fileCode=${fileCode}&fileExplain=${fileExplain}&fileName=${fileName}`); //保存文件
const getItemInfoById = params => getAction(`${path}/center/accessFile/getInfoById`, params); //获取单元格信息
const deleteItemById = params => getAction(`${path}/center/accessFile/delete`, params); //删除数据
const getDownloadUrl = params => getAction(`${path}/center/accessFile/getFileInfo`, params); //获取下载地址
const updateFileData = ({
  fileAttachmentId,
  fileCode,
  fileExplain,
  fileName,
  id
}) => postForm(`${path}/center/accessFile/update?id=${id}&fileAttachmentId=${fileAttachmentId}&fileCode=${fileCode}&fileExplain=${fileExplain}&fileName=${fileName}`); //修改文件

//评估日志

const getLogTableData = params => getAction(`${path}/center/taskLog/page`, params); //获取表格内容 ///分页

// 质量报告
const getTaskResultsPage = (params) => getAction(`${path}/center/taskResults/page`, params); //质量报告列表接口
const getTaskResultsInfoById = (params) => getAction(`${path}/center/taskResults/getInfoById`, params); //质量报告-评估报告明细
const getBrokenLine = (params) => getAction(`${path}/center/taskResults/brokenLine`, params); //质量报告-质量评估结果趋势图
const getAnalysisByField = (params) => getAction(`${path}/center/taskResults/analysisByField`, params); //质量报告-执行报告分析图-按照字段分析
const getAnalysisByType = (params) => getAction(`${path}/center/taskResults/analysisByType`, params); //质量报告-执行报告分析图-按照规则类型
const getShowLogList = (params) => getAction(`${path}/center/taskResults/showLogList`, params); //质量报告历史记录

//质量评估
const taskListPage = params => getAction(`${path}/center/taskList/page`, params); //质量评估列表
const taskListnEable = params => getAction(`${path}/center/taskList/enable`, params); //启用质量评估
const taskListDeactivate = params => getAction(`${path}/center/taskList/deactivate`, params); //停用质量评估
const taskListExecute = params => getAction(`${path}/center/taskList/execute`, params); //立即执行
const taskListDelete = params => getAction(`${path}/center/taskList/delete`, params); //质量评估删除
const taskListetInfoById = params => getAction(`${path}/center/taskList/getInfoById`, params); //根据id获取明细
const taskListSave = params => postForm(`${path}/center/taskList/save`, params); //保存

//常用脱敏规则
const deleteRule = params => postForm(`${path}/center/commonDesensitization/delete?ids=${params.ids}`); //规则删除
const getRuleInfoById = params => getAction(`${path}/center/commonDesensitization/getInfoById`, params); //获取规则详情
const getRulePage = params => getAction(`${path}/center/commonDesensitization/page`, params); //获取规则分页
const saveRule = ({
  desensitizationName,
  desensitizationMode,
  desensitizationType,
  beginIndex,
  engIndex,
  resultValue,
  id
}) => postForm(`${path}/center/commonDesensitization/save?desensitizationName=${desensitizationName}&desensitizationMode=${desensitizationMode}&desensitizationType=${desensitizationType}&beginIndex=${beginIndex}&engIndex=${engIndex}&resultValue=${resultValue}&id=${id}`); //保存 or 修改规则


//数据脱敏
const deleteDesensitizationRule = params => getAction(`${path}/center/desensitizationRule/delete?ids=${params.ids}`); //规则删除
const getDesensitizationRuleInfo = params => getAction(`${path}/center/desensitizationRule/getInfoById`, params); //获取规则详情
const getDesensitizationRulePage = params => getAction(`${path}/center/desensitizationRule/page`, params); //获取规则分页
const saveDesensitizationRule = params => postForm(`${path}/center/desensitizationRule/save`, params); //保存


//密钥管理
const deleteCommonDesensitization = params => postForm(`${path}/center/commonEncryption/delete`, params); //密钥管理删除
const getCommonEncryptionInfo = params => getAction(`${path}/center/commonEncryption/getInfoById`, params); //获取密钥管理详情
const saveCommonEncryption = ({
  encryptionName,
  id,
  isCountry,
  offset,
  privateKey
}) => postForm(`${path}/center/commonEncryption/save?encryptionName=${encryptionName}&id=${id}&isCountry=${isCountry}&offset=${offset}&privateKey=${privateKey}`); //保存
const getCommonEncryptionPage = params => getAction(`${path}/center/commonEncryption/page`, params); //密钥管理 分页
const getCommonEncryptionList = params => getAction(`${path}/center/commonEncryption/list`, params); //密钥管理 分页

//数据加密
const deleteEncryptionRule = params => postForm(`${path}/center/encryptionRule/delete?ids=${params.ids}`, ); //数据加密删除
const getEncryptionRuleInfo = params => getAction(`${path}/center/encryptionRule/getInfoById`, params); //获取数据加密详情
const saveEncryptionRule = params => postForm(`${path}/center/encryptionRule/save`, params); //保存
const getEncryptionRulenPage = params => getAction(`${path}/center/encryptionRule/page`, params); //数据加密 分页

//数据加工
const getColumnsByDataProcess = params => getAction(`${path}/center/accessRules/getColumnsByDataProcess`, params); //获取字段名称
const compileApi = params => postForm(`${path}/center/processDetails/compile`, params);



export {
  commonRulesList,
  getInfoById,
  ruleSave,
  commonRulesDelete,
  dictListType,
  getqualityRulesTree,
  accessRulesDelete,
  accessRulesContent,
  getDataSource,
  getDataBase,
  getTables,
  addRules,
  getColumns,
  rulesTest,
  getRuleList,
  setWeight,
  getOneRule,
  grammarCheck,
  getTableData,
  saveFileData,
  getItemInfoById,
  deleteItemById,
  getDownloadUrl,
  updateFileData,
  getLogTableData,
  getTaskResultsPage,
  getTaskResultsInfoById,
  getBrokenLine,
  getAnalysisByField,
  getAnalysisByType,
  getShowLogList,
  taskListPage,
  taskListnEable,
  taskListDeactivate,
  taskListExecute,
  taskListDelete,
  taskListetInfoById,
  taskListSave,
  deleteRule,
  getRuleInfoById,
  getRulePage,
  saveRule,
  deleteDesensitizationRule,
  getDesensitizationRuleInfo,
  getDesensitizationRulePage,
  saveDesensitizationRule,
  deleteCommonDesensitization,
  getCommonEncryptionInfo,
  saveCommonEncryption,
  getCommonEncryptionPage,
  getCommonEncryptionList,
  deleteEncryptionRule,
  getEncryptionRuleInfo,
  saveEncryptionRule,
  getEncryptionRulenPage,
  getColumnsByDataProcess,
  compileApi,
};
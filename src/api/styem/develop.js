import { getAction ,postAction } from '../manage'
const path = process.env.VUE_APP_BASE_API;
//业务表配置
const genTableList = params => getAction(`${path}/center/gen/genTable/list`,params);
const genTableSave = params => postAction(`${path}/center/gen/genTable/save`,params);
const genTableDelete = params => postAction(`${path}/center/gen/genTable/delete`,params);
const dataOriginApi = params => getAction(`${path}/center/gen/genJdbcDatasource/list`,params);
// const genTableAdd = params => getAction(`${path}/center/gen/genTable/add`,params);
const genTableAdd = params => getAction(`${path}/center/gen/genTable/add`,params);
const genTableById = params => getAction(`${path}/center/gen/genTable/getGenTableById`,params);
const genTableByName = params => getAction(`${path}/center/gen/genTable/getGenTableByName`,params);
const genTableConfig = params => getAction(`${path}/center/gen/genTable/getConfig`,params);

//生成方案配置
const genSchemeDelete = params => postAction(`${path}/center/gen/genScheme/delete`,params);
const genSchemeSave = params => postAction(`${path}/center/gen/genScheme/save`,params);
const genSchemeList = params => getAction(`${path}/center/gen/genScheme/list`,params);
const genSchemeById = params => getAction(`${path}/center/gen/genScheme/genSchemeById`,params);
const genSchemeTableList = params => getAction(`${path}/center/gen/genScheme/tableList`,params);
//数据源配置
const genJdbcDatasourceDelete = params => postAction(`${path}/center/gen/genJdbcDatasource/delete`,params);
const genJdbcDatasourceSave = params => postAction(`${path}/center/gen/genJdbcDatasource/save`,params);
const genJdbcDatasourceList = params => getAction(`${path}/center/gen/genJdbcDatasource/list`,params);
const genJdbcDatasourceById = params => getAction(`${path}/center/gen/genJdbcDatasource/getInfoById`,params);
const testConnection = params => getAction(`${path}/center/gen/genJdbcDatasource/testConnection`,params);


export {
  genTableList,
  genTableSave,
  genTableDelete,
  dataOriginApi,
  genTableAdd,
  genTableById,
  genTableByName,
  genTableConfig,
  genSchemeDelete,
  genSchemeSave,
  genSchemeList,
  genSchemeById,
  genSchemeTableList,
  genJdbcDatasourceDelete,
  genJdbcDatasourceSave,
  genJdbcDatasourceList,
  genJdbcDatasourceById,
  testConnection
}
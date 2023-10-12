//import request from '@/utils/request'
import { axios } from '@/utils/request'

const path = process.env.VUE_APP_BASE_API_DATAX;;
// 数据库信息api

// 获取表名
export function getTables(params) {
  return axios({
    url: path + '/api/metadata/getTables',
    method: 'get',
    params
  })
}

// 获取schema
export function getTableSchema(params) {
  return axios({
    url: path + '/api/metadata/getDBSchema',
    method: 'get',
    params
  })
}

// 获取字段
export function getColumns(params) {
  return axios({
    url: path + '/api/metadata/getColumns',
    method: 'get',
    params
  })
}

// 根据sql获取字段
export function getColumnsByQuerySql(params) {
  return axios({
    url: path + '/api/metadata/getColumnsByQuerySql',
    method: 'get',
    params
  })
}

// 根据datasourceID、tablename创建表【目标端】
export function createTable(params) {
  return axios({
    url: path + '/api/metadata/createTable',
    method: 'post',
    params
  })
}
// 判断字段是否存在，存在，即更新值，否则添加字段
export function updateColumnsValue(query) {
  return axios({
    url: path + '/api/metadata/updateColumnsValue',
    method: 'post',
    data: query
  })
}

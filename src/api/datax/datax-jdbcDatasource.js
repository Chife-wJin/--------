//import request from '@/utils/request'
import { axios } from '@/utils/request'
const path = process.env.VUE_APP_BASE_API_DATAX;;
// datax插件api

export function list(params) {
  return axios({
    url: path + '/api/jobJdbcDatasource',
    method: 'get'
  })
}

export function fetched(params) {
  return axios({
    url: path + '/api/jobJdbcDatasource/' + params,
    method: 'get'
  })
}

export function updated(data) {
  return axios({
    url: path + '/api/jobJdbcDatasource',
    method: 'put',
    data
  })
}

export function created(data) {
  return axios({
    url: path + '/api/jobJdbcDatasource',
    method: 'post',
    data
  })
}

export function deleted(data) {
  return axios({
    url: path + '/api/jobJdbcDatasource',
    method: 'delete',
    params: data
  })
}

export function test(data) {
  return axios({
    url: path + '/api/jobJdbcDatasource/test',
    method: 'post',
    data
  })
}

export function getDataSourceList(params) {
  return axios({
    url: path + '/api/jobJdbcDatasource/all',
    method: 'get',
    params
  })
}

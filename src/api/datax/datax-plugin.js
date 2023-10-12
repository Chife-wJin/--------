//import request from '@/utils/request'
import { axios } from '@/utils/request'

const path = process.env.VUE_APP_BASE_API_DATAX;;
// datax插件api

export function getList(params) {
  return axios({
    url: path + '/api/dataxPlugin',
    method: 'get',
    params
  })
}

export function fetchPlugin(params) {
  return axios({
    url: path + '/api/dataxPlugin/' + params,
    method: 'get'
  })
}

export function updatePlugin(data) {
  return axios({
    url: path + '/api/dataxPlugin/',
    method: 'put',
    data
  })
}

export function createPlugin(data) {
  return axios({
    url: path + '/api/dataxPlugin/',
    method: 'post',
    data
  })
}

export function deletePlugin(data) {
  return axios({
    url: path + '/api/dataxPlugin/',
    method: 'delete',
    params: data
  })
}

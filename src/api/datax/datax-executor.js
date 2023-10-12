//import request from '@/utils/request'
import { axios } from '@/utils/request'
const path = process.env.VUE_APP_BASE_API_DATAX;;
// 执行器管理

export function getList() {
  return axios({
    url: path + '/api/jobGroup/list',
    method: 'get'
  })
}

export function updated(data) {
  return axios({
    url: path + '/api/jobGroup/update',
    method: 'post',
    data
  })
}

export function created(data) {
  return axios({
    url: path + '/api/jobGroup/save',
    method: 'post',
    data
  })
}

export function loadById(id) {
  return axios({
    url: path + '/api/jobGroup/loadById?id=' + id,
    method: 'post'
  })
}

export function deleted(id) {
  return axios({
    url: path + '/api/jobGroup/remove?id=' + id,
    method: 'post'
  })
}


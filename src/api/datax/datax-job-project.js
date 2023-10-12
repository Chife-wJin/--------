// import request from '@/utils/request'
import { axios } from '@/utils/request'
const path = process.env.VUE_APP_BASE_API_DATAX;;
// project

export function list(params) {
  return axios({
    url: path + '/api/jobProject',
    method: 'get',
    params
  })
}

export function updated(data) {
  return axios({
    url: path + '/api/jobProject',
    method: 'put',
    data
  })
}

export function created(data) {
  return axios({
    url: path + '/api/jobProject',
    method: 'post',
    data
  })
}

export function deleted(data) {
  return axios({
    url: path + '/api/jobProject',
    method: 'delete',
    params: data
  })
}

export function getJobProjectList(params) {
  return axios({
    url: path + '/api/jobProject/list',
    method: 'get',
    params
  })
}


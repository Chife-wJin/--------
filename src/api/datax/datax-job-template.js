//import request from '@/utils/request'
import { axios } from '@/utils/request'
const path = process.env.VUE_APP_BASE_API_DATAX;;
// datax插件api

export function getList(params) {
  return axios({
    url: path + '/api/jobTemplate/pageList',
    method: 'get',
    params
  })
}

export function getExecutorList() {
  return axios({
    url: path + '/api/jobGroup/list',
    method: 'get'
  })
}

export function updateJob(data) {
  return axios({
    url: path + '/api/jobTemplate/update',
    method: 'post',
    data
  })
}

export function createJob(data) {
  return axios({
    url: path + '/api/jobTemplate/add/',
    method: 'post',
    data
  })
}

export function removeJob(id) {
  return axios({
    url: path + '/api/jobTemplate/remove/' + id,
    method: 'post'
  })
}

export function nextTriggerTime(cron) {
  return axios({
    url: path + '/api/jobTemplate/nextTriggerTime?cron=' + cron,
    method: 'get'
  })
}

export function getUsersList(params) {
  return axios({
    url: path + '/api/user/list',
    method: 'get',
    params
  })
}

//import request from '@/utils/request'
import { axios } from '@/utils/request'
const path = process.env.VUE_APP_BASE_API_DATAX;;
// datax插件api

export function getList(params) {
  return axios({
    url: path + '/api/job/pageList',
    method: 'get',
    params
  })
}

export function triggerJob(data) {
  return axios({
    url: path + '/api/job/trigger',
    method: 'post',
    data
  })
}

export function startJob(id) {
  return axios({
    url: path + '/api/job/start?id=' + id,
    method: 'post'
  })
}

export function stopJob(id) {
  return axios({
    url: path + '/api/job/stop?id=' + id,
    method: 'post'
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
    url: path + '/api/job/update',
    method: 'post',
    data
  })
}

export function createJob(data) {
  return axios({
    url: path + '/api/job/add/',
    method: 'post',
    data
  })
}

export function removeJob(id) {
  return axios({
    url: path + '/api/job/remove/' + id,
    method: 'post'
  })
}

export function nextTriggerTime(cron) {
  return axios({
    url: path + '/api/job/nextTriggerTime?cron=' + cron,
    method: 'get'
  })
}
export function viewJobLog(id) {
  return axios({
    url: path + '/api/log/logDetailCat?id=' + id,
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

export function getJobIdList(params) {
  return axios({
    url: path + '/api/job/list',
    method: 'get',
    params
  })
}
// batchAdd
export function batchAddJob(data) {
  return axios({
    url: path + '/api/job/batchAdd',
    method: 'post',
    data
  })
}


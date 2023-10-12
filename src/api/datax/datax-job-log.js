//import request from '@/utils/request'
import { axios } from '@/utils/request'
const path = process.env.VUE_APP_BASE_API_DATAX;;
// datax插件api
export function getList(params) {
  return axios({
    url: path + '/api/log/pageList',
    method: 'get',
    params
  })
}

export function clearLog(jobGroup, jobId, type) {
  return axios({
    url: path + '/api/log/clearLog?jobGroup=' + jobGroup + '&jobId=' + jobId + '&type=' + type,
    method: 'post'
  })
}

export function killJob(data) {
  return axios({
    url: path + '/api/log/killJob',
    method: 'post',
    data
  })
}

export function viewJobLog(executorAddress, triggerTime, logId, fromLineNum) {
  return axios({
    url: path + '/api/log/logDetailCat?executorAddress=' + executorAddress + '&triggerTime=' + triggerTime + '&logId=' + logId + '&fromLineNum=' + fromLineNum,
    method: 'get'
  })
}

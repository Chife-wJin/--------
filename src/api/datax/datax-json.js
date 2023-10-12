//import request from '@/utils/request'
import { axios } from '@/utils/request'

const path = process.env.VUE_APP_BASE_API_DATAX;;
// buildJobJson
export function buildJobJson(data) {
  return axios({
    url: path + '/api/dataxJson/buildJson',
    method: 'post',
    data
  })
}

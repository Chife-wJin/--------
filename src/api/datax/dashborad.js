//import request from '@/utils/request'
import { axios } from '@/utils/request'

const path = process.env.VUE_APP_BASE_API_DATAX;;
// dashborad

export function chartInfo(data) {
  return axios({
    url: path + '/api/chartInfo',
    method: 'post',
    data
  })
}

//import request from '@/utils/request'
import { axios } from '@/utils/request'

const path = process.env.VUE_APP_BASE_API_DATAX;;
// datax 执行器注册信息

export function getList(params) {
  return axios({
    url: path + '/api/jobRegistry',
    method: 'get',
    params
  })
}

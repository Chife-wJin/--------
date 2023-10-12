//import request from '@/utils/request'
import { axios } from '@/utils/request'

const path = process.env.VUE_APP_BASE_API_DATAX;;
export function searchUser(name) {
  return axios({
    url: path + '/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return axios({
    url: path + '/transaction/list',
    method: 'get',
    params: query
  })
}

//import request from '@/utils/request'
import { axios } from '@/utils/request'

const path = process.env.VUE_APP_BASE_API_DATAX;;
// datax用户api

export function getList(params) {
  return axios({
    url: path + '/api/user/pageList',
    method: 'get',
    params
  })
}

export function updateUser(data) {
  return axios({
    url: path + '/api/user/update',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return axios({
    url: path + '/api/user/add',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return axios({
    url: path + '/api/user/remove?id=' + id,
    method: 'post'
  })
}

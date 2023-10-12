import {
  axios
} from "@/utils/request";
import qs from "qs";
const path = process.env.VUE_APP_BASE_API;

export function getAction(url, parameter) {
  return axios({
    url: url,
    method: "get",
    params: parameter,
  });
}
export function deleteAction(url, parameter) {
  return axios({
    url: url,
    method: "delete",
    params: parameter,
  });
}
export function getExcel(url, data) {
  return axios({
    method: "post",
    url: url,
    data: data,
    responseType: "blob",
  });
}
export function upLoad(url, data) {
  axios.defaults.headers["Content-Type"] = "multipart/form-data";
  return axios({
    url: url,
    method: "post",
    data: data,
  });
}
export function postAction(url, parameter) {
  return axios.post(
    url,
    qs.stringify(parameter, {
      allowDots: true,
    })
  );
}
export function getForm(url, data, parameter) {
  return axios({
    url: url,
    method: "get",
    data: data,
    params: parameter,
  });
}
export function postForm(url, data) {
  return axios({
    url: url,
    method: "post",
    data: data,
  });
}

export function put(url, parameter, data) {
  return axios({
    url: url,
    method: "put",
    params: parameter,
    data,
  });
}

export function del(url) {
  return axios({
    url: url,
    method: "delete",
  });
}
export function postFormJson(url, data) {
  return axios({
    url: url,
    method: "post",
    data: data,
  });
}
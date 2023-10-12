import axios from "axios";
import { Notification, MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { removeToken } from "@/utils/auth";
import router from "@/router";

// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
const service = axios.create({
  baseURL: "/",
  timeout: 90000,
});
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const message = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401 && res.data.msg === "登录状态已过期") {
      MessageBox.confirm(
        "登录状态已过期，您可以继续留在该页面，或者重新登录",
        "系统提示",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        store.commit("SET_TOKEN", "");
        store.commit("SET_PERMISSIONS", []);
        localStorage.clear();
        sessionStorage.clear();
        removeToken();
        router.push("/login");
      });
    } else if (code != "200") {
      Notification.error({
        title: message,
        duration: 3000,
      });
      return Promise.reject(res);
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    if (error.response.status === 401) {
      const obj = {
        code: 500,
        msg: "操作权限不足",
      };
      return obj;
    } else {
      Message({
        message: error.message,
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    }
  }
);
export { service as axios };

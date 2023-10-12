import { userLogin, ueserLogout } from "@/api/login";
import { getInfo } from "@/api/styem/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { areaTreeNew } from "@/api/styem/dept";
import { encryptByDES } from "@/utils/styem";
import router from "@/router";

const user = {
  state: {
    token: getToken(),
    name: "",
    permissions: [],
    userInfo: {},
    areaInfo: {},
    error: "",
    pageHeight: 0, //用于表格高度设置
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_AREAINFO: (state, areaInfo) => {
      state.areaInfo = areaInfo;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_PAGEHEIGHT: (state, pageHeight) => {
      state.pageHeight = pageHeight;
    },
  },
  actions: {
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      // const password = encryptByDES(userInfo.password, userInfo.utx)
      const code = userInfo.code;
      const loginType = userInfo.loginType;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        userLogin({
          username,
          password,
          code,
          uuid,
          loginType,
        })
          .then((res) => {
            if (res.code == 200) {
              setToken(res.msg);
              commit("SET_TOKEN", res.msg);
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("password", password);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    //获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(async (res) => {
          if (res.code == 200) {
            const user = res.data;
            commit("SET_USERINFO", user);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            localStorage.setItem(
              "applications",
              JSON.stringify(res.data)
            );
            commit("SET_PERMISSIONS", user.permissions || []);
            resolve(res.data || []);
          } else {
            reject(res);
          }
        });
      }).catch((error) => {
        reject(error);
      });
    },
    GetAreaInfo({ commit, state }) {
      return new Promise((resolve) => {
        areaTreeNew({
          parentId: state.userInfo.provinceCode,
        }).then((res) => {
          localStorage.setItem("areaInfo", JSON.stringify(res.data));
          commit("SET_AREAINFO", res.data);
          resolve(res);
        });
      }).catch((error) => {
        resolve(error);
      });
    },
    LogOut({ commit }) {
      return new Promise((resolve) => {
        ueserLogout()
          .then((res) => {
            commit("SET_TOKEN", "");
            commit("SET_PERMISSIONS", []);
            localStorage.clear();
            sessionStorage.clear();
            router.push("/login");
            removeToken();
            resolve(res);
          })
          .catch((error) => {
            resolve(error);
          });
      });
    },
  },
};
export default user;

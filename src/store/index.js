import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import sidebar from "./modules/sidebar";
import permission from "./modules/permission";
import getters from "./getters";
import tagsView from "./modules/tagsView";
import settings from "./modules/settings";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const strore = new Vuex.Store({
  modules: {
    user,
    permission,
    sidebar,
    tagsView,
    settings,
  },
  getters,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      paths: ["user"], // 仅持久化用户信息，如用户名、ID、权限、token，防止用户刷新后丢失
    }),
  ],
});

export default strore;

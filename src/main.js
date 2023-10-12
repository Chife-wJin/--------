import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Xcrud from "xcrud";
/***** 公共样式 ****/
import "./assets/styles/index.scss";
import "@/permission.js";
import "@/assets/icons/index";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import echarts from "echarts";
import Cookies from "js-cookie";
import directive from "./directive";
//富文本编辑器
import mavonEditor from "mavon-editor"; // components
import "mavon-editor/dist/css/index.css"; // styles
Vue.use(mavonEditor);

import {
  Upload,
  Pagination,
  DictTag,
  RightToolbar,
  importDialog,
  TooltipView,
} from "@/components";

import Treeselect from "@riophae/vue-treeselect";

import Tinymce from "@/views/support/oa/components/tinymce/index.vue";

import {
  resetFieldsTap,
  handleTree,
  format
} from "@/utils/styem";

import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";
//全局方法挂载
Vue.prototype.resetFieldsTap = resetFieldsTap;
Vue.prototype.handleTree = handleTree;
Vue.prototype.$echarts = echarts;
Vue.prototype.format = format;

//修改vue-treeselect源码中createFallbackNode方法，解决unknown问题
const TreeselectMethods = Treeselect.mixins[0].methods;
TreeselectMethods.createFallbackNode = function (id) {
  const raw = this.extractNodeFromValue(id);
  const label = this.enhancedNormalizer(raw).label || id;
  const fallbackNode = {
    id,
    label,
    ancestors: [],
    parentNode: null,
    isFallbackNode: true,
    isRootNode: true,
    isLeaf: true,
    isBranch: false,
    isDisabled: false,
    isNew: false,
    index: [-1],
    level: 0,
    raw,
  };
  return this.$set(this.forest.nodeMap, id, fallbackNode);
};

//全局组件挂载
Vue.component("TooltipView", TooltipView);
Vue.component("DictTag", DictTag);
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);
Vue.component("Upload", Upload);
Vue.component("Treeselect", Treeselect);
Vue.component("importDialog", importDialog);
Vue.component("tinymce", Tinymce);
// 全局设置element组件大小
Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  zIndex: 1000,
});
Vue.use(directive);
Vue.use(Avue);
Vue.filter("1000", function (val) {
  if (typeof val === "number") {
    return val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  }
});
Vue.use(Xcrud, {
  // your global theme config
});

Vue.config.productionTip = false;

Element.Dialog.props.closeOnClickModal.default = false; //全局禁止dialog点击空白关闭

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
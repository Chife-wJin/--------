import hasPermi from "./permission/hasPermi";
import select from "./permission/select";
import toDate from "./permission/toDate";
import elResize from "./elResize";
import formScroll from "./formScroll";

const install = function (Vue) {
  Vue.directive("hasPermi", hasPermi);
  Vue.directive("el-select-loadmmore", select);
  Vue.directive("toDate", toDate);
  Vue.directive("elResize", elResize);
  Vue.directive("formScroll", formScroll);
};
if (window.Vue) {
  window["hasPermi"] = hasPermi;
  Vue.use(install); // eslint-disable-line
}
export default install;

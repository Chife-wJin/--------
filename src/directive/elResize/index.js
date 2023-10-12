import store from "@/store";
// 获取元素的高，控制页面的自适应（主要用于搜索条件在不同分辨率下的高度占比）
export default {
  inserted(el, binding) {
    let elHeight = "";
    let elPageHeight = "";
    function isResize() {
      const style = document.defaultView.getComputedStyle(el);
      const height = style.height.slice(0, style.height.length - 2);
      const pageHeight = document.documentElement.clientHeight;
      if (elHeight != height || elPageHeight != pageHeight) {
        store.commit("SET_PAGEHEIGHT", pageHeight - Number(height));
        elHeight = height;
        elPageHeight = pageHeight;
      }
    }
    el.__vueSetInterval__ = setInterval(isResize, 400);
  },
  unbind(el) {
    clearInterval(el.__vueSetInterval__);
  },
};

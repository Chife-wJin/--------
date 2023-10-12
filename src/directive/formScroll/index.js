/**
 * 表单校验报错定位报错处于可视区域
 */

function formErrorScrollIntoView() {
  const isError = document.getElementsByClassName("is-error");
  if (isError.length) {
    isError[0].scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
    const elInput = isError[0].querySelector("input");
    if (elInput) {
      elInput.focus();
    }
  }
}

export default {
  bind: function (el) {
    el.addEventListener("click", formErrorScrollIntoView);
  },
  unbind: function (el) {
    el.removeEventListener("click", formErrorScrollIntoView);
  },
};

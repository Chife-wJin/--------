export default (Vue) => {
  Vue.directive("toDate", {
    inserted: function (el) {
      let timestamp = el.innerText;
      var d = new Date(timestamp * 1);
      var date = (d.getFullYear()) + "-" +
        (d.getMonth() + 1) + "-" +
        (d.getDate()) + " " +
        (d.getHours()) + ":" +
        (d.getMinutes()) + ":" +
        (d.getSeconds());
      el.innerText = date;
    }
  })
}
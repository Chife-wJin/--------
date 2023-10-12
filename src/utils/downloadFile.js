import axios from "axios";
import { getToken } from "@/utils/auth";
/**
 * 用于get方式下载文件，url考虑开发模式和生产模式，url应该取process.env拼接，参数params为对象
 * @param {String} url  process.env + .....
 * @param {Object} params {}
 */
export function downloadFile(url, params) {
  axios({
    method: "get",
    url,
    responseType: "blob",
    headers: {
      Authorization: getToken(),
    },
    params,
  }).then((res) => {
    //获取文件名
    const content = res.headers["content-disposition"];
    const markIndex = content.indexOf("filename=");
    const fileName = content.substring(markIndex + 9, content.length);
    download(res.data, fileName);
  });
}

function download(data, fileName) {
  let ele = document.createElement("a");
  var blob = new Blob([data]);
  const url = URL.createObjectURL(blob);
  ele.download = decodeURI(fileName);
  ele.href = url;
  ele.click();
  window.URL.revokeObjectURL(url);
  ele.remove();
}

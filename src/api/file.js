import { getAction, postAction } from './manage';
import { downLoadZip } from "@/utils/zipdownload";
const path = process.env.VUE_APP_BASE_API;
//文件上传
const uploadFile = params => postAction(`${path}/center/file/uploadFile`, params);
//文件删除
const deletefile = params => postAction(`${path}/center/file/deletefile`, params);
//获取文件
const getFileInfo = params => getAction(`${path}/center/file/getFileInfo`, params);
//文件下载
const downloadFile = params => getAction(`${path}/center/file/downloadFile`, params);
//是否分布式
const fastFile = params => getAction(`${path}/center/file/fastDFS`, params);
// 下载、预览统计
const fileLogSee = params => postAction(`${path}/center/tcommon/materiallog/tCommonMaterialLog/save`, params);

//文件下载
const downloadById = params => downLoadZip(`/center/file/downloadById`, params);
export {
    uploadFile,
    deletefile,
    getFileInfo,
    downloadFile,
    fastFile,
    fileLogSee,
    downloadById
}
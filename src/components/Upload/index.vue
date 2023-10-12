<template>
  <div class="list-add-group">
    <el-upload
      ref="upload"
      multiple
      :limit="limit"
      :action="upload.url"
      :accept="accept"
      :headers="upload.headers"
      :uploadPath="upload.uploadPath"
      :disabled="upload.isUploading || uneditable"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-remove="handleFileRemove"
      :on-exceed="handleExceed"
      :auto-upload="true"
      :on-preview="handelPreviewClick"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :class="uneditable ? ' btn' : ''"
      :list-type="listType"
    >
      <el-button
        size="small"
        type="primary"
        v-if="!uneditable"
        class="upload-button"
        >点击上传</el-button
      >
    </el-upload>
    <el-dialog
      title="图片预览"
      v-if="imgShowFlag"
      :visible.sync="imgShowFlag"
      :show-close="true"
      append-to-body
    >
      <div class="imgStyle">
        <img :src="imgUrl" alt="文件图片" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { deletefile, getFileInfo } from "@/api/file";
import { downLoadZip } from "@/utils/zipdownload";
import { getSingleInfo, getdownLoadZip, noSourcedownLoad } from "@/utils/styem";
import { imgShow } from "@/utils/imgShow";
export default {
  props: {
    limit: {
      type: Number,
      default: () => 5,
    },
    accept: {
      type: String,
      default: () =>
        ".xlsx, .xls, .doc, .docx, .pdf, .jpg, jpeg, .png, .zip, .rar",
    },
    //".xlsx, .xls, .doc, .docx, .pdf, .mov, .rmvb, .rm, .mp4, .3gp, .jpg, jpeg, .png, .txt, .mp3, .mpeg, .wma, .zip, .rar",
    params: {
      type: String,
    },
    fileId: {
      type: [String, Array],
    },
    fromKey: {
      type: String,
      default: () => "",
    },
    uneditable: {
      type: Boolean,
      default: () => false,
    },
    fileSize: {
      type: Number,
      default: 100,
    },
    listType: {
      type: String,
      default: () => "text",
    },
  },
  data() {
    return {
      upload: {
        headers: { Authorization: getToken() },
        isUploading: false,
        uploadPath: "hzx",
        url: process.env.VUE_APP_BASE_API + "/center/file/uploadFile",
      },
      fileList: [],
      imgShowFlag: false,
      imgUrl: "",
    };
  },
  // 解决查看、编辑等操作时文件的回显，created会导致fileId还没有获取到，upload组件已经渲染
  // 但也存在每一次上传文件都会进行一id刷新监听调用
  watch: {
    fileId: {
      handler: function (newV) {
        if (newV && newV.length) {
          this.getFileMessageInfo();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleExceed(files, fileList) {
      if (fileList.length >= this.limit) {
        this.$message.warning(
          `上传个数超过限制个数，最多上传${this.limit}个！！！`
        );
      }
    },
    async getFileMessageInfo() {
      if (this.fileId) {
        const reponse = await getFileInfo({ ids: this.fileId });
        let fileList = [];
        for (const item in reponse.data) {
          const subject = reponse.data[item];
          let temp = {};
          temp = {
            name: subject.file_name,
            id: subject.id,
            state: subject.object_id,
          };
          if (this.listType == "picture-card") {
            // 缩略图列表 处理
            let url = await imgShow(
              "/center/file/downloadFile",
              subject.save_path
            );
            temp.url = url; //转成blob查看用
            temp.savePath = subject.save_path; //做点击下载用
          } else if (this.listType == "text") {
            temp.url = subject.save_path;
          }
          fileList.push(temp);
        }
        this.fileList = fileList;
      }
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    async handleFileSuccess(response, file, fileList) {
      let fileId = "";
      if (fileList.length > 1) {
        fileId = fileList
          .map((item) => item.id || item.response.data.fileId)
          .join(",");
      } else {
        fileId = response.data.fileId;
      }
      this.upload.isUploading = false;
      this.$message.success("上传成功");
      this.$emit("setUrlPath", {
        fromKey: this.fromKey,
        fileId: fileId,
        params: this.params,
      });
    },
    async handleFileRemove(file, fileList) {
      let fileId = undefined;
      if (fileList && fileList.length > 0) {
        fileId = fileList.map((item) => item.id).join(",");
      } else {
        fileId = undefined;
      }
      this.$emit("deleteServeFile", {
        fromKey: this.fromKey,
        fileId,
        params: this.params,
      });
    },
    handelPreviewClick(file) {
      console.log("🚀 ~ file: index.vue:182 ~ handelPreviewClick ~ file:", file)
      if (this.listType == "picture-card") {
        // 缩略图  点击放大预览
        this.imgUrl = file.url;
        this.imgShowFlag = true;
      } else if (this.listType == "text") {
        if (file.response) {
          const fileId = file.response.data.fileId;
          getSingleInfo(fileId);
        } else {
          const fileUrl = file.url;
          const state = file.state;
          const fileName = file.name;
          if (state === "FASTDFS") {
            noSourcedownLoad(fileUrl, fileName);
          } else {
            getdownLoadZip(fileUrl);
          }
        }
      }
    },
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["pdf", "doc", "docx", "xls", "xlsx"];
      if (this.accept.indexOf(fileSuffix) === -1) {
        this.$message.error(`上传文件只能是${this.accept}格式`);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < this.fileSize;
      if (!isLt2M) {
        this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB`);
        return false;
      }
    },
    handleClear() {
      this.$refs.upload.clearFiles();
    },
  },
};
</script>

<style lang="scss" scoped>
.list-add-group {
  display: flex;
  line-height: 30px;
  margin: 0px;
  div {
    width: 100%;
  }
  label {
    font-weight: normal;
    text-align: right;
    font-size: 14px;
  }
  .list-add-label {
    width: 80px;
  }
}
/deep/.el-upload-list__item {
  transition: none !important;
}
.btn {
  /deep/ .el-upload {
    display: none;
  }
}
.upload-button {
  background-color: #009789;
}
:deep(.el-upload-list__item-name) {
  // 文件名 hover效果
  &:hover {
    color: #009789 !important;
    cursor: pointer !important;
  }
}
:deep(.el-upload--picture-card) {
  &:hover {
    border-color: #009789 !important;
    color: #009789 !important;
  }
}

.imgStyle {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    display: block;
    height: 100%;
    width: 100%;
  }
}
</style>

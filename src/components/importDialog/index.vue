<template>
  <!-- 用户导入对话框 -->
  <el-dialog
    :title="title"
    :visible.sync="importOpen"
    :before-close="handleImportDialogClose"
    width="400px"
    append-to-body
  >
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-remove="handleFileRemove"
      :on-exceed="handleExceed"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
        <el-link
          type="info"
          style="font-size:12px;color:#red;font-weight:bold;"
          @click="importTemplate"
        >下载模板</el-link>
      </div>
      <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">确 定</el-button>
      <el-button @click="handleImportDialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";
import { downLoadZip, resolveBlobDownd } from "@/utils/zipdownload";
import axios from "axios";
export default {
  props: {
    importOpen: {
      type: Boolean,
      default: false
    },
    importUrl: {
      type: String
    },
    importDownUrl: {
      type: String
    },
    title: {
      type: String
    },
    responseType: {
      type: String,
      default: " "
    }
  },
  data() {
    return {
      upload: {
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: getToken() },
        url: process.env.VUE_APP_BASE_API + this.importUrl
      },
      file: undefined
    };
  },
  methods: {
    handleExceed(files, fileList) {
      if (fileList.length >= 1) {
        this.$message.warning(`上传个数超过限制个数，最多上传1个！！！`);
      }
    },
    handleImportDialogClose() {
      this.file = undefined;
      this.$refs.upload.clearFiles();
      this.$emit("changeOpen");
    },
    handleChange(event) {
      this.file = event.raw;
    },
    importTemplate() {
      this.importOneTemplate();
      // if (this.importPattern) {
      //   this.importOneTemplate();
      // } else {
      //   this.importOtherTemplate();
      // }
    },
    importOneTemplate() {
      downLoadZip(this.importDownUrl);
    },
    // importOtherTemplate() {
    //   downLoadZip("/center/file/downloadFile", {
    //     savePath: this.importDownUrl
    //   });
    // },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      if (response.code == 200) {
        this.$message.success("数据导入成功");
      } else {
        resolveBlobDownd(response);
      }
      this.handleImportDialogClose();
      this.$emit("update");
    },
    handleFileRemove() {
      this.file = undefined;
      this.$refs.upload.clearFiles();
    },
    // 提交上传文件
    submitFileForm() {
      if (this.file) {
        this.$emit("changeOpen");
        let formData = new FormData();
        formData.append("file", this.file);
        axios({
          method: "post",
          url: process.env.VUE_APP_BASE_API + this.importUrl,
          responseType: this.responseType,
          headers: { Authorization: getToken() },
          data: formData
        }).then(res => {
          if (this.responseType === "blob") {
            if (!res.headers['content-disposition']) {
              this.$message({
                message: "导入成功",
                type: "success"
              });
            } else {
              this.$message.error("导入失败");
              resolveBlobDownd(res);
            }
          }else{
            if (res.data.code === 200) {
              this.$message({
                message: "导入成功",
                type: "success"
              });
            } else {
              this.$message.error("导入失败");
            }
          }

          this.handleImportDialogClose();
        });
      } else {
        {
          this.$message({
            message: "请上传文件",
            type: "warning"
          });
        }
      }
    },
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["xls", "xlsx"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error(`上传文件只能是"xls", "xlsx"格式`);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 500MB");
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
<template>
  <div class="container">
    <el-form :model="ruleForm" size="small" ref="ruleForm" label-width="120px">
      <el-form-item label="导入遥感数据：" prop="import">
        <el-upload
          ref="fileImport"
          class="upload"
          action=""
          :limit="1"
          :auto-upload="false"
          :file-list="fileListCopy"
          :on-remove="remove"
          :on-change="change"
        >
          <el-button type="primary" icon="el-icon-upload2" size="small"
            >上传</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { compressedImport } from "@/api/dataCenter/centerTopic.js";
export default {
  name: "WqzhhjglptUIRemoteSenseIndex",

  data() {
    return {
      ruleForm: {},
      fileListCopy: [],
    };
  },

  mounted() {},

  methods: {
    // beforeUpload(file) {
    //   let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
    //   const extension = testmsg === "zip";
    //   const extension2 = testmsg === "rar";
    //   if (!extension) {
    //     this.$message({
    //       message: "上传文件只能是.zip格式或者.rar格式!",
    //       type: "warning",
    //     });
    //   }
    //   return extension;
    // },
    change(event) {
      if (event) {
        let file = event.raw;
        let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
        const extension = testmsg === "zip";
        const extension2 = testmsg === "rar";
        if (!extension && !extension2) {
          this.$message({
            message: "文件上传失败！上传文件仅支持.zip格式或者.rar格式！",
            type: "warning",
          });
          return;
        } else {
          let formData = new FormData();
          formData.append("files", file);
          compressedImport(formData).then((res) => {
            console.log(res)
            if (res.code == 200) {
              this.$message({
                message: "文件上传成功!",
                type: "success",
              });
            }
          });
        }
      }
    },

    remove(file, fileList) {
      console.log(file, fileList);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding: 30px 0 0 0;
}
</style>
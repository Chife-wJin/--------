<template>
  <div>
    <div class="app-container">
      <div class="form-div">
        <el-form
          :model="ruleForm"
          size="small"
          ref="ruleForm"
          label-width="120px"
        >
          <el-form-item label="导入遥感数据：" prop="import">
            <el-upload
              ref="fileImport"
              class="upload"
              action=""
              :limit="1"
              :auto-upload="false"
              :file-list="fileList"
              :on-remove="remove"
              :on-change="change"
            >
              <el-button type="primary" icon="el-icon-upload2" size="small"
                >上传</el-button
              >
            </el-upload>
          </el-form-item>
        </el-form>
        <el-form
          class="search-body"
          :model="params"
          ref="queryForm"
          :inline="true"
        >
          <el-form-item label="日期查询:" prop="date" >
            <el-date-picker
            type="date"
            v-model="params.date"
            size="small"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 180px">
          </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="small"
              @click="clear"
              type="primary"
              plain
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="information-body">
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          row-key="id"
          :stripe="true"
          border
          class="container-table"
        >
          <el-table-column type="index" width="55" label="序号">
            <template slot-scope="scope">
              {{
              (params.pageNum - 1) * params.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="createDate" label="创建时间" width="200">
          </el-table-column>
          <el-table-column prop="date" label="日期" width="150">
          </el-table-column>
          <el-table-column prop="fileName" label="文件名称" width="300">
          </el-table-column>
          <el-table-column prop="tiffVal" label="文件内容"> </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleView(scope.row)"
                >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :title="titleMenu"
        v-if="isShowAlertView"
        :before-close="handleDialogClose"
        :visible="visible"
        width="1000px"
        append-to-body
        ><CheckDetail :content="content" @goBack="handleDialogClose"
      /></el-dialog>
      <pagination
        v-show="total > 0"
        :total="total"
        :pageNo.sync="params.pageNum"
        :limit.sync="params.pageSize"
        @pagination="getList"
        class="pull-right"
      />
    </div>
  </div>
</template>

<script>
import { compressedImport,remoteSenseList } from "@/api/dataCenter/centerTopic.js";
import CheckDetail from "./checkDetail.vue";
export default {
  name: "RemoteSenseCheckDetail",
  data() {
    return {
      isShowAlertView: false,
      content: "",
      visible: true,
      title: "",
      params: {
        pageNum: 1,
        pageSize: 15,
        date:""
      },
      tableData: [],
      total: 0,
      loading: true,
      ruleForm: {},
      fileList: [],
    };
  },
  components: {
    CheckDetail,
  },
  created: function () {
    this.getList();
  },
  methods: {
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
            console.log(res);
            if (res.code == 200) {
              console.log(1)
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

    async getList() {
      this.loading = true;
      const reponse = await remoteSenseList(this.params);
       console.log(reponse)
      this.tableData = reponse.data.total ? reponse.data.records : [];
      this.total = reponse.data.total;
      this.loading = false;
    },

    handleView(row) {
      this.titleMenu = "查看详情";
      this.isShowAlertView = true;
      this.content = row.tiffVal;
    },

    handleQuery() {
      this.params.pageNo = 1;
      this.getList();
    },

    clear() {
      (this.params = {
        pageNo: 1,
        pageSize: 15,
      }),
        this.getList();
    },
    handleDialogClose: function () {
      this.isShowAlertView = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-div {
  display: flex;
  justify-content: space-between;
}
.information-body {
  margin-top: 10px;
}
.linStyle {
  color: #409eff;
}
.platform-layout-main .platform-layout-content .app-container .search-body {
  padding: 0;
}
</style>
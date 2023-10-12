<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="params"
      ref="queryForm"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="行业选择:" prop="">
        <el-select
          v-model="params.industryType"
          placeholder="行业选择"
          @change="hangyeChange"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in hangyeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排名维度:" prop="">
        <el-select
          v-model="params.dimensionTime"
          placeholder="维度选择"
          @change="weiduChange"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in timeChooseList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业维度:" prop="">
        <el-select
          v-model="params.enterprisesType"
          placeholder="行业选择"
          @change="qiyeChange"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in qiyeWeiduList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间:" prop="" label-width="90px" style="margin-right:5px">
        <el-date-picker
          v-model="params.year"
          type="year"
          size="small"
          format="yyyy 年"
          value-format="yyyy"
          @change="yearChange"
          placeholder="选择年"
          style="width: 150px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label=""
        prop=""
        label-width="90px"
        v-show="params.dimensionTime == 2"
      >
        <el-select
          v-model="params.month"
          placeholder="请选择月份"
          @change="monthChange"
          size="small"
          style="width: 100px"
        >
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          @click="resetQuery"
          type="primary"
          plain
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8 container-state">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-upload2"
          size="small"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-download"
          size="small"
          @click="handleExport()"
          >导出</el-button
        >
      </el-col> -->
    </el-row>
    <div class="information-body">
      <!-- <el-table
        :data="tableData"
        class="container-table"
        row-key="id"
        :stripe="true"
        border
        default-expand-all
        @selection-change="handleSelectionChange"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      > -->
      <el-table
        :data="tableData"
        class="container-table"
        border
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column prop="industryType_text" label="行业">
        </el-table-column>
        <el-table-column prop="dimensionTime_text" label="统计维度">
        </el-table-column>
        <el-table-column prop="enterprisesType_text" label="排名维度">
        </el-table-column>
        <el-table-column label="统计时间">
          <template slot-scope="scope">
            <span>
              {{ scope.row.year }}年{{ scope.row.month
              }}<a style="color: #606266" v-if="scope.row.month !== null">月</a>
            </span>
          </template> 
          </el-table-column>
          <el-table-column prop="" label="更新时间">
           <template slot-scope="scope">
            <span>
              {{scope.row.updateTime | timestampToTime}}
            </span>
           </template>
        </el-table-column>
        <!-- <el-table-column prop="updateTime" label="更新时间"></el-table-column> -->
        <el-table-column prop="name" label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              class="delete-state-btn"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              size="small"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              >查看排名</el-button
            >
            <el-button
              type="text"
              icon="el-icon-download"
              size="small"
              @click="handleExport(scope.row)"
              >导出</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="getList"
      class="pull-right"
    />
    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :auto-upload="false"
        :http-request="httpRequest"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
        </div> -->
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div style="margin-top: 30px">
        <el-form :model="uploadparams" :inline="true" label-width="80px">
          <el-form-item label="选择行业:" prop="">
            <el-select
              v-model="uploadHyvalue"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                v-for="item in hangyeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择维度:" prop="">
            <el-select
              v-model="uploadTimevalue"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                v-for="item in timeChooseList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择年份:" prop="">
            <el-date-picker
              v-model="uploadyear"
              type="year"
              size="small"
              format="yyyy 年"
              value-format="yyyy"
              @change="yearChange"
              placeholder="选择年"
              style="width: 150px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择月份:" prop="">
            <el-select
              v-model="uploadmonth"
              placeholder="请选择月份"
              @change="monthChange"
              size="small"
              style="width: 150px"
            >
              <el-option
                v-for="item in monthList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <ul class="hangyeList-import">
        <li v-for="(v, i) in hangyeList" :key="i" @click="downloadTemplate(v)">
          {{ v.name }}模板
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { downloadFile as downloadFileOfTemplate } from "@/utils/downloadFile";
import {
  environmentRankingPage,
  environmentRankingDeleteById,
  environmentRankingDataExport,
  environmentRankingList,
  environmentRankingExcelImport,
} from "@/api/dataCenter/centerTopic.js";
import { getToken } from "@/utils/auth";
export default {
  name: "List",
  data() {
    return {
      uploadparams: {},
      uploadHyvalue: "",
      uploadTimevalue: "",
      uploadyear: "",
      uploadmonth: "",
      exportIds: [],
      hangyeList: [
        { name: "热电", value: 10 },
        { name: "电解铝", value: 20 },
        { name: "氧化铝", value: 30 },
      ],
      radioHangye: 10,
      timeChooseList: [
        { name: "年度", value: 1 },
        { name: "月度", value: 2 },
      ],
      radioTimeChoose: 1,
      qiyeWeiduList: [
        { name: "分公司", value: 1 },
        { name: "分厂", value: 2 },
      ],
      radioQiye: 1,
      monthList: [
        { name: "1月", value: 1 },
        { name: "2月", value: 2 },
        { name: "3月", value: 3 },
        { name: "4月", value: 4 },
        { name: "5月", value: 5 },
        { name: "6月", value: 6 },
        { name: "7月", value: 7 },
        { name: "8月", value: 8 },
        { name: "9月", value: 9 },
        { name: "10月", value: 10 },
        { name: "11月", value: 11 },
        { name: "12月", value: 12 },
      ],
      monthValue: "",
      yearValue: "",
      tableData: [],
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 15,
        enterprisesType: "", //分公司-1  分厂-2
        dimensionTime: "", //年度-1 月度-2
        year: "",
        month: "",
        industryType: "", //热电-10  电解铝-20  氧化铝-30
      },
      multipleSelection: [],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/center/sys/user/import",
      },
    };
  },
  created: function () {
    this.getList();
  },
  components: {},
  filters:{
      timestampToTime(value) {
        // let date = new Date(value * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
       let date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

       let Y = date.getFullYear() + '-';

       let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';

       let D = date.getDate() + ' ';

       let h = date.getHours() + ':';

       let m = date.getMinutes() + ':';

       let s = date.getSeconds();

        return Y+M+D+h+m+s;

    }

  },
  methods: {
    
    //复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 下载模版
    downloadTemplate(v) {
      const baseUrl = process.env.VUE_APP_BASE_API_DATA;
      const url = baseUrl + "/center/environmentRanking/excelExport";
      const params = {
        industryType: v.value,
      };
      downloadFileOfTemplate(url, params);
    },
    //导出
    // async handleExport(row) {
    //   if(this.multipleSelection.length == 0){
    //     this.$message({
    //       message: '请选择文件',
    //       type: 'warning'
    //     });
    //     return
    //   }
    //   let result = [];
    //   for (var i = 0; i < this.multipleSelection.length; i++) {
    //     const reponse = await environmentRankingList({
    //       enterprisesType: this.multipleSelection[i].enterprisesType,
    //       year: this.multipleSelection[i].year,
    //       month: this.multipleSelection[i].month,
    //       industryType: this.multipleSelection[i].industryType,
    //     });
    //     result.push(...reponse.data);
    //   }
    //   let ids = result.map((item) => item.id);
    //   let res = await environmentRankingDataExport(ids);
    //   //如果后端返回的res是进行过Blob处理的，直接 window.URL.createObjectURL()
    //   //如果没有,就需要先实例化一个Blob对象,再window.URL.createObjectURL()
    //   const blob = new Blob([res], {
    //     type: "application/vnd.ms-excel",
    //   });
    //   //创建标签
    //   const link = document.createElement("a");
    //   link.style.display = "none";
    //   //设置标签href属性为文件路径
    //   link.href = URL.createObjectURL(blob);
    //   //截取文件名
    //   // const fileName = decodeURI(
    //   //   res.headers["content-disposition"].split("=")[1]
    //   // );
    //   const fileName = "dataExport";
    //   //设置下载文件名
    //   link.download = fileName;
    //   document.body.appendChild(link);
    //   //点击触发下载
    //   link.click();
    //   this.$message.success("导出成功");
    //   //移除标签
    //   document.body.removeChild(link);
    //   // 释放掉blob对象
    //   window.URL.revokeObjectURL(link.href);
    // },

    //逐个导出
    async handleExport(row) {
       const reponse = await environmentRankingList({
          enterprisesType: row.enterprisesType,
          year: row.year,
          month: row.month,
          industryType: row.industryType,
        });
        console.log(reponse)
      let ids = reponse.data.map((item) => item.id);
      let res = await environmentRankingDataExport(ids);
      //如果后端返回的res是进行过Blob处理的，直接 window.URL.createObjectURL()
      //如果没有,就需要先实例化一个Blob对象,再window.URL.createObjectURL()
      const blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      });
      //创建标签
      const link = document.createElement("a");
      link.style.display = "none";
      //设置标签href属性为文件路径
      link.href = URL.createObjectURL(blob);
      //截取文件名
      // const fileName = decodeURI(
      //   res.headers["content-disposition"].split("=")[1]
      // );
      const fileName = "dataExport";
      //设置下载文件名
      link.download = fileName;
      document.body.appendChild(link);
      //点击触发下载
      link.click();
      this.$message.success("导出成功");
      //移除标签
      document.body.removeChild(link);
      // 释放掉blob对象
      window.URL.revokeObjectURL(link.href);

    },

    hangyeChange(v) {
      console.log(v);
      if (v == 20 || v == 30) {
        this.qiyeWeiduList = [{ name: "分公司", value: 1 }];
      } else {
        this.qiyeWeiduList = [
          { name: "分公司", value: 1 },
          { name: "分厂", value: 2 },
        ];
      }
    },
    weiduChange(v) {},
    qiyeChange(v) {},
    timeChange(v) { },
    yearChange(v) {},
    monthChange(v) {},

    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //文件上传成功处理
    httpRequest(params) {
     // console.log(params.file); //拿到上传的文件
      var formdata = new FormData();
      formdata.append("file", params.file);
      formdata.append("industryType", this.uploadHyvalue);
      formdata.append("dimensionTime", this.uploadTimevalue);
      formdata.append("year", this.uploadyear);
      formdata.append("month", this.uploadmonth);
      environmentRankingExcelImport(formdata).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          this.$message.success("文件导入成功");
          this.upload.open = false;
        } else {
          this.$message.error("文件导入失败");
        }
      });
    },
    handleQuery() {
      this.params.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.paramspageNum = 1,
      this.params.pageSize = 15,
      this.params.enterprisesType = "", //分公司/分厂
      this.params.dimensionTime = "",
      this.params.year = "",
      this.params.month = "",
      this.params.industryType = ""; //热电 电解铝 氧化铝
      this.handleQuery();
    },

    handleDownload() {},
    //id删除
    async handleDelete(row) {
      const reponse = await environmentRankingList({
        enterprisesType: row.enterprisesType,
        year: row.year,
        month: row.month,
        industryType: row.industryType,
      });
      let ids = reponse.data.map((item) => item.id);
      this.$confirm("确认要删除该条信息吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          environmentRankingDeleteById(ids).then((reponse) => {
            if (reponse.code == 200) {
              this.$message({
                message: reponse.msg,
                type: "success",
              });
              this.getList();
            }
          });
        })
        .catch((e) => e);
    },

    async getList() {
      console.log(this.params)
      const reponse = await environmentRankingPage(this.params);
      console.log(reponse);
      this.tableData = reponse.data.total ? reponse.data.records : [];
      this.tableData.map((item) => {
        item.industryType == "10"
          ? (item.industryType_text = "热电")
          : item.industryType == "20"
          ? (item.industryType_text = "电解铝")
          : (item.industryType_text = "氧化铝");
        item.dimensionTime == "1"
          ? (item.dimensionTime_text = "年度")
          : (item.dimensionTime_text = "月度");
        item.enterprisesType == "1"
          ? (item.enterprisesType_text = "分公司")
          : (item.enterprisesType_text = "分厂");
      });
      this.total = reponse.data.total;
      this.loading = false;
    },
    handleAdd: function () {
      this.$emit("changeCom", "new", "新增");
    },
    handleEdit: function (row) {
      this.$emit("changeCom", "edit", "修改", row.id, row);
      // console.log(row.id)
    },
    handleView: function (row) {
      this.$emit("changeCom", "view", "查看", row.id, row);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
.ellipsis {
  @include textOmit;
}

a {
  color: rgb(64, 158, 255);
}

.container-state {
  padding-bottom: 10px;
}
.hangyeList-import {
  display: flex;
  margin-top: 30px;
}
.hangyeList-import li {
  margin-right: 30px;
  cursor: pointer;
  color: #409EFF;
}
.hangyeList-import li:hover {
  color: #409eff;
}
.el-form-item {
  margin-right: 22px;
}
</style>
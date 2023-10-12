<template>
  <div class="enforcementList">
    <div class="box-body">
      <div class="btn">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          >新增</el-button
        >
      </div>
      <el-dialog :title="`${showTitle}信息`" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="用户名"
            prop="userName"
            :label-width="formLabelWidth"
          >
            <el-input v-model="ruleForm.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.pwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="ruleForm.radio" label="1">男</el-radio>
            <el-radio v-model="ruleForm.radio" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="生日" :label-width="formLabelWidth">
            <el-date-picker
              v-model="ruleForm.birth"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="执法区域"
            prop="region"
            :label-width="formLabelWidth"
          >
            <el-select v-model="ruleForm.area" placeholder="请选择执法区域">
              <el-option
                v-for="(item, index) in areaName"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="执法单位"
            prop="part"
            :label-width="formLabelWidth"
          >
            <el-select v-model="ruleForm.part" placeholder="请选择执法单位">
              <el-option
                v-for="(item, index) in partCategory"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.phoneNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="执法证号" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.lawNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="照片" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
              <!-- <el-button
                style="margin-left: 10px"
                size="small"
                type="success"
                @click="submitUpload"
                >上传到服务器</el-button
              > -->
            </el-upload>
          </el-form-item>

          <el-form-item label="职务" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.post" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" @click="submitForm('ruleForm')"
                      v-formScroll
        >保存</el-button
            >
            <el-button @click="resetFieldsTap('ruleForm')">重置</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>

        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="closeDialog">确 定</el-button>
        </div> -->
      </el-dialog>
      <el-form :model="getParams" label-width="100px" :inline="true">
        <el-form-item label="姓名：">
          <el-input
            placeholder="请输入姓名"
            v-model="getParams.name"
            size="small"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="执法区域"
          prop="region"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="getParams.region"
            placeholder="请选择执法区域"
            size="small"
          >
            <el-option
              v-for="(item, index) in areaName"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="执法单位"
          prop="part"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="getParams.part"
            placeholder="请选择执法单位"
            size="small"
          >
            <el-option
              v-for="(item, index) in partCategory"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="onSubmit"
            >查询</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-refresh"
            size="small"
            @click="onClear"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table style="width: 100%" :data="tableData">
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="zfzh" label="执法证号" width="180">
        </el-table-column>
        <el-table-column prop="radio" label="性别"> </el-table-column>
        <el-table-column prop="birth" label="生日"> </el-table-column>
        <el-table-column prop="area" label="执法区域"> </el-table-column>
        <el-table-column prop="part" label="所在单位"> </el-table-column>
        <el-table-column prop="phoneNum" label="手机号"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              icon="el-icon-edit"
              type="text"
              >修改</el-button
            >
            <el-button
              size="small"
              @click="handleDelete(scope.row)"
              icon="el-icon-delete"
              type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="30"
        :pageNo.sync="geoCategoryParams.pageNo"
        :limit.sync="geoCategoryParams.pageSize"
        @pagination="getUserListb"
      />
    </div>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";

export default {
  data() {
    return {
      name: undefined,
      showTitle: "新增",
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      ruleForm: {
        name: "",
        userName: "",
        pwd: "",
        radio: "1",
        birth: "",
        area: "",
        part: "",
        phoneNum: "",
        lawNum: "",
        post: "",
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, message: "姓名最少两个字符", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入正确密码", trigger: "blur" },
          { min: 8, message: "请输入一个长度最少是8的字符串", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择执法区域", trigger: "blur" },
        ],
        part: [{ required: true, message: "请选择执法单位", trigger: "blur" }],
      },
      formLabelWidth: "120px",
      getParams: {
        name: undefined,
        region: undefined,
        part: undefined,
      },
      tableData: [
        {
          radio: "1",
          name: "张三",
          zfzh: "000000000",
          birth: "1999-01-01",
          part: "执法总队",
          area: "大兴区",
          phoneNum: "13567543788",
          id: "00001",
        },
        {
          radio: "2",
          name: "李四",
          zfzh: "000000000",
          birth: "1999-01-01",
          part: "执法总队",
          area: "大兴区",
          phoneNum: "13567543788",
          id: "00002",
        },
      ],
      geoCategoryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      areaName: [
        {
          label: "执法总队",
          value: "执法总队",
        },
        {
          label: "东城区",
          value: "东城区",
        },
        {
          label: "西城区",
          value: "西城区",
        },
        {
          label: "朝阳区",
          value: "朝阳区",
        },
        {
          label: "丰台区",
          value: "丰台区",
        },
        {
          label: "石景山区",
          value: "石景山区",
        },
        {
          label: "海淀区",
          value: "海淀区",
        },
        {
          label: "顺义区",
          value: "顺义区",
        },
        {
          label: "通州区",
          value: "通州区",
        },
        {
          label: "大兴区",
          value: "大兴区",
        },
        {
          label: "房山区",
          value: "房山区",
        },
        {
          label: "门头沟区",
          value: "门头沟区",
        },
        {
          label: "昌平区",
          value: "昌平区",
        },
        {
          label: "平谷区",
          value: "平谷区",
        },
        {
          label: "密云区",
          value: "密云区",
        },
        {
          label: "怀柔区",
          value: "怀柔区",
        },
        {
          label: "延庆区",
          value: "延庆区",
        },
      ],
      partCategory: [
        {
          label: "北京市生态环境保护综合执法总队",
          value: "北京市生态环境保护综合执法总队",
        },
        {
          label: "场地用户",
          value: "场地用户",
        },
        {
          label: "机械用户",
          value: "机械用户",
        },
        {
          label: "进京拦截用户",
          value: "进京拦截用户",
        },
      ],
    };
  },
  methods: {
    // 查询
    onSubmit() {
      console.log(this.getParams);
    },
    // 重置
    onClear() {
      this.getParams = {};
      console.log(this.getParams);
    },
    // 关闭dialog的时候清空表单
    cancel() {
      this.dialogFormVisible = false;
      this.ruleForm = {};
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.dialogFormVisible = false;
    },
    // 重置表单
    resetFieldsTap(formName) {
      this.$refs[formName].resetFields();
    },
    // 新增
    handleAdd() {
      this.showTitle = "新增";
      this.dialogFormVisible = true;
    },
    // 修改
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.showTitle = "修改";
      console.log(row);
      this.ruleForm = { ...row };
    },
    handleDelete(type, row) {
      let ids;
      if (type == "1") {
        let arr = [];
        this.multipleSelection.forEach((item) => {
          arr.push(item.id);
        });
        ids = arr.join(",");
      } else {
        ids = row.id;
      }
      MessageBox.confirm("是否要删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          officeDelete({ ids: id }).then((reponse) => {
            if (reponse.code == 200) {
              this.$emit("backHandle", "update");
            }
          });
        })
        .catch((e) => e);
    },
    getUserListb() {},
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
};
</script>

<style lang="scss" scoped>
.enforcementList{
 .btn {
    margin: 30px 0px 15px 40px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
  }
  .avatar {
    width: 78px;
    height: 78px;
    display: block;
  }
}
</style>
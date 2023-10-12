<template>
  <div class="login-body">
    <h1 class="login-logo">北京市第三次全国土壤普查电子台账系统</h1>
    <div class="login-content">
      <div class="login-left">
        <!-- <img class="login-left-img" src="../assets/images/login-left-code.png" alt=""> -->
      </div>
      <div class="login-box">
        <h1 class="login-title">用户登录</h1>
        <el-form
          ref="loginFrom"
          :rules="rules"
          class="login-form"
          :model="form"
        >
          <el-form-item prop="username" class="login-input">
            <el-input
              v-model="form.username"
              @keyup.enter.native="loginClick"
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="login-input">
            <el-input
              v-model="form.password"
              :type="type"
              placeholder="请输入密码"
              @keyup.enter.native="loginClick"
              prefix-icon="el-icon-lock"
            >
              <i
                slot="suffix"
                class="icon-style"
                :class="elIcon"
                autocomplete="auto"
                @click="flag = !flag"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" class="formCode login-input">
            <el-input
              v-model="form.code"
              @keyup.enter.native="loginClick"
              placeholder="请输入验证码"
              prefix-icon="el-icon-key"
            ></el-input>
            <img
              @click="validateCodeLoad"
              class="codeImg"
              :src="'data:image/jpeg;base64,' + codeImg"
              alt
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              @click.native.prevent="loginClick"
              type="primary"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import { Notification } from "element-ui";
import {
  validateCode,
  checkValidateCode,
  userLogin,
  getUser,
  getToken,
} from "@/api/login";
import store from "@/store";
import { setToken, setName } from "@/utils/auth";
import { fastFile } from "@/api/file";
import router from "@/router";
import { resetRouter } from "@/router/resetRouter";

export default {
  name: "Login",
  data() {
    var validateCode = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入验证码"));
      } else if (value.length != 4) {
        callback(new Error("请输入4位验证码"));
      } else {
        const codeData = {
          code: this.form.code,
          uuid: this.form.uuid,
        };
        checkValidateCode(codeData).then((res) => {
          if (res.code == 500) {
            this.validateCodeLoad();
            callback(new Error(res.msg));
          } else {
            callback();
          }
        });
      }
    };
    return {
      form: {
        username: "",
        password: "",
        code: undefined,
        uuid: undefined,
        utx: undefined,
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "click" }],
      },
      codeImg: "",
      loading: false,
      flag: false,
    };
  },
  computed: {
    type() {
      return this.flag ? "text" : "password";
    },
    elIcon() {
      return this.flag ? "el-icon-minus" : "el-icon-view";
    },
  },

  mounted() {
    console.log(process.env.VUE_APP_BASE_API);
  },

  methods: {
    ...mapActions(["Login", "GetInfo", "GenerateRoutes"]),
    loginClick() {
      if (this.loading) {
        return;
      }
      this.$refs.loginFrom.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.Login(this.form)
            .then((res) => {
              const pathUrl = "/index";
              this.getFastFile();
              // 获取用户信息
              this.GetInfo().then(() => {
                this.goToSub();
                // console.log('只有一个平台', res)
                // // 如果只有一个平台的话直接进入
                // if (res && res.length > 1) {
                //   this.$router.push({ path: pathUrl }).catch(() => {
                //     this.loading = false;
                //     this.validateCodeLoad();
                //   });
                // } else {
                //   this.goToSub(res[0]);
                // }
              });
            })
            .catch((err) => {
              this.loading = false;
              this.validateCodeLoad();
              this.$notify({
                title: "登录失败",
                message: err.msg,
              });
            });
        }
      });
    },
    validateCodeLoad() {
      validateCode({ height: "40", width: "100" }).then((res) => {
        this.codeImg = res.img;
        this.form.uuid = res.uuid;
        this.form.utx = res.utx;
      });
    },
    async getFastFile() {
      const reponse = await fastFile();
      localStorage.setItem("fastInfo", JSON.stringify(reponse.data));
    },

    // 点击应用获取应用下的菜单
    async goToSub(item) {
      // if (!item) return this.$message.warning("无应用数据，请联系管理员");
      // localStorage.setItem("projectName", item.name);
      // localStorage.setItem("applicationId", item.id);
      // 获取路由
      this.GenerateRoutes().then((accessRoutes) => {
        const findFirstPagePath = this.findFirstPage(accessRoutes);
        const routes = this.$store.state.permission.topbarRouters;
        const topbarRouters = routes;
        localStorage.setItem("topbarRouters", JSON.stringify(topbarRouters));
        sessionStorage.removeItem("currentIndex");
        resetRouter(router);
        router.addRoute({
          path: "/",
          component: () => import("@/layout/index.vue"),
          children: accessRoutes,
        });
        if (findFirstPagePath) {
          this.$router.push({
            path: findFirstPagePath,
          });
        }
      });
    },
    // 找到第一个需要跳转的页面
    findFirstPage(arr) {
      if (arr[0].children && arr[0].children.length) {
        return this.findFirstPage(arr[0].children);
      } else {
        return arr[0].path;
      }
    },
  },
  created() {
    this.validateCodeLoad();
  },
};
</script>

<style lang="scss">
.login-body {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: url("../assets/images/login-bg.jpg") no-repeat center center /
    cover;

  .login-logo {
    text-align: center;
    font-size: 34px;
    color: #fff;

    width: 100%;
    height: 59px;
    // background: url("../assets/images/login-title.png") no-repeat center center;
    margin: 4% auto 3% auto;
  }

  .login-content {
    display: flex;
    justify-content: center;

    .login-left {
      width: 400px;
      height: 406px;
      // background: url("../assets/images/login-left.png") no-repeat center center;
      position: relative;

      .login-left-img {
        position: absolute;
        width: 253px;
        height: 253px;
        left: 74px;
        top: 46px;
      }
    }
  }

  .login-box {
    width: 560px;
    background-color: rgba($color: #ffff, $alpha: 0.2);
    border-radius: 0 10px 10px 0;
    overflow: hidden;

    .login-title {
      font-size: 20px;
      color: #fff;
      padding-top: 42px;
      padding-left: 73px;
      margin: 0px;
    }

    .login-form {
      padding: 0 73px;
      margin: 20px auto 0 auto;
    }

    .el-button {
      width: 100%;
      border-radius: 4px;
      background-color: #1e4672;
      border: 1px solid #1e4672;
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
    }

    .formCode {
      display: flex;
      flex-direction: row;

      .el-form-item__content {
        display: flex;
        flex-direction: row;
        width: 100%;

        .codeImg {
          flex: 1;
          height: 100%;
          margin-left: 10px;
        }
      }
    }
  }
}

.login-input .el-form-item__content .el-input__inner {
  border: 1px solid #fff;
  box-sizing: border-box;
  background: none;
  color: #fff;
}

.login-input {
  input:-webkit-autofill {
    transition: background-color 50000s ease-in-out 0s;
    -webkit-text-fill-color: #fff;
    caret-color: #fff;
  }
}

@media screen and (min-width: 1600px) {
  .login-body .login-logo {
    margin: 159px auto 55px auto;
  }

  .login-body .login-text {
    bottom: 40px;
  }
}

.login-text {
  font-size: 16px;
  color: #fff;
  text-align: center;
  margin: 0;
  bottom: 10px;
  position: absolute;
  left: 0;
  width: 100%;
}

.icon-style {
  font-size: 20px;
  margin-top: 12px;
  margin-right: 10px;
  cursor: pointer;
}
</style>

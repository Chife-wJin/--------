<template>
  <div class="amend-content">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="所属应用：" prop="applicationId">
            <el-select
              v-model="form.applicationId"
              style="width: 100%"
              :disabled="tabState == 'addNext'"
              @change="getMenuByApplication"
            >
              <el-option
                v-for="item in applicationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单：" prop="parentId">
            <treeselect
              v-model="form.parentId"
              :options="menuListList"
              :disableBranchNodes="false"
              :normalizer="normalizer"
              noChildrenText="无"
              :disabled="tabState == 'addNext'"
              placeholder="请选择上级菜单"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单类型：" prop="menuType">
            <el-radio-group
              v-model="form.menuType"
              @change="handleChangeMenuType"
            >
              <el-radio label="D">目录</el-radio>
              <el-radio label="M">菜单</el-radio>
              <el-radio label="B">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单排序(升序)：" prop="sort">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.menuType != 'B'">
        <el-col :span="24">
          <el-form-item label="显示状态：" prop="isShow">
            <el-radio-group v-model="form.isShow">
              <el-radio
                v-for="item in hideTypeData"
                :key="item.id"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <span class="help-inline" style="color: #aaa; margin-left: 20px"
              >改菜单或操作是否显示到系统中</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.menuType != 'B'">
        <el-col :span="24">
          <el-form-item label="菜单图标：">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input
                slot="reference"
                v-model="form.icon"
                placeholder="点击选择图标"
                readonly
              >
                <svg-icon
                  v-if="form.icon"
                  slot="prefix"
                  :icon-class="form.icon"
                  class="el-input__icon"
                  style="height: 32px; width: 16px"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="路由地址：" prop="href">
            <el-input v-model="form.href"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row v-if="form.menuType == 'M' && form.isLink != 1">
        <el-col :span="24">
          <el-form-item label="路由名称：" prop="router">
            <el-input
              v-model="form.router"
              placeholder="如：menuMangePage"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.menuType == 'M' && form.isLink != 1">
        <el-col :span="24">
          <el-form-item label="路由组件：" prop="component">
            <el-input
              v-model="form.component"
              placeholder="如：support/setup/system/menuMange/menuMangePage"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="重定向：" prop="redirect">
            <el-input v-model="form.redirect"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row v-if="form.menuType != 'B'">
        <el-col :span="8">
          <el-form-item label="是否外链：">
            <el-radio-group v-model="form.isLink">
              <el-radio
                v-for="item in yesOrNoList"
                :key="item.id"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-if="form.isLink == 1">
          <el-form-item label="外链地址：" prop="href">
            <el-input
              v-model="form.href"
              placeholder="如外网地址需内链访问则以`http(s)://`开头"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.menuType == 'B'">
        <el-col :span="24">
          <el-form-item label="权限标识符：" prop="permission">
            <el-input
              v-model="form.permission"
              placeholder="控制器中定义的权限标识，如：@RequiresPermissions('权限标识')"
            ></el-input>
            <!-- <span class="help-inline" style="color: #aaa"
              >控制器中定义的权限标识，如：@RequiresPermissions("权限标识")</span
            > -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-form-item label="备注：" prop="remarks">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="onSubmit('form')" v-formScroll>
            保存
          </el-button>
          <el-button @click="handleBackClick">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  menuSave,
  menuGetMenuById,
  sysApplicationList,
  getMenuByApplicationId,
} from "@/api/styem/menu";
import { dictListType } from "@/api/styem/dict/type";
import IconSelect from "@/components/IconSelect";
export default {
  props: {
    detail: {
      type: Object,
      default: () => {},
    },
    tabState: {
      type: String,
      default: "",
    },
  },
  components: {
    IconSelect,
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "change" }],
        sort: [{ required: true, message: "请输入", trigger: "change" }],
        menuType: [{ required: true, message: "请选择", trigger: "change" }],
        router: [{ required: true, message: "请输入", trigger: "change" }],
        component: [{ required: true, message: "请输入", trigger: "change" }],
        href: [
          { required: true, message: "请输入", trigger: "change" },
          {
            pattern: /^(https|http)/,
            message: "请输入以`http(s)://`开头的链接",
            trigger: ["blur", "change"],
          },
        ],
        permission: [{ required: true, message: "请输入", trigger: "change" }],
        applicationId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        parentId: [{ required: true, message: "请选择", trigger: "change" }],
      },
      hideTypeData: undefined,
      menuListList: [],
      form: {
        id: undefined,
        parentId: undefined,
        name: undefined,
        router: undefined,
        component: undefined,
        redirect: undefined,
        href: undefined,
        icon: undefined,
        sort: undefined,
        isShow: "1",
        isLink: "0",
        permission: undefined,
        remarks: undefined,
        menuType: "D",
        applicationId: undefined,
      },
      applicationList: [],
      yesOrNoList: [],
      normalizer(node) {
        return {
          label: node.name,
        };
      },
    };
  },
  created() {
    if (this.tabState == "addNext") {
      this.form.id = undefined;
      if (this.detail.menuType === "A") {
        this.form.parentId = "1";
      } else {
        this.form.parentId = this.detail.id;
      }
      this.form.applicationId = this.detail.applicationId;
      this.getMenuByApplication();
    } else if (this.tabState == "edit") {
      this.form.id = this.detail.id;
      this.getDetailInfo(this.detail.id);
    }
    this.getHideType();
    this.getYesOrNo();
    // this.getApplicationList();
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.isLink == 1) {
          this.$set(this.form, "component", undefined);
          this.$set(this.form, "router", undefined);
        } else {
          this.$set(this.form, "href", undefined);
        }
      },
    },
  },
  mounted() {},
  methods: {
    selected(name) {
      this.$set(this.form, "icon", name);
    },
    // 获取显示状态
    async getHideType() {
      const res = await dictListType({ type: "show_hide" });
      this.hideTypeData = res.data;
    },
    // 获取是否
    async getYesOrNo() {
      const res = await dictListType({ type: "yes_no" });
      this.yesOrNoList = res.data;
    },
    // 获取菜单详情
    async getDetailInfo(id) {
      const res = await menuGetMenuById({ id });
      this.form = res.data;
      this.getMenuByApplication();
    },
    // 获取应用列表
    async getApplicationList() {
      let { data } = await sysApplicationList({
        pageSize: 10000,
        pageNo: 1,
      });
      if (data) {
        this.applicationList = (data.records || []).map((item) => {
          return { value: item.id, label: item.name };
        });
      }
    },
    // 根据应用获取菜单
    async getMenuByApplication() {
      if (this.form.applicationId) {
        const { data } = await getMenuByApplicationId({
          applicationId: this.form.applicationId,
        });
        const arr = [
          {
            id: 1,
            name: "功能菜单",
            children: data || [],
          },
        ];
        this.menuListList = arr;
        if (this.tabState == "add") {
          this.$set(this.form, "parentId", 1);
        }
      }
    },
    // 菜单类型切换
    handleChangeMenuType() {
      if (this.form.menuType == "D") {
        this.$set(this.form, "component", undefined);
        this.$set(this.form, "router", undefined);
        // this.$set(this.form, "permission", undefined);
      } else if (this.form.menuType == "M") {
        // this.$set(this.form, "permission", undefined);
      } else {
        this.$set(this.form, "component", undefined);
        this.$set(this.form, "router", undefined);
        this.$set(this.form, "isShow", "0");
      }
    },
    // 保存
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          menuSave(this.form).then((res) => {
            this.resetFieldsTap("form");
            this.$emit("handleDialogClose");
            this.$emit("getMenuList");
          });
        }
      });
    },
    handleBackClick() {
      this.$emit("handleDialogClose");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__content {
  line-height: 34px;
}
/deep/.el-input__icon {
  line-height: 34px;
}
</style>

<template>
  <div class="amend-content">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="归属机构：" prop="officeId">
            <treeselect
              v-model="form.officeId"
              :options="officeListData"
              :disable-branch-nodes="true"
              :disableBranchNodes="false"
              :normalizer="normalizer"
              noChildrenText="无"
              placeholder="请选择归属机构"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="角色名称：" prop="name">
            <input
              id="oldName"
              name="oldName"
              type="hidden"
              v-model="form.oldName"
            />
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="英文名称：" prop="enname">
            <input
              id="oldEnname"
              name="oldEnname"
              type="hidden"
              v-model="form.oldEnname"
            />
            <el-input v-model="form.enname"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="角色类型：" prop="roleType">
            <el-select v-model="form.roleType">
              <el-option
                v-for="item in roleTypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span
              class="help-inline"
              style="color: #aaa"
              title="activiti有3种预定义的组类型：security-role、assignment、user 如果使用Activiti Explorer，需要security-role才能看到manage页签，需要assignment才能claim任务"
              >工作流组用户组类型（任务分配：assignment、管理角色：security-role、普通角色：user）</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="是否系统数据：" prop="sysData">
            <el-select v-model="form.sysData">
              <el-option
                v-for="item in dictLoginYesNoData"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="help-inline" style="color: #aaa"
              >“是”代表此数据只有超级管理员能进行修改，”否“则表示拥有角色修改人员的权限都能进行修改</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="是否可用：" prop="useable">
            <el-select v-model="form.useable">
              <el-option
                v-for="item in dictLoginYesNoData"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="help-inline" style="color: #aaa"
              >“是”代表此数据可用，“否”则表示此数据不可用</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="数据范围：" prop="dataScope">
            <el-select v-model="form.dataScope">
              <el-option
                v-for="item in scopeTypeData"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="help-inline" style="color: #aaa"
              >特殊情况下，设置为“按明细设置”，可进行跨机构授权</span
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="角色授权：">
            <el-checkbox
              v-model="menuExpand"
              @change="handleCheckedTreeExpand($event, 'menu')"
              >展开/折叠</el-checkbox
            >
            <el-checkbox
              v-model="menuNodeAll"
              @change="handleCheckedTreeNodeAll($event, 'menu')"
              >全选/全不选</el-checkbox
            >
            <!-- <el-checkbox
              v-model="menuCheckStrictly"
              @change="handleCheckedTreeConnect($event, 'menu')"
              >父子联动</el-checkbox
            > -->
            <el-tree
              class="menu-tree-btn"
              empty-text
              :data="menuOptions"
              :default-checked-keys="form.checkedIds"
              :show-checkbox="true"
              default-expand-all
              node-key="id"
              ref="menu"
              highlight-current
              :props="defaultProps"
            >
              <span slot-scope="{ node, data }">
                <template>
                  <el-button
                    type="warning"
                    size="small"
                    plain
                    v-if="data.menuType == 'A'"
                    >应用</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    plain
                    v-if="data.menuType == 'D'"
                    >目录</el-button
                  >
                  <el-button
                    type="success"
                    size="small"
                    plain
                    v-if="data.menuType == 'M'"
                    >菜单</el-button
                  >
                  <el-button
                    type="info"
                    size="small"
                    plain
                    v-if="data.menuType == 'B'"
                    >按钮</el-button
                  >
                  <span>{{ node.label }}</span>
                </template>
              </span>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注：" prop="remarks">
            <el-input
              type="textarea"
              v-model="form.remarks"
              placeholder=""
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="tab-list-state">
          <el-button type="primary" @click="onSubmit('form')" v-formScroll
            >保存</el-button
          >
          <el-button @click="handleBackClick">返回</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { dictListType } from "@/api/styem/dict/type";
import { menuList } from "@/api/styem/menu";
import {
  roleCheckName,
  roleCheckEnname,
  roleSave,
  roleDetail,
} from "@/api/styem/role";
import Bus from "@/utils/vueBus";
export default {
  props: {
    officeListData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入角色名称"));
      } else {
        const nameData = {
          oldName: this.form.oldName,
          name: this.form.name,
        };

        roleCheckName(nameData).then((res) => {
          if (res.data == false) {
            callback(new Error("角色名称已存在"));
          } else {
            callback();
          }
        });
      }
    };
    var validateEnName = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入英文名称"));
      } else {
        const enNameData = {
          oldEnname: this.form.oldEnname,
          enname: this.form.enname,
        };
        roleCheckEnname(enNameData).then((res) => {
          if (res.data == false) {
            callback(new Error("英文名称已存在"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      rules: {
        officeId: [
          { required: true, message: "请选择归属机构", trigger: "blur" },
        ],
        name: [{ validator: validateName, required: true, trigger: "blur" }],
        enname: [
          { validator: validateEnName, required: true, trigger: "blur" },
        ],
      },
      form: {
        id: undefined,
        officeId: undefined,
        name: undefined,
        oldName: undefined,
        enname: undefined,
        oldEnname: undefined,
        roleType: "assignment",
        sysData: "1",
        useable: "1",
        dataScope: "8",
        remarks: undefined,
        checkedIds: [],
      },
      roleTypeData: [
        { value: "assignment", label: "任务分配" },
        { value: "security-role", label: "管理角色" },
        { value: "user", label: "普通角色" },
      ],
      dictLoginYesNoData: undefined,
      scopeTypeData: undefined,
      normalizer(node) {
        return {
          label: node.name,
        };
      },
      menuOptions: undefined,
      defaultProps: {
        children: "children",
        label: "name",
      },
      menuNodeAll: false,
      menuExpand: false,
    };
  },
  created() {
    Bus.$off("outComeId");
    this.getInstitutionDict();
  },
  mounted() {
    Bus.$on("outComeId", (id) => {
      this.resetChecked();
      this.getMenuList();
      if (id == "" || id == undefined) {
        this.form.id = undefined;
      } else {
        this.form.id = id;
        this.getRoleDetail(id);
      }
    });
  },
  methods: {
    async getRoleDetail(id) {
      const { data } = await roleDetail({ id });
      this.form.officeId = data.officeId;
      this.form.name = data.name;
      this.form.oldName = data.name;
      this.form.enname = data.enname;
      this.form.oldEnname = data.enname;
      this.form.roleType = data.roleType;
      this.form.sysData = data.sysData;
      this.form.useable = data.useable;
      this.form.dataScope = data.dataScope;
      this.form.remarks = data.remarks;
      this.form.checkedIds = (
        (data.menuList || []).filter(
          (item) => !item.children || !item.children.length
        ) || []
      ).map((item) => item.id);
    },
    async getInstitutionDict() {
      const dictLoginYesNoReponse = await dictListType({ type: "yes_no" });
      this.dictLoginYesNoData = dictLoginYesNoReponse.data;
      const scopeTypeReponse = await dictListType({ type: "sys_data_scope" });
      this.scopeTypeData = scopeTypeReponse.data;
    },
    async getMenuList() {
      const { data } = await menuList();
      this.menuOptions = data || [];
    },
    nodeClick(data, node, e) {
      //点击的时候获取到所有选中的
      let menuArr = [
        ...this.$refs.menu.getCheckedNodes(),
        ...this.$refs.menu.getHalfCheckedNodes(),
      ];
      let arr = [];
      menuArr.forEach((item) => {
        if (item.menuType !== "A") {
          arr.push({
            id: item.id,
            applicationId: item.applicationId,
          });
        }
      });
      this.form.menus = arr;
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == "menu") {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == "dept") {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "menu") {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == "dept") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },

    onSubmit(forName) {
      this.$refs[forName].validate(async (valid) => {
        if (valid) {
          this.nodeClick();
          const loading = this.$loading({
            lock: true,
            text: "正在保存提交，请稍等...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.1)",
          });
          await roleSave(this.form);
          this.form.checkedIds = [];
          loading.close();
          this.$emit("backHandle", "update");
        }
      });
    },
    handleBackClick() {
      this.$emit("backHandle", "back");
    },
    resetChecked() {
      this.$refs.menu.setCheckedKeys([]);
      this.form.id = undefined;
      this.form.officeId = undefined;
      this.form.name = undefined;
      this.form.oldName = undefined;
      this.form.enname = undefined;
      this.form.oldEnname = undefined;
      this.form.roleType = "assignment";
      this.form.sysData = "1";
      this.form.useable = "1";
      this.form.dataScope = "8";
      this.form.remarks = undefined;
      this.form.checkedIds = [];
      this.menuExpand = false;
      this.menuNodeAll = false;
      this.handleformClear("form");
    },
    handleformClear(formName) {
      this.$nextTick(() => {
        this.resetFieldsTap(formName);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__content {
  line-height: 34px;
}
</style>

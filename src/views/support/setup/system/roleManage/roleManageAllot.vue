<template>
  <div class="tab-list-content">
    <div class="box-body">
      <p>
        角色名称：
        <b>{{ roleDetailData.name }}</b>
        归属机构：{{
        roleDetailData.officeName
        }}
        英文名称：{{ roleDetailData.enname }}
      </p>
      <p>
        角色类型：{{ roleDetailData.roleType }} 数据范围：{{
        roleDetailData.dataScopeName
        }}
      </p>
    </div>
    <div class="box-body" v-if="roleManageBoolean">
      <el-button size="small" type="primary" @click="handleAddLower">分配角色</el-button>
    </div>
    <el-table :data="roleUsersData" v-loading="loading" border style="width: 100%" :stripe="true">
      <el-table-column prop="companyName" label="归属公司"></el-table-column>
      <el-table-column prop="officeName" label="归属部门"></el-table-column>
      <el-table-column prop="loginName" label="登录名"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            v-if="scope.row.stateName==1"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="分配角色"
      :visible.sync="allotOpen"
      class="workbench-dialog"
      :before-close="handleAllotClose"
      append-to-body
    >
      <div class="allot-dialog-plane">
        <div class="dialog-item dialog-item-branch">
          <p>所在部门：</p>
          <div class="dialog-item-search">
            <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
            />
          </div>

          <el-tree
            ref="tree"
            :filter-node-method="filterNode"
            :data="officeListData"
            :props="defaultProps"
            @node-click="nodeClick"
          ></el-tree>
        </div>
        <div class="dialog-item dialog-item-flex">
          <p>待选人员：</p>
          <el-tree
            :data="personListData"
            :props="defaultProps"
            @node-click="handlePersonSelectClick"
          ></el-tree>
        </div>
        <div class="dialog-item dialog-item-flex selected-item">
          <p>已选人员</p>
          <ul @click="handlePersonSelectedClick">
            <li
              v-for="item in personListSelectData"
              :style="{ color: item.color }"
              :id="item.id"
              :key="item.id"
              :data-deleted="item.color"
            >{{ item.name }}</li>
          </ul>
          <!-- <el-tree
            :data="roleUsersData"
            :props="defaultProps"
            style="margin-top:20px"
            class="selected-item-tree"
            @node-click="handlePersonSelectedClick"
          ></el-tree>
          <el-tree
            :data="roleSelectUsersData"
            :props="defaultProps"
            @node-click="handlePersonSelectedClick"
          ></el-tree>-->
        </div>
      </div>
      <div class="dialog-footer">
        <p>通过选择部门，然后为列出的人员分配角色。</p>
        <div class="footer-state">
          <el-button size="small" @click="handleAllotConfirm" type="primary">确定分配</el-button>
          <el-button size="small" @click="handleAllotClear" type="primary">清楚已选</el-button>
          <el-button size="small" @click="handleAllotClose" type="primary">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  roleFindUser,
  roleDetail,
  roleOut,
  roleAssign,
  roleUserList
} from "@/api/styem/role";
import { userTreeData } from "@/api/styem/user";
import { MessageBox } from "element-ui";
import Bus from "@/utils/vueBus";
export default {
  props: {
    officeListData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      id: undefined,
      loading: true,
      roleDetailData: {
        name: undefined,
        officeName: undefined,
        enname: undefined,
        roleType: undefined,
        dataScopeName: undefined
      },
      roleUsersData: undefined,
      allotOpen: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      personListData: [],
      personListSelectData: undefined,
      ids: undefined,
      rawIds: undefined,
      roleSelectUsersData: [],
      roleManageBoolean: false,
      deptName: undefined
    };
  },
  created() {
    Bus.$off("outComeAllotId");
  },
  watch: {
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    Bus.$on("outComeAllotId", id => {
      this.handleClearRoleDetail();
      this.id = id;
      this.roleManageBoolean = true;
      this.getRoleUsers(id);
      // if (
      //   id == "1" ||
      //   id == "924131517326696548" ||
      //   id == "924131517326696541" ||
      //   id == "934522108367609949"
      // ) {
      //   this.roleManageBoolean = true;
      //   this.getRoleUsers(id);
      // } else {
      //   this.roleManageBoolean = false;
      //   this.getRoleUsers(id);
      // }
    });
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    async getRoleUsers(id) {
      const reponse = await roleFindUser({ roleId: id });
      const roleUsersData = reponse.data;
      roleUsersData &&
        roleUsersData.map(item => {
          item["stateName"] = 1;
        });
      this.roleUsersData = roleUsersData;
      const personListSelectData = [];
      for (const item in roleUsersData) {
        const subject = roleUsersData[item];
        const temp = {
          id: subject.id,
          name: subject.name,
          color: "red"
        };
        personListSelectData.push(temp);
      }
      this.personListSelectData = personListSelectData;
      const idsArry = [];
      roleUsersData &&
        roleUsersData.forEach(item => {
          idsArry.push(item.id);
        });
      this.ids = idsArry;
      this.rawIds = JSON.parse(JSON.stringify(idsArry));
      const roleDetailReponse = await roleDetail({ id });
      const detailSubject = roleDetailReponse.data;
      this.roleDetailData.name = detailSubject.name;
      this.roleDetailData.officeName = detailSubject.officeName;
      this.roleDetailData.enname = detailSubject.enname;
      this.roleDetailData.roleType = detailSubject.roleType;
      this.roleDetailData.dataScopeName =
        detailSubject.dataScopeName || undefined;
      this.loading = false;
    },
    // async getInspectRoleUsers(id) {
           
    //   const reponse = await roleUserList({ roleId: id });
    //   const roleUsersData = reponse.data;
    //   console.log(roleUserList)
    //   roleUsersData &&
    //     roleUsersData.map(item => {
    //       item["stateName"] = 0;
    //     });
    //   this.roleUsersData = roleUsersData;
    //   const personListSelectData = [];
    //   for (const item in roleUsersData) {
    //     const subject = roleUsersData[item];
    //     const temp = {
    //       id: subject.id,
    //       name: subject.name,
    //       color: "red"
    //     };
    //     personListSelectData.push(temp);
    //   }
    //   this.personListSelectData = personListSelectData;
    //   const idsArry = [];
    //   roleUsersData &&
    //     roleUsersData.forEach(item => {
    //       idsArry.push(item.id);
    //     });
    //   this.ids = idsArry;
    //   this.rawIds = JSON.parse(JSON.stringify(idsArry));
    //   const roleDetailReponse = await roleDetail({ id });
    //   this.roleDetailData.name = roleDetailReponse.name;
    //   this.roleDetailData.officeName = roleDetailReponse.officeName;
    //   this.roleDetailData.enname = roleDetailReponse.enname;
    //   this.roleDetailData.roleType = roleDetailReponse.roleType;
    //   this.roleDetailData.dataScopeName =
    //     roleDetailReponse.dataScopeName || undefined;
    //   this.loading = false;
    // },
    handleDelete(row) {
      const { id } = row;
      MessageBox.confirm("是否要移除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          roleOut({ roleId: this.id, userId: id }).then(reponse => {
            if (reponse.code == 200) {
              this.getRoleUsers(this.id);
            }
          });
        })
        .catch(e => e);
    },
    async nodeClick(data, node, e) {
      const { id } = data;
      const reponse = await userTreeData({ officeId: id });
      this.personListData = reponse.data;
    },
    handlePersonSelectClick(data) {
      const { id, name } = data;
      if (this.ids.indexOf(id) == -1) {
        this.personListSelectData.push({
          id,
          name,
          color: ""
        });
        this.ids.push(id);
      } else {
        this.$message.error("人员已存在，不能重复选择");
      }
    },
    async handlePersonSelectedClick(e) {
      const value = e.target.dataset.deleted;
      const id = e.target.id;
      if (value == "red") {
        const reponse = await roleOut({ roleId: this.id, userId: id });
        if (reponse.code == 200) {
          this.personListSelectData.forEach((item, index) => {
            if (item.id === id) {
              this.ids.splice(index, 1);
              this.personListSelectData.splice(index, 1);
            }
          });
          this.getRoleUsers(this.id);
        }
      }
    },
    handleAddLower() {
      this.allotOpen = true;
    },
    handleAllotClose(done) {
      this.allotOpen = false;
    },
    async handleAllotConfirm() {
      const rawIdsStr = this.rawIds.join(",");
      const idsStr = this.ids.join(",");
      if (rawIdsStr === idsStr) {
        this.$message.error("人员无修改");
      } else {
        const reponse = await roleAssign({
          id: this.id,
          ids: idsStr,
          name: this.roleDetailData.name
        });
        if (reponse.code == 200) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: reponse.msg
          });
          this.getRoleUsers(this.id);
          this.allotOpen = false;
        }
      }
    },
    async handleAllotClear() {
      const personListClearData = this.personListSelectData.filter(item => {
        return item.color == "red";
      });
      this.personListSelectData = personListClearData;
      this.ids = JSON.parse(JSON.stringify(this.rawIds));
    },
    handleClearRoleDetail() {
      this.roleDetailData.name = undefined;
      this.roleDetailData.officeName = undefined;
      this.roleDetailData.enname = undefined;
      this.roleDetailData.roleType = undefined;
      this.roleDetailData.dataScopeName = undefined;
      this.personListData = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.box-body{
  padding-top: 0;
}
/deep/.el-dialog{
  min-width: 550px;
}
/deep/ .el-table .cell {
  display: flex;
}
.tab-list-content .box-body {
  padding-top: 0;
  p {
    font-size: 12px;
    color: #333;
    line-height: 24px;
  }
}
/deep/.el-table .cell{
 justify-content: center;
}
.workbench-dialog {
  /deep/.el-dialog__body {
    padding: 10px 10px 0px 10px;
    .el-tree {
      margin-left: 20px;
      margin-top: 10px;
      height: 340px;
      overflow-y: scroll;
    }
    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #eee;
      height: 38px;
    }
    /deep/.el-tree__empty-text {
      display: none;
    }
  }
}
.allot-dialog-plane {
  display: flex;
  .dialog-item {
    ul {
      margin-top: 20px;
      height: 340px;
      overflow-y: scroll;
      li {
        padding-left: 20px;
        box-sizing: border-box;
        line-height: 24px;
        cursor: pointer;
      }
    }
    &.dialog-item-branch {
      width: 40%;
    }
    &.dialog-item-flex {
      flex: 1;
    }
    &.selected-item {
      /deep/.el-tree {
        height: auto;
        margin-top: 0px;
      }
      /deep/.selected-item-tree {
        .el-tree-node__label {
          color: red;
        }
      }
    }
    p {
      padding-left: 20px;
    }
  }
}
.allot-dialog-plane ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  -webkit-border-radius: 8px;
}
/*---滚动框背景样式--*/
.allot-dialog-plane ::-webkit-scrollbar-track-piece {
  background-color: rgba(255, 255, 255, 0.1);
  -webkit-border-radius: 8px;
}
.dialog-item-search {
  margin-left: 20px;
}
</style>
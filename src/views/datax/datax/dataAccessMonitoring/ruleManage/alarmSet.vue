<template>
  <div>
    <div class="selectedRuleDiv">
          <p>已选规则：</p>
          <div>{{ruleNamesString}}</div>
      </div>
    <el-form size="small" class="alarm-set">
      <el-form-item label="规则：">
        <el-radio-group v-model="radio" @change="radioChange">
          <el-radio label="1">自定义</el-radio>
          <el-radio label="2">角色选择</el-radio>
        </el-radio-group>
      </el-form-item>

      <div v-if="isShowCustomize" class="content">
        <el-form-item label="告警接收人：">
          <div @click="allotIsOpen" class="recipient">
            <span>+</span>
            <ul>
              <li v-for="(v, i) in selectedName" :key="i">{{ v.name }}</li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label="告警方式：">
          <el-checkbox-group v-model="alertType">
            <el-checkbox label="1">邮件</el-checkbox>
            <el-checkbox label="2">短信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div v-if="isShowRole" class="content">
        <el-form-item label="角色列表：" prop="roleList">
          <el-checkbox-group v-model="roleList">
            <el-checkbox
              v-for="item in roleListData"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="告警方式：">
          <el-checkbox-group v-model="alertType">
            <el-checkbox label="1">邮件</el-checkbox>
            <el-checkbox label="2">短信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>

      <div class="h2">疲劳度控制：</div>
      <el-form-item label="最大报警次数：" label-width="138px">
        <el-input
          v-model="alertMax"
          style="width: 100px"
          placeholder="请输入最大报警次数"
        ></el-input>
      </el-form-item>
      <el-form-item label="最小报警间隔：" label-width="138px">
        <el-input
          v-model="alertInterval"
          style="width: 100px"
          placeholder="请输入最小报警间隔"
        ></el-input>
        分钟
      </el-form-item>
      <el-form-item label="免打扰时间：" label-width="138px">
        <template>
          <el-time-picker
            v-model="startTime"
            format="HH:mm:ss"
          value-format="HH:mm:ss"
            placeholder="开始时间">
          </el-time-picker>
          -
          <el-time-picker
            arrow-control
            v-model="endTime"
            format="HH:mm:ss"
          value-format="HH:mm:ss"
            placeholder="结束时间">
          </el-time-picker>
        </template>
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="small"
        >保存</el-button
      >
      <el-button @click="goBack" size="small">返回</el-button>
    </div>

    <el-dialog
      title="选择告警接收人"
      :visible.sync="allotOpen"
      class="workbench-dialog"
      :before-close="handleAllotClose"
      append-to-body
      width="1200px"
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
          <ul>
            <li
              class="selected-item-li"
              v-for="(item, i) in personListSelectData"
              :style="{ color: item.color }"
              :id="item.id"
              :key="item.id"
              :data-deleted="item.color"
              @click="handlePersonSelectedClick(item, i)"
            >
              {{ item.name }} ×
            </li>
          </ul>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="footer-state">
          <el-button size="mini" @click="handleAllotConfirm" type="primary"
            >确定</el-button
          >
          <el-button size="mini" @click="handleAllotClose">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userTreeData } from "@/api/styem/user";
import { officeList } from "@/api/styem/dept";
import { roleList } from "@/api/styem/role";
import { monitorAlertSave,monitorAlertGetInfoById } from "@/api/datax/datax-access-monitoring";
export default {
  name: "WqzhhjglptUIAlarmSet",

  data() {
    return {
      allotOpen: false,
      radio: "1",
      alertType: [],
      roleList: [],
      checkList3: [],
      roleListData: [],
      isShowCustomize: true,
      isShowRole: false,
      alertMax: 3,
      alertInterval: "30",
      startTime: "",
      endTime: "",
      personListData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      deptName: undefined,
      officeListData: [],
      personListSelectData: [],
      ids: [],
      selectedName: [],
      idString:[],
      ruleNamesString:""
    };
  },
 props: {
    selectedIds:Array,
    ruleNames:Array,
    monitorAlertRow:Object,
    // alertIdsString:String,
  },
  mounted() {},
  created() {
    console.log(this.monitorAlertRow)
     this.idString = this.selectedIds.toString()
     this.ruleNamesString = this.ruleNames.join("，")
    this.getOfficeList();
    this.getroleList();
    console.log(this.monitorAlertRow.monitorAlert)
    if(this.monitorAlertRow && this.monitorAlertRow.monitorAlert){
        this.getInfoById()
    }else{
      this.radio="1"
      this.selectedName = []
      this.alertType = []
      this.alertMax = 3
      this.alertInterval = "30"
      this.startTime = ""
      this.endTime = ""
    }
  },
  watch: {
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
//回显
    getInfoById(){
      let strId = this.monitorAlertRow.monitorAlert.monitorValue
      if(this.monitorAlertRow.monitorAlert.monitorAlertScope==1){
        let userIds = strId.split(',')
        let uesrNames = this.monitorAlertRow.monitorAlert.users
        for(var i = 0; i < userIds.length; i++){
          let obj = {id:"",name:""}
         obj.index = i
         this.selectedName.push({id:userIds[i],name:uesrNames[i]})
        }
       console.log(this.selectedName)
      }else{
        this.roleList = strId.split(',')
      }
      this.radio = ""+this.monitorAlertRow.monitorAlert.monitorAlertScope
      let str = this.monitorAlertRow.monitorAlert.monitorAlertType
      this.alertType = str.split(',')
      this.alertMax = this.monitorAlertRow.monitorAlert.alertMax
      this.alertInterval = this.monitorAlertRow.monitorAlert.alertInterval
      this.startTime = this.monitorAlertRow.monitorAlert.startTime
      this.endTime = this.monitorAlertRow.monitorAlert.endTime

        // monitorAlertGetInfoById({id:this.monitorAlertRow.monitorAlert.id}).then(res => {
        //   console.log(res)
        // })

    },


    async getroleList() {
      const reponse = await roleList();
      const roleListData = [];
      for (const item in reponse.data) {
        const subject = reponse.data[item];
        this.roleListData.push(subject);
      }
    },
    handlePersonSelectedClick(v, i) {
      this.personListSelectData.splice(i, 1);
      this.ids.splice(i, 1);
    },
    allotIsOpen() {
      this.allotOpen = true;
    },
    handleAllotClose(done) {
      this.allotOpen = false;
    },
    handlePersonSelectClick(data) {
      const { id, name } = data;
      if (this.ids.indexOf(id) == -1) {
        this.personListSelectData.push({
          id,
          name,
          color: "",
        });
        this.ids.push(id);
      } else {
        this.$message.error("人员已存在，不能重复选择");
      }
    },
    async getOfficeList() {
      const reponse = await officeList();
      const menu = this.handleTree(
        reponse.data,
        "id",
        "parentId",
        "children",
        "0"
      );
      this.officeListData = menu;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    async nodeClick(data, node, e) {
      const { id } = data;
      const reponse = await userTreeData({ officeId: id });
      this.personListData = reponse.data;
    },
    handleAllotConfirm() {
      this.selectedName = this.personListSelectData;
      this.allotOpen = false;
    },

    //单选按钮
    radioChange(value) {
      if (value == 1) {
        this.isShowCustomize = true;
        this.isShowRole = false;
      } else {
        this.isShowRole = true;
        this.isShowCustomize = false;
      }
    },
    submitForm: function () {
      let queryForm = {};
      queryForm.monitorAlertScope = this.radio
      if(this.radio == 1){
        let monitorValueArr = this.selectedName.map(item => item.id);
        queryForm.monitorValue = monitorValueArr.toString()
      }else{
        queryForm.monitorValue = this.roleList.toString()
      }
      queryForm.monitorAlertType = this.alertType.toString();
      queryForm.alertMax = this.alertMax;
      queryForm.alertInterval = this.alertInterval;
      queryForm.startTime = this.startTime;
      queryForm.endTime = this.endTime;
      queryForm.monitorRules = this.idString
      if(this.monitorAlertRow && this.monitorAlertRow.monitorAlert){
        queryForm.id = this.monitorAlertRow.monitorAlert.id
      }
      // if(this.alertIdsString!==""){
      //   queryForm.id = this.alertIdsString
      // }

      console.log(queryForm);

      // return

      // this.$refs.userManageform.validate(async (valid) => {
      // if (valid) {
      this.isRequesting = true;
      const loading = this.$loading({
        lock: true,
        text: "正在保存提交，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      monitorAlertSave(queryForm)
        .then((reponse) => {
          if (reponse.code == 200) {
            this.$message.success("保存成功");
            this.$emit("goBack");
          } else {
            this.$notify({
              title: "系统提示",
              message: "保存失败",
              showClose: false,
            });
          }
        })
        .finally(() => {
          this.isRequesting = false;
        });
      loading.close();
      // } else {
      //   return false;
      // }
      // });
    },
    goBack() {
      this.$emit("goBack");
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
.alarm-set {
  padding: 20px 30px 30px 30px;
}
.content {
  padding-left: 50px;
}
.h2 {
  font-weight: bold;
  margin-bottom: 10px;
}
.allot-dialog-plane {
  display: flex;
  justify-content: space-around;
  min-height: 500px;
}
.selected-item-li {
  cursor: pointer;
}
.recipient {
  overflow: hidden;
  span {
    color: #fff;
    background-color: #409eff;
    display: block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    border-radius: 5px;
    float: left;
    margin-right: 10px;
    cursor: pointer;
  }
  ul {
    float: left;
    display: flex;
    li {
      margin-right: 20px;
    }
  }
}
.selectedRuleDiv{ 
  display: flex;
  padding: 0 30px;
  line-height: 30px;
  p{margin: 0; font-weight: bold;}
  }
</style>
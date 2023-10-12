<template>
  <div class="new">
    <el-form ref="userManageform" :model="form" label-width="110px">
      <el-form-item label="行业选择:" prop="">
        <el-radio-group v-model="form.industryType" @change="hangyeChange" size="small">
          <el-radio v-for="(v,i) in hangyeList" :key="i" :label="v.value">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排名维度:" prop="">
        <el-radio-group v-model="form.dimensionTime" @change="weiduChange" size="small">
          <el-radio v-for="(v,i) in timeChooseList" :key="i" :label="v.value">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="企业维度:" prop="">
        <el-radio-group v-model="form.enterprisesType" @change="qiyeChange" size="small">
          <el-radio v-for="(v,i) in qiyeWeiduList" :key="i" :label="v.value">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年份:" prop="" label-width="90px">
        <el-date-picker
          v-model="form.year"
          type="year"
          size="small"
          format="yyyy 年"
          value-format="yyyy"
          @change="yearChange"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="月份:" prop="" label-width="90px" v-show="form.dimensionTime == 2">
        <el-select v-model="form.month" placeholder="请选择月份" @change="monthChange" size="small" style="width:230px"> 
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组织机构:" prop="">
        <ul>
          <li v-for="(v,i) in organizationList" :key="i" class="organization">
            <span>{{v.name}}</span>
            <el-input v-model="v.value" placeholder="请输入数值" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </li>
        </ul>
      </el-form-item>
     
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm"
            >保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
   
    </el-form>
    
  </div>
</template>

<script>
import {
  environmentRankingInsert,
  environmentRankingGetOffice,
  environmentRankingList,
  environmentRankingUpdateById
} from "@/api/dataCenter/centerTopic.js";
import { _dateFormat } from "@/utils/dateFormat.js";
export default {
  data() {
    return {
      isRequesting: false,
      hangyeList:[
        {name:"热电", value: 10},
        {name:"电解铝", value: 20},
        {name:"氧化铝", value: 30}
      ],
      radioHangye:10,
      timeChooseList:[
        {name:"年度", value: 1},
        {name:"月度", value: 2}
      ],
      radioTimeChoose:1,
      qiyeWeiduList:[
        {name:"分公司", value: 1},
        {name:"分厂", value: 2}
      ],
      radioQiye:1,
      monthList:[
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
      organizationList:[],
      // organizationValues:[],
      form:{
        year:"",
        month:"",
        industryType:10,
        dimensionTime:1,
        enterprisesType:1,
      },
      query: [],
     
      

    //  [ {
    //     industryType:10,
    //     dimensionTime:1,
    //     enterprisesType:1,
    //     enterprisesName:,
    //     grade:
    //   },
    //   {
    //     industryType:10,
    //     dimensionTime:1,
    //     enterprisesType:1,
    //     enterprisesName:,
    //     grade:
    //   },]
      
    };
  },
  props: {
    row: Object,
    type: String,
  },

  created() {
    if (this.type == "edit") {
      this.getDetail()
    } else {
      this.getOffice()
    }
    console.log(this.row)
    console.log(this.type)
  },

  methods: {
    //获取详情
   async getDetail(){
     let res = await environmentRankingList({
                enterprisesType:this.row.enterprisesType,
                year:this.row.year,
                month:this.row.month,
                industryType:this.row.industryType
              })
     console.log(res);
      this.form.year=`${res.data[0].year}`,
      this.form.month=res.data[0].month,
      this.form.industryType=res.data[0].industryType,
      this.form.dimensionTime=res.data[0].dimensionTime,
      this.form.enterprisesType= Number(res.data[0].enterprisesType)
      var newArr= [];
      res.data.map(function(item, index) {
          var sevm= {};
          sevm["name"] = item.enterprisesName;
          sevm["value"] = item.grade;
          sevm["id"] = item.id;
          newArr[index] = sevm;
        });
      this.organizationList = newArr
      console.log(this.organizationList);
    },
    //获取组织机构
   async getOffice(){
      // console.log(this.form.enterprisesType,this.form.industryType)
        let res = await environmentRankingGetOffice({
          enterprisesType:this.form.enterprisesType,
          industryType:this.form.industryType
          })
        console.log(res);
        this.organizationList = res.data
        for(let item of this.organizationList){
          this.$set(item,'value','');
        }
        console.log(this.organizationList);   
    },
    //获取组织机构录入的分值
    // input(){
    //   this.organizationValues = this.organizationList.map(item => item.value)
    //   console.log(this.organizationValues);
    // },
    yearChange(){},
    monthChange(){},
    //行业切换
    hangyeChange(v){
      console.log(v);
      if(v == 10){
          this.qiyeWeiduList = [
          {name:"分公司", value: 1},
          {name:"分厂", value: 2}
        ]
      }else{
        this.qiyeWeiduList = [
          {name:"分公司", value: 1}
        ]
        this.form.industryType = v
        this.radioQiye = 1
      }
      this.getOffice()
    },
    //维度切换
    weiduChange(v){
      console.log(v);
    },
    //企业切换
    qiyeChange(v){
      console.log(v);
      this.form.enterprisesType = v
      this.getOffice()
    },
    timeChange(v){
      console.log(v);
    },
    goBack(){
      this.$emit("closeSelf")
    },

    //保存
    submitForm() {
      if (this.type == "edit") {
        let obj = {}
        for(var i = 0; i < this.organizationList.length; i++){      
          obj.index = i
          this.query.push({
            year:this.form.year,
            month:this.form.month,
            industryType:this.form.industryType,
            dimensionTime:this.form.dimensionTime,
            enterprisesType:this.form.enterprisesType,
            enterprisesName:this.organizationList[i].name,
            grade:this.organizationList[i].value,
            id:this.organizationList[i].id
          })
        }
      }else{
          let obj = {}
          for(var i = 0; i < this.organizationList.length; i++){      
            obj.index = i
            this.query.push({
              year:this.form.year,
              month:this.form.month,
              industryType:this.form.industryType,
              dimensionTime:this.form.dimensionTime,
              enterprisesType:this.form.enterprisesType,
              enterprisesName:this.organizationList[i].name,
              grade:this.organizationList[i].value
            })
          }
      }

       console.log(this.query)
//  return
      if (this.isRequesting) {
        return;
      }
      // this.$refs.userManageform.validate(async (valid) => {
      //   if (valid) {
          this.isRequesting = true;
          const loading = this.$loading({
            lock: true,
            text: "正在保存提交，请稍等...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.1)",
          });
          environmentRankingInsert(this.query)
            .then((reponse) => {
              if (reponse.code == 200) {
                this.$message.success("保存成功");
                this.$emit("closeSelf");
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
      //   } else {
      //     return false;
      //   }
      // });
    },

    
    close: function () {
      
    },
  },
};
</script>

<style lang="scss" scoped>
.new {
  padding-top: 20px;
  ::v-deep .el-form-item {
    width: 100%;
  }
  ::v-deep .el-select {
    width: 100%;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    .half-line {
      width: 50%;
    }
    .line {
      width: 100%;
    }

    ::v-deep .el-date-editor {
      width: 100%;
    }
    ::v-deep .el-cascader {
      width: 100%;
    }
    ::v-deep label {
      font-weight: 400;
    }
    .btn {
      display: flex;
      justify-content: center;
      padding-top: 26px;
    }
  }
}
div.dialog-caption {
  width: 100%;
  color: blue;
}
.organization{ 
  margin-bottom: 20px;
  display: flex; 
  span{ display: block; margin-right:20px; }
  .el-input{ width: 200px;}
  }
</style>
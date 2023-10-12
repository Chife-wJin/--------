<template>
  <div class="app-container list">
    <div v-loading="loading" style="min-height: 500px; padding-top:10px">
      <div class="group" v-for="(v, i) in dataList" :key="i">
        <div class="title">{{ v.classifyName }}</div>
        <div class="group-con">
          <div v-for="(j, n) in v.children" :key="n">
            <div class="area"  v-for="(k, m) in j.tmetaRecords" :key="m">
              <el-card class="box-card">
                <h2>{{ k.name }}</h2>
                <ul>
                  <li><span>发布日期：</span>{{ k.createDate }}</li>
                  <li><span>数据提供方：</span>{{ k.map.cntProvider }}</li>
                  <li><span>更新时间：</span>{{ k.map.timePoint | _dateFormat}}</li>
                  <li><span>数据更新频率：</span>{{ k.map.dtUpdateFre }}</li>
                  <li><span>资源记录数：</span>{{ k.map.dtRecNums }}</li>
                  <li><span>数据摘要：</span>{{ k.map.resAbs }}</li>
                </ul>
                <!-- <p><router-link :to="{path:k.map.router}"> 预览</router-link><a>下载</a></p> -->
                <p><a @click="preView(k)"> 查看数据</a><a>下载</a></p>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
        title=""
        v-if="isShowAlert"
        :before-close="handleDialogClose"
        :visible="true"
        width="80%"
        append-to-body
      >
        <New  />
      </el-dialog>
  </div>
</template>

<script>
import { treeLevelBean } from "@/api/dataCenter/metaData.js";
import{  _dateFormat } from "@/utils/dateFormat"
import New from "./new"
export default {
  name: "",

  data() {
    return {
      loading: true,
      params: {
        getShareExt: "",
        startTime: "",
        endTime: "",
        name: "",
      },
      shareExtentCodeList: [],
      dataList: [],
      cur: 0,
      isNoData:false,
      isShowAlert:false
    };
  },
  components: {
   New
  },
  props: {
    treeData:Object
  },
  created() {
    this.getContent();
  },
  watch: {
    treeData(newV, oldV) {
    //  console.log(newV);
       if(newV.children[0].children !== null){
        this.dataList = newV.children
       }else{
        this.dataList = [newV]
       }
     // console.log(this.dataList)
      this.dataList.map(item => {
        item.children.map(element => {
          element.tmetaRecords.map(v => {
            switch(v.map.dtUpdateFre){
            case "01":
              v.map.dtUpdateFre = "实时"
              break;
            case "02":
              v.map.dtUpdateFre = "每年"
              break;
            case "03":
              v.map.dtUpdateFre = "每半年"
              break;
            case "04":
              v.map.dtUpdateFre = "每季"
              break;
            case "05":
              v.map.dtUpdateFre = "每月"
              break;
            case "06":
              v.map.dtUpdateFre = "每周"
              break;
            case "07":
              v.map.dtUpdateFre = "每天"
              break;
            case "08":
              v.map.dtUpdateFre = "每小时"
              break;
            case "99":
              v.map.dtUpdateFre = "其他"
              break;
          }
          })
          
        });
      })

    },
  },
 filters: {
    _dateFormat (time) {
      let date = new Date(time)
      return _dateFormat(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    handleDialogClose: function () {
      this.isShowAlert = false;
    },
    async getContent() {
      this.loading = true;
      let res = await treeLevelBean();
      //console.log(res.data)
      this.dataList = [...res.data[this.cur].children];
      //console.log(this.dataList)
      this.dataList.map(item => {
        item.children.map(element => {
          element.tmetaRecords.map(v => {
            switch(v.map.dtUpdateFre){
            case "01":
              v.map.dtUpdateFre = "实时"
              break;
            case "02":
              v.map.dtUpdateFre = "每年"
              break;
            case "03":
              v.map.dtUpdateFre = "每半年"
              break;
            case "04":
              v.map.dtUpdateFre = "每季"
              break;
            case "05":
              v.map.dtUpdateFre = "每月"
              break;
            case "06":
              v.map.dtUpdateFre = "每周"
              break;
            case "07":
              v.map.dtUpdateFre = "每天"
              break;
            case "08":
              v.map.dtUpdateFre = "每小时"
              break;
            case "99":
              v.map.dtUpdateFre = "其他"
              break;
          }
          })
          
        });
      })
      this.loading = false;
    },
    handleQuery() {},
    resetQuery() {},
    preView(k){
      if(k.map.router && k.map.router !== 'dataCenter/centerTopic/BusinessData/topicSewagePermit/topicAirPollution'){
        this.$router.push({path:k.map.router})
      }else if(k.map.router == 'dataCenter/centerTopic/BusinessData/topicSewagePermit/topicAirPollution'){
        this.isShowAlert = true
      }else{
        this.$alert('暂无数据', '提示');
      }
      
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-loading-spinner {
  top: 20%;
}
.group {
  .title {
    background: #ddecfb;
    color: #000;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    margin-bottom: 30px;
  }
  .group-con {
    // display: flex;
    // flex-wrap: wrap;
    .area {
      .box-card {
        position: relative;
        margin: 0 15px 30px 15px;
        min-height: 100px;
        ul {
          overflow: hidden;
          margin-bottom: 10px;
          li {
            float: left;
            margin-right: 30px;
            line-height: 30px;
            font-size: 14px;
            span{
              font-weight: bold;
              color: #333;
            }
          }
        }
        h2 {
          color: #348ce5;
          font-size: 14px;
          margin-top: 0;
        }
        p {
          position: absolute;
          bottom: 0;
          width: 95%;
          text-align: right;
          a {
            color: #348ce5;
            font-size: 12px;
            display: inline-block;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
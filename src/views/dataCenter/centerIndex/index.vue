<template>
  <div class="content">
    <!-- 资产概况 -->
    <div class="module">
      <!-- <div class="title">资产概况</div> -->
      <div
        v-for="i in assetDataVolume"
        :key="i.id"
        class="i-card span-5 fl assets"
        :style="{ background: i.color }"
      >
        <div class="data">
          <div class="data-title">
            <span>{{ i.title }}（{{ i.unit }}）</span>
            <img :src = i.icon alt  class="logo"/>
          </div>
          <div>{{ i.total }} </div>
          <!-- <div class="zb-div">较上一年增比 <span>{{ i.increace }} <img src="@/assets/images/dataCenter/arrow.png"></span></div> -->

        </div>

      </div>
    </div>
    
    <!-- 饼图，柱状图 -->
    <div class="module">
      <div class="i-card span-2">
        <div id="pie" style="width: 100%; height: 380px"></div>
      </div>
      <div class="i-card span-2">
        <div id="bar" style="width: 100%; height: 380px"></div>
      </div>
    </div>
    <div class="module">
       <!-- 元数据统计 -->
    <div class="card span-3">
      <div class="title">元数据</div>
      <div class="i-card2">
        <div v-for="i in mataData" :key="i.id" class="span-2 cart2-con" :style="{ 'background': 'url(' + i.icon + ')','background-repeat':'no-repeat' }">
          <div class="data1"><p>{{ i.title }}（{{ i.unit }}）</p><p>{{ i.total }} </p></div>
        </div>
      </div>
      
    </div>
    <!-- 数据质量统计 -->
    <div class="card span-3">
      <div class="title">数据质量</div>
      <div class="i-card2">
        <div v-for="i in qualityData" :key="i.id" class="sjzl-con">
          <div class="logo">
            <img :src=i.icon alt />
          </div>
          <div class="data2">
            <div>{{ i.title }}({{ i.unit }})</div>
            <div>{{ i.total }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 数据共享统计 -->
    <div class="card span-3">
      <div class="title">数据共享</div>
      <div>
        <div v-for="i in sharedData" :key="i.id" class="share-con">
          <div class="logo">
            <img :src=i.icon alt />
          </div>
          <div class="data3">
            <div>{{ i.title }}（{{ i.unit }}）</div>
            <div>{{ i.total }}</div>
          </div>
        </div>
      </div>
    </div>
    </div>

  </div>
</template>

<script>
import {
  getHomepageData,
  firstStatistics,
  dataIncrementProportion,
  dataIncrementStatistics,
  meteDataStatistics,
  dataQuality,
  dataSharingStatistics
  } from "@/api/dataCenter/centerIndex";
export default {
  name: "ExhaustRemaining",
  data() {
    return {
      // 资产概况
      assetDataVolume: [
        {
          title: "总数据量",
          total: 0,
          increace:"48%",
          icon: require("@/assets/images/dataCenter/shicon1.png"),
          id: "data_size",
          unit: "条",
        },
        {
          title: "文件数量",
          total: 0,
          increace:"28%",
          icon: require("@/assets/images/dataCenter/wjicon2.png"),
          id: "file_nums",
          unit: "个",
        },
        {
          title: "今日新增量",
          total: 0,
          increace:"5%",
          icon: require("@/assets/images/dataCenter/xzicon3.png"),
          id: "today_ct",
          unit: "条",
        },
        {
          title: "结构化存储",
          total: 0,
          increace:"6%",
          icon: require("@/assets/images/dataCenter/ccicon4.png"),
          id: "disk_size",
          unit: "MB",
        },
        {
          title: "非结构化存储",
          total: 0,
          increace:"8%",
          icon: require("@/assets/images/dataCenter/ccicon5.png"),
          id: "file_size",
          unit: "MB",
        },
      ],
      //元数据统计
      mataData: [
        { title: "数据资目录", total: 0, id: "数据资目录", unit: "个", icon: require("@/assets/images/dataCenter/metaDatabg1.png"),},
        { title: "元素属性", total: 0, id: "元素属性", unit: "个", icon: require("@/assets/images/dataCenter/metaDatabg2.png"),},
        { title: "元数据", total: 0, id: "元数据", unit: "个", icon: require("@/assets/images/dataCenter/metaDatabg3.png"),},
        { title: "元数据模板", total: 0, id: "元数据模板", unit: "个", icon: require("@/assets/images/dataCenter/metaDatabg4.png"),},
      ],
      //数据质量统计
      qualityData: [
        { title: "质量模型数", total: 0, id: "质量管理模型", unit: "个",icon:require("@/assets/images/dataCenter/zjzlicon1.png") },
        { title: "质量规则数", total: 0, id: "质量规则", unit: "个",icon:require("@/assets/images/dataCenter/zjzlicon2.png")},
        { title: "今日问题数量", total: 0, id: "今日问题数量", unit: "条",icon:require("@/assets/images/dataCenter/zjzlicon3.png") },
        { title: "今日数据治理量", total: 0, id: "今日数据治理量", unit: "条",icon:require("@/assets/images/dataCenter/zjzlicon4.png") },
      ],
      //数据共享统计
      sharedData: [
        { title: "访问接口次数", total: 0, id: "接口访问次数", unit: "次",icon:require("@/assets/images/dataCenter/shareicon1.png") },
        { title: "访问用户总数", total: 0, id: "访问用户次数", unit: "个",icon:require("@/assets/images/dataCenter/shareicon2.png") },
        { title: "接口交换数据量", total: 0, id: "接口交换数据量", unit: "条",icon:require("@/assets/images/dataCenter/shareicon3.png") },
      ],
      // 饼状图
      dataClassifyMap: [
        { value: 0, name: "DCS数据" },
        { value: 0, name: "自行监测数据" },
        { value: 0, name: "微站数据" },
        { value: 0, name: "业务数据" },
        { value: 0, name: "空间数据" },
      ],
      // 柱状图
      incrDataY: [],
      incrDataX: [],
    };
  },

  created() {
    // this.init();
    this.getFirstStatistics()
    this.getDataIncrementProportion()
    this.getDataIncrementStatistics()
    this.getMeteDataStatistics()
    this.getDataQuality()
    this.getDataSharingStatistics()
  },

  methods: {
    //资产状况处理
    getFirstStatistics(){
      firstStatistics().then(res => {
         if (res.data) {
          this.assetDataVolume.forEach((item) => {
            item.total = res.data[item.id];
          });
        }
      })
    },
    //饼图
    getDataIncrementProportion(){
      dataIncrementProportion().then(res => {
        // console.log(res)
        this.dataClassifyMap = Object.keys(res.data).map(
            (item) => {
              return { value: res.data[item], name: item };
            }
          );
        this.drawPieChart();
      })

    },
    //柱图
    getDataIncrementStatistics(){
      dataIncrementStatistics().then(res => {
       if (res.data) {
          this.incrDataY = [];
          this.incrDataX = [];
          let arr = []
          arr = Object.keys(res.data).map((item) => {
              return { value: res.data[item], name: item };
            }
          );
          arr.forEach((item) => {
            this.incrDataY.push(item.value);
            this.incrDataX.push(item.name);
          });
          this.drawBarChart();
        }
      })
    },

    //元数据
    getMeteDataStatistics(){
      meteDataStatistics().then(res => {
        if (res.data) {
          this.mataData.forEach((item) => {
            item.total = res.data[item.id];
          });
        }
      })
    },

    //数据质量
    getDataQuality(){
      dataQuality().then(res => {
        // console.log(res)
         if (res.data) {
          this.qualityData.forEach((item) => {
            item.total = res.data[item.id];
          });
        }
      })
    },

    //数据共享
    getDataSharingStatistics(){
      dataSharingStatistics().then(res => {
        // console.log(res)
         if (res.data) {
          this.sharedData.forEach((item) => {
            item.total = res.data[item.id];
          });
        }
      })
    },


    drawPieChart() {
      this.circleCharts = echarts.init(document.getElementById("pie"));
      this.circleCharts.setOption({
        title: {
          text: "数据资产统计",
          // subtext: "数据量",
          left: "0.6%",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: "3%",
          top:"middle",
          icon: "circle",
          itemHeight: 10,
          itemGap:10

        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: this.dataClassifyMap,
             radius: ['50%', '65%'],
            center: ["40%", "60%"],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },

    drawBarChart() {
      this.circleCharts = echarts.init(document.getElementById("bar"));
      this.circleCharts.setOption({
        title: {
          text: "数据增量情况",
          left: '0.6%',
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          type: "category",
          data: this.incrDataX,
        },
        yAxis: {
          type: "value",
        },
        grid: {
          top:"16%",
          right: 0,
        },
        series: [
          {
            data: this.incrDataY,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "#f0f3f8",
            },
            barWidth:30,
            itemStyle: {
            normal: {
              //柱形图圆角，初始化效果
              barBorderRadius: [30, 30, 0, 0],
              // 设置颜色渐变
              color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                      { offset: 0, color: '#eec47c' },
                      { offset: 0.5, color: '#f1b855' },
                      { offset: 1, color: '#f09b08' }
                  ]
              ),
              //这里是重点
                // color: function(params) {
                // 	//注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                //     var colorList = ['#0083ff','#0083ff','#0083ff','#0083ff','#0083ff','#0083ff','#0083ff','#0083ff','#0083ff','#0083ff','#0083ff','#0083ff'];
                //     return colorList[params.dataIndex]
                //     }
                }
            }

          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  background-color: #efefef;
  padding: 12px;
  height: 100%;
  overflow: auto;

  .module {
    padding: 12px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    
    .title {
      font-weight: bold;
      padding-bottom: 12px;
      font-size: 18px
    }

    .assets {
      color: #333;
    }

    .i-card {
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 20px 20px;
      align-items: center;
      background: #fff;
      border-radius: 10px;
      

      .data {
        width: 100%;
        .data-title{
          color: #7a829c;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          .logo {
            width: 40px;
            height: auto;
          }
        }
        :nth-child(2){
          font-size: 30px;
          font-weight: bold;
        }
        // :last-child {
        //   font-size: 12px;
        //   color: #c5c8d2;
        //   span{
        //     color: #58d4af;
        //     img{ position: relative; top:3px}
        //   }
        // }
       
      }
    }
  }

  .card{ 
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    .i-card2{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .cart2-con{
        height: 110px;
        padding: 20px 0 0 0;
        margin-bottom: 20px;
        .data1{ 
          padding-left:100px;
          p{ margin: 0;}
          p:nth-child(1){
            font-size: 14px;
            color: #575b6b;
          }
           p:nth-child(2){
            font-size: 26px;
           font-weight: bold;
          }
         }
        
      }
      .sjzl-con{
        display: flex;
        justify-content:center;
        background: #fafafa;
        border-radius: 10px;
        width: 48%;
        height: 110px;
        margin-bottom: 20px;
        padding: 20px 0 0 0;
        .logo{
          padding-top:10px;
          padding-right:20px
          }
        .data2{
          width: 125px;
          div:nth-child(1){
            font-size: 14px;
            color: #575b6b;
          }
          div:nth-child(2){
            font-size: 32px;
            font-weight: bold;
          }
        }
      }
      
    }
    .share-con{
        display: flex;
        margin: 10px 0 20px 0;
        .logo{padding: 0 30px;}
        .data3{
          display: flex;
          justify-content: space-between;
          width: 70%;
          line-height: 58px;
          font-size: 18px;
          div:nth-child(2){
            font-size: 32px;
          }
        }
      }
  
  }

  .span-5 {
    width: calc(100% / 5 - 20px);

  }

  .span-4 {
    width: calc(100% / 4 - 20px);

  }
  .span-2 {
    width: calc(100% / 2 - 16px);

  }
  .span-3 {
    width: calc(100% / 3 - 20px);

  }
}
</style>

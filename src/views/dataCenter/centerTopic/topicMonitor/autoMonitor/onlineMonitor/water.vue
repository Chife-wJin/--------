<template>
  <div>
      <el-form
          class="search-body"
          :model="queryParamsWater"
          :inline="true"
          label-width="78px"
        >
        <el-form-item label="数据:" prop="flowFlag1">
            <el-select
              v-model="flowFlag1"
              size="small"
              style="width: 180px"
              placeholder="请选择维度"
            >
            <el-option label="流量" value="1"></el-option>
            <el-option label="浓度" value="2"></el-option>
            <!-- <el-option label="折算参数" value="3"></el-option> -->
            </el-select>
        </el-form-item>
        <el-form-item label="时间:" prop="hourOrDay">
            <el-select
              v-model="queryParamsWater.hourOrDay"
              size="small"
              style="width: 180px"
              placeholder="请选择维度"
            >
            <el-option label="小时" value="1"></el-option>
            <el-option label="天" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="企业:" >
          <el-cascader
            v-model="valueWater"
            size="small"
            :show-all-levels="false"
            :props="cascaderPropsWater"
            @change="lastNodeValueWater"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="dateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryWater">查询</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              size="small"
              @click="resetHandle"
              >重置</el-button
            >
        </el-form-item>
      </el-form>
      <div v-if="queryParamsWater.flowFlag==1">
        <el-table v-loading="loading" border class="container-table" :data="ListWater">
          <el-table-column type="index" width="55" label="序号">
            <template slot-scope="scope">
              {{
              (queryParamsWater.pageNum - 1) * queryParamsWater.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="psName" label="企业名称"></el-table-column>
          <el-table-column prop="mpName" label="监控点"></el-table-column>
          <el-table-column prop="dataTime" label="监测时间" >
            <template slot-scope="scope">
              <span>{{scope.row.dataTime | _dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pollutantName" label="污染物" ></el-table-column>
          <el-table-column prop="minValue" label="最小流量" ></el-table-column>
          <el-table-column prop="avgValue" label="平均流量" ></el-table-column>
          <el-table-column prop="maxValue" label="最大流量" ></el-table-column>
          <el-table-column prop="couValue" label="排放量"></el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table v-loading="loading" border class="container-table" :data="ListWater">
          <el-table-column type="index" width="50" label="序号">
            <template slot-scope="scope">
              {{
              (queryParamsWater.pageNum - 1) * queryParamsWater.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="psName" label="企业名称"></el-table-column>
           <el-table-column prop="mpName" label="监控点"></el-table-column>
          <el-table-column prop="dataTime" label="监测时间" >
            <template slot-scope="scope">
              <span>{{scope.row.dataTime | _dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pollutantName" label="污染物" ></el-table-column>
          <el-table-column prop="minValue" label="最小浓度" ></el-table-column>
          <el-table-column prop="avgValue" label="平均浓度" ></el-table-column>
          <el-table-column prop="maxValue" label="最大浓度" ></el-table-column>
        </el-table>
      </div>
      <!-- <div v-else>
        <el-table v-loading="loading" border class="container-table" :data="ListWater">
          <el-table-column type="index" width="50" label="序号">
            <template slot-scope="scope">
              {{
              (queryParamsWater.pageNum - 1) * queryParamsWater.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column prop="psName" label="企业名称"></el-table-column>
           <el-table-column prop="mpName" label="监控点"></el-table-column>
          <el-table-column prop="dataTime" label="监测时间" >
            <template slot-scope="scope">
              <span>{{scope.row.dataTime | _dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pollutantName" label="污染物" ></el-table-column>
          <el-table-column prop="minValue" label="最小值" ></el-table-column>
          <el-table-column prop="avgValue" label="平均值" ></el-table-column>
          <el-table-column prop="maxValue" label="最大值" ></el-table-column>
        </el-table>
      </div> -->
    <pagination
      v-show="totalWater>0"
      :total="totalWater"
      :pageNo.sync="queryParamsWater.pageNum"
      :limit.sync="queryParamsWater.pageSize"
      @pagination="getListWater"
      class="pull-right"
    />
  </div>
</template>

<script>
import {
  companyName,
  waterList,
  mpPageWater
} from "@/api/dataCenter/centerTopic"
import{  _dateFormat } from "@/utils/dateFormat"
export default {
  name: 'water',
  data(){
    return {
      value1:"",
        queryParamsWater: {
        pageNum: 1,
        pageSize: 15,
        flowFlag: "1",
        hourOrDay:"1",
        startDate:'',
        endDate:'',
        psinfoGateId: ''
      },
      flowFlag1:"1",
        valueWater:[],
        totalWater: 1,
        loading: true,
        ListWater: [],
        cascaderPropsWater: {
        label: "psName",
        value: "id",
        children: {
         label:'mpName',
         value:"id"
        },
        lazy: true,
        lazyLoad: this.lazyLoadWater
      },
    }
  },
  filters: {
    _dateFormat (time) {
      let date = new Date(time)
      return _dateFormat(date, 'yyyy-MM-dd hh:mm')
    }
  },
  created(){
      this.getListWater();
      },
  methods:{
    lastNodeValueWater(v){
      // console.log(v)
      // this.queryParamsWater.psinfoGateId = this.valueWater[1]
      this.queryParamsWater.psinfoGateId = v[1]
    },
    //废水级联菜单
    lazyLoadWater(node, resolve) {
      this.getWaterMenu(node, resolve);
    },
    async getWaterMenu(node, resolve) {
      //console.log(node)
      let that = this;
      let level = node.level;
      if (!node.data) {
        await companyName().then(res => {//接口
          const nodes = Array.from(res.data).map(item => ({
            id: item.id,
            psName: `${item.psName}`,
            leaf: level >= 1
          }));
          // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          resolve(nodes);
         // console.log(nodes)
        });
      } else {
        //console.log(node)
        await waterList({ psId: node.data.id }).then(
          res => {
            const nodes = Array.from(res.data).map(item => ({
              id: item.id,
              psName: `${item.mpName}`,
              leaf: level >= 1
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          }
        );
      }
    },
    async getListWater() {
      this.loading = true;
      const reponse = await mpPageWater(this.queryParamsWater);
      console.log(reponse)
      this.ListWater = reponse.data.records;
      this.totalWater = reponse.data.total;
      this.loading = false;
    },
    dateChange(){
      if(this.value1){
          this.queryParamsWater.startDate = this.value1[0]
          this.queryParamsWater.endDate = this.value1[1]
          console.log(this.queryParamsWater)
        }
    },
    handleQueryWater() {
      this.queryParamsWater.pageNum = 1;
      this.queryParamsWater.flowFlag = this.flowFlag1
      this.getListWater();
    },
    resetHandle() {
      this.queryParamsWater.pageNum = 1,
      this.queryParamsWater.pageSize = 15,
      this.queryParamsWater.flowFlag = "1",
      this.queryParamsWater.hourOrDay = "1";
      this.queryParamsWater.psinfoGateId = "";
      this.queryParamsWater.startDate = "",
      this.queryParamsWater.endDate = "",
      this.value1 = ""
      this.flowFlag1 = "1" 
      this.getListWater();
    },
  },
}
</script>
<style lang='scss' scoped>
.search-body .el-checkbox{
  margin-right: 0; 
  margin-left: 15px;
}
.search-body{
  overflow: hidden;
}
.cascader{ 
    padding: 5px 20px; 
    display:inline-block;
}
::v-deep .el-range-separator {
    width: 28px;
  }
</style>
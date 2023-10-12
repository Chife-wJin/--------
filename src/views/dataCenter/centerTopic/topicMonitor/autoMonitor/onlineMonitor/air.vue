<template>
  <div>
      <el-form
          class="search-body"
          :model="queryParamsAir"
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
            <el-option label="折算参数" value="3"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="时间:" prop="hourOrDay">
            <el-select
              v-model="queryParamsAir.hourOrDay"
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
            v-model="valueAir"
            size="small"
            :show-all-levels="false"
            :props="cascaderPropsAir"
            @change="lastNodeValueAir"
            >
          </el-cascader>
        </el-form-item>
        <!-- <el-form-item label="开始时间:" prop="startDate">
            <el-date-picker
              v-model="queryParamsAir.startDate"
              type="date"
              size="small"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="选择开始时间">
            </el-date-picker>
        </el-form-item>
        
        <el-form-item label="结束时间:" prop="endDate">
            <el-date-picker
              v-model="queryParamsAir.endDate"
              type="date"
              size="small"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="选择结束时间">
            </el-date-picker>
        </el-form-item> -->
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
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryAir">查询</el-button>
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
      <div v-if="queryParamsAir.flowFlag==1">
        <el-table v-loading="loading" border class="container-table" :data="ListAir">
          <el-table-column type="index" width="55" label="序号">
            <template slot-scope="scope">
              {{
              (queryParamsAir.pageNum - 1) * queryParamsAir.pageSize + scope.$index + 1
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
    <div v-else-if="queryParamsAir.flowFlag==2">
        <el-table v-loading="loading" border class="container-table" :data="ListAir">
          <el-table-column type="index" width="50" label="序号">
            <template slot-scope="scope">
              {{
              (queryParamsAir.pageNum - 1) * queryParamsAir.pageSize + scope.$index + 1
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
          <el-table-column prop="minZs" label="最小折算浓度" ></el-table-column>
          <el-table-column prop="avgZs" label="平均折算浓度" ></el-table-column>
          <el-table-column prop="maxZs" label="最大折算浓度" ></el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table v-loading="loading" border class="container-table" :data="ListAir">
          <el-table-column type="index" width="50" label="序号">
            <template slot-scope="scope">
              {{
              (queryParamsAir.pageNum - 1) * queryParamsAir.pageSize + scope.$index + 1
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
      </div>
    <pagination
      v-show="totalAir>0"
      :total="totalAir"
      :pageNo.sync="queryParamsAir.pageNum"
      :limit.sync="queryParamsAir.pageSize"
      @pagination="getListAir"
      class="pull-right"
    />
  </div>
</template>

<script>
import {
  companyName,
  airList,
  mpPageAir
} from "@/api/dataCenter/centerTopic"
import{  _dateFormat } from "@/utils/dateFormat"
export default {
  name: 'air',
  data(){
    return {
       value1:"",
        queryParamsAir: {
        pageNum: 1,
        pageSize: 15,
        flowFlag: "1",
        hourOrDay:"1",
        startDate:"",
        endDate:"",
        psinfoGateId: ""
      },
      flowFlag1:"1",
        valueAir:[],
        totalAir: 1,
        loading: true,
        ListAir: [],
        cascaderPropsAir: {
        label: "psName",
        value: "id",
        children: {
          label:"mpName",
          value:"id"
        },
        lazy: true,
        lazyLoad: this.lazyLoadAir
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
      this.getListAir();
  },
  methods:{
      lastNodeValueAir(v){
      //  console.log(v)
      // this.queryParamsAir.psinfoGateId = this.valueAir[1]
      this.queryParamsAir.psinfoGateId = v[1]
    },
    //废气级联菜单
    lazyLoadAir(node, resolve) {
      this.getAirMenu(node, resolve);
    },
    async getAirMenu(node, resolve) {
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
        await airList({ psId: node.data.id }).then(
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
    async getListAir() {
      this.loading = true;
      const reponse = await mpPageAir(this.queryParamsAir)
      console.log(reponse)
      this.ListAir = reponse.data.records;
      this.totalAir = reponse.data.total;
      this.loading = false;
    },
     dateChange(){
      if(this.value1){
      this.queryParamsAir.startDate = this.value1[0]
      this.queryParamsAir.endDate = this.value1[1]
      // console.log(this.queryParamsAir)
      }
    },
    handleQueryAir() {
      this.queryParamsAir.pageNum = 1;
      this.queryParamsAir.flowFlag = this.flowFlag1
      this.getListAir();
    },
     resetHandle() {
      this.queryParamsAir.pageNum = 1,
      this.queryParamsAir.pageSize = 15,
      this.queryParamsAir.flowFlag = "1",
      this.queryParamsAir.hourOrDay = "1";
      this.queryParamsAir.psinfoGateId = "";
      this.queryParamsAir.startDate = "",
      this.queryParamsAir.endDate = "",
      this.value1 = ""
      this.flowFlag1 = "1" 
      this.getListAir();
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
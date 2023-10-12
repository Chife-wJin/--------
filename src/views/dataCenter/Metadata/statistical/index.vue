<template>
  <div class="app-container">
    <el-form
      class="search-body"
      :model="params"
      ref="queryForm"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="数据分发方:" prop="company">
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('cntProvider')"
          :searchValue="params.dataType"
        />
      </el-form-item>
      <el-form-item label="数据维护方:" prop="company">
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('cntProvider')"
          :searchValue="params.dataType"
        />
      </el-form-item>
      <el-form-item label="数据类型:" prop="resCat">
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('resCat')"
          :searchValue="params.resCat"
        />
      </el-form-item>
      <el-form-item label="数据提供方:" prop="cntProvider">
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('cntProvider')"
          :searchValue="params.cntProvider"
        />
      </el-form-item>
      <el-form-item label="数据管理方:" prop="company">
        <SearchBar
          style="width: 180px"
          @handleSearch="handleSearch('cntProvider')"
          :searchValue="params.dd"
        />
      </el-form-item>

      <el-form-item label="数据共享范围:" prop="getShareExt">
        <el-select v-model="params.getShareExt" size="small" style="width: 180px">
          <el-option
            v-for="item in shareExtentCodeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提供方式:" prop="company">
        <el-select v-model="params.sh" size="small" style="width: 180px">
          <el-option
            v-for="item in shList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间:" prop="startDate">
        <el-date-picker
          v-model="params.startDate"
          type="date"
          placeholder="选择日期"
          size="samll"
          style="width: 180px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间:" prop="endDate">
        <el-date-picker
          v-model="params.endDate"
          type="date"
          placeholder="选择日期"
          size="samll"
          style="width: 180px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <span class="red">（未设置维度即为默认*）</span>
        <el-button
          type="success"
          icon="el-icon-search"
          size="mini"
          @click="setDimension"
          >设置维度</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" type="primary"
          plain
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="表格" name="first">
        <div class="information-body">
          <el-table
            :data="tableData"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            :stripe="true"
            border
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column label="数据资源类别" prop="name">
            </el-table-column>
            <el-table-column label="共享范围" prop="name">
            </el-table-column>
            <el-table-column label="文件下载">
              <el-table-column label="非空间数据">
                <el-table-column prop="address" label="元数据数量">
                </el-table-column>
              </el-table-column>
              <el-table-column label="空间数据">
                <el-table-column prop="address" label="元数据数量">
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column>
              <el-table-column label="非空间数据">
                <el-table-column prop="name" label="元数据数量">
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="网页链接（Web URL）">
              <el-table-column label="非空间数据">
                <el-table-column prop="name" label="元数据数量">
                </el-table-column>
              </el-table-column>
              <el-table-column label="空间数据">
                <el-table-column prop="name" label="元数据数量">
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="离线数据服务">
              <el-table-column label="非空间数据">
                <el-table-column prop="name" label="元数据数量">
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="其他">
              <el-table-column label="非空间数据">
                <el-table-column prop="name" label="元数据数量">
                </el-table-column>
              </el-table-column>
              <el-table-column label="空间数据">
                <el-table-column prop="name" label="元数据数量">
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          :pageNo.sync="params.pageNo"
          :limit.sync="params.pageSize"
          @pagination="getList"
          class="pull-right"
        />
      </el-tab-pane>
      <el-tab-pane label="图形" name="second">
        <div id="bar"></div>
      </el-tab-pane>
    </el-tabs>
    <SearchBox
      v-if="isSearchBoxShow"
      title="选择父id"
      :showType="seacherBarType"
      :data="data"
      @getCheckedData="getCheckedData"
      @close="close"
    />
    <el-dialog
      :visible.sync="isShowSettingBox"
      width="800px"
      append-to-body
      title="设置维度"
    >
      <el-table
        :data="tableData2"
        border
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column prop="name" label="维度名称"> </el-table-column>
        <el-table-column label="行标签">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.line"
              :disabled="scope.row.xdisabled"
              @change="changeXTag(scope.row, scope.$index)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="列标签">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.column"
              :disabled="scope.row.ydisabled"
              @change="changeYTag(scope.row, scope.$index)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <p>行标签：{{ xTagString }}</p>
      <p>列标签：{{ yTagString }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="isShowSettingBox = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDatalist,
  getResourceDirectoryTree,
  getprovideTree,
  getAllMultiDimensional,
  setMultiDimensional,
  tMetaRecordListGetData
} from "@/api/dataCenter/metaData.js";
import SearchBar from "../components/searchBar.vue";
import SearchBox from "../components/searchBox.vue";
export default {
  name: "List",
  data() {
    return {
      seacherBarType:"",
      tableData: [],
      tableData2: [],
      xTag: [],
      yTag: [],
      xRow:[],
      yRow:[],
      total: 0,
      activeName: "first",
      isSearchBoxShow: false,
      isShowSettingBox: false,
      curValue: "",
      params: {
        // company: "",
        // resCat: "",
        // cntProvider: "",
        // fw: "",
        // sh: "",
        // fb: "",
        // startDate:"",
        // endDate:"",
        pageNo: 1,
        pageSize: 15,
      },
      fbList: [
        {
          value: "1",
          label: "pk",
        },
      ],
      shList: [
        {
          value: "1",
          label: "fffccc",
        },
      ],
      fwList: [
        {
          value: "1",
          label: "fffggg",
        },
      ],

      ddList: [
        {
          value: "1",
          label: "frff",
        },
      ],
      data:[],
      shareExtentCodeList: []
    };
  },
  created: function () {
    this.getList();
    this.getDataTypeList("shareExtentCode");
  },
  components: {
    SearchBar,
    SearchBox,
  },
  computed: {
    xTagString: function () {
      return this.xTag.join(",");
    },
    yTagString: function () {
      return this.yTag.join(",");
    },
  },
  methods: {
    getDataTypeList: function (type) {
      getDatalist({
        type,
      }).then((res) => {
        let str = `${type}List`;
        this[str] = res.data;
      });
    },
    getCheckedData: function (data) {
     // console.log(data)
      this.params[this.curValue] = data.name;
      this[this.curValue] = data.id;
      this.isSearchBoxShow = false;
    },
    handleSearch: function (value) {
      if (value == "resCat") {
         this.seacherBarType = "resCat"
        this.getResourceDirectoryTree();
      } else if ((value = "cntProvider")) {
         this.seacherBarType = "cntProvider"
        this.getprovideTree();
      }
      //console.log(value)
      this.curValue = value;
      this.isSearchBoxShow = true;
    },
    getResourceDirectoryTree() {
      getResourceDirectoryTree().then((res) => {
        console.log(res)
        this.data = res.data.length ? res.data : [];
      });
    },
    getprovideTree() {
      getprovideTree().then((res) => {
        console.log(res)
        this.data = res.data.length ? res.data : [];
      });
    },
    changeXTag: function (row, idx) {
      if (row.line) {
        this.xTag.push(row.name);
        this.xRow.push(row)
        row.ydisabled = true
      } else {
        const index = this.xRow.findIndex(text => text.name === row.name);
        this.xTag.splice(index, 1);
        this.xRow.splice(index,1)
        row.xdisabled = false
        row.ydisabled = false
      }
      console.log("xRow",this.xRow)
    },
   
    changeYTag: function (row, idx) {
      if (row.column) {
        this.yTag.push(row.name);
        this.yRow.push(row)
        row.xdisabled = true
      } else {
        this.yTag.splice(idx, 1);
        const index = this.yRow.findIndex(text => text.name === row.name);
        this.yTag.splice(index, 1);
        this.yRow.splice(index,1)
        row.xdisabled = false
        row.ydisabled = false
      }
      console.log("yRow",this.yRow)
    },
    handleClick: function () {
      if (this.activeName == "second") {
        this.$nextTick(() => {
          this.drawBar();
        });
      }
    },
    close: function () {
      this.isSearchBoxShow = false;
    },

    drawBar() {
      this.barCharts = this.$echarts.init(document.getElementById("bar"));
      this.barCharts.clear();
      this.barCharts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        xAxis: {
          type: "category",
	  data:[],
          // data: this.xData
        },
        yAxis: {
          type: "value",
          minInterval: 1,
        },
        series: [
          {
        
	    data:[],
            type: "bar",
          },
          {
	    data:[],
            type: "bar",
          },
        ],
        color: [
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
          "#ea7ccc",
        ],
      });
    },
    handleQuery() {
      // this.params.pageNo = 1;
      // this.getList();
      // const reponse = await tMetaRecordListGetData();
      // console.log(reponse)
      tMetaRecordListGetData().then((res) => {
        console.log(res)
      })
      
    },
   resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    setDimension: function () {
      this.isShowSettingBox = true;
      getAllMultiDimensional().then((res) => {
        console.log(res)
        var string = res.data.replace("/\\","");
        var getDataArray = JSON.parse(string);
        console.log(getDataArray)
        this.tableData2 = getDataArray
        this.tableData2.forEach(ele=>{
          this.$set(ele, 'line', false)
          this.$set(ele, 'column', false)
          this.$set(ele, 'xdisabled', false)
          this.$set(ele, 'ydisabled', false)
				})

        
      })
    },
    submitFileForm(){
        let columns = this.yRow.map((item,index) => ({
          name:item.name,
          type:item.type,
          sort:index+1
        }))
        let rows = this.xRow.map((item,index) => ({
          name:item.name,
          type:item.type,
          sort:index+1
        }))
        let values = [{name:"元数据数量",type:"count",sort:1,"opt":"6"}]
        let multiDimensional = {}
        multiDimensional.columns = columns
        multiDimensional.rows = rows
        multiDimensional.values = values

        console.log(multiDimensional)
        setMultiDimensional({multiDimensional:multiDimensional}).then(res => {
          console.log(res)
          if(res.code == 200){
             this.isShowSettingBox = false;
             this.$message({
                message: "纬度设置成功",
                type: "success",
              });
          }

        })
        


    },
    async getList() {
      // const reponse = await onlineList(this.params);
      const reponse = {
        data: {
          count: 0,
          list: [
            
          ],
        },
      };
      this.tableData = reponse.data.count ? reponse.data.list : [];
      this.total = reponse.data.count;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
.ellipsis {
  @include textOmit;
}
#bar {
  height: 400px;
}
.red {
  color: red;
}
</style>
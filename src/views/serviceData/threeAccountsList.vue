<template>
  <div class="app-container">
    <div class="box-body" v-show="showSearch">
      <el-form :model="geoCategoryParams" :inline="true" class="query-form" v-elResize>
        <el-form-item label="样点编号：">
          <el-input placeholder="请输入" v-model="geoCategoryParams.ydbh" size="small"></el-input>
        </el-form-item>
        <el-form-item label="单位名称：">
          <el-input placeholder="请输入" v-model="geoCategoryParams.zldwmc" size="small"></el-input>
        </el-form-item>
        <el-form-item label="样点类型：">
          <el-select v-model="geoCategoryParams.ydlb" placeholder="请选择" size="small">
            <el-option label="全部" value="" size="small"></el-option>
            <el-option label="表层样" value="0" size="small"></el-option>
            <el-option label="剖面样" value="1" size="small"></el-option>
          </el-select>
          <!--          <el-input
              placeholder="请输入"
              v-model="geoCategoryParams.ydlb"
              size="small"
          ></el-input>-->
        </el-form-item>
        <el-form-item label="土壤类型：">
          <el-select v-model="geoCategoryParams.tl" placeholder="请选择" size="small">
            <el-option label="全部" value="" size="small"></el-option>
            <el-option label="褐土" value="褐土" size="small"></el-option>
            <el-option label="棕壤" value="棕壤" size="small"></el-option>
            <el-option label="山地草甸土" value="山地草甸土" size="small"></el-option>
            <el-option label="水稻土" value="水稻土" size="small"></el-option>
            <el-option label="潮土" value="潮土" size="small"></el-option>
            <el-option label="沼泽土" value="沼泽土" size="small"></el-option>
            <el-option label="风沙土" value="风沙土" size="small"></el-option>
            <el-option label="粗骨土" value="粗骨土" size="small"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="土地利用类型：">
          <el-select v-model="geoCategoryParams.tdlylx" placeholder="请选择" size="small">
            <el-option label="全部" value="" size="small"></el-option>
            <el-option v-for="item in tdlylxData" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
          <!--          <el-input-->
          <!--              placeholder="请输入"-->
          <!--              v-model="geoCategoryParams.tdlylx"-->
          <!--              size="small"-->
          <!--          ></el-input>-->
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">
            查询
          </el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetQuery" plain>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="10" class="mb10">
    </el-row>
    <el-table :data="spaceTableData" v-loading="loading" style="width: 100%" :stripe="true" :max-height="pageHeight - 220"
      row-key="id">
      <el-table-column :index="indexMethod" type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="id" min-width="50" :show-overflow-tooltip="true" label="ID" v-if="false">
      </el-table-column>
      <el-table-column prop="ydbh" min-width="" :show-overflow-tooltip="true" label="样点编号">
      </el-table-column>
      <el-table-column prop="zldwmc" label="坐落单位名称" min-width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="样点类型" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ ydlbChange(scope.row.ydlb) }}
        </template>
      </el-table-column>
      <el-table-column prop="cylx" :show-overflow-tooltip="true" label="采样类型">
        <template slot-scope="scope">
          {{ cylxChange(scope.row.cylx) }}
        </template>
      </el-table-column>
      <el-table-column prop="tl" :show-overflow-tooltip="true" label="土壤类型"></el-table-column>
      <el-table-column label="土地利用类型" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ tdlylxChange(scope.row.tdlylx) }}
        </template>
      </el-table-column>
      <!--      <el-table-column
          prop="tz"
          label="土种"
          :show-overflow-tooltip="true"

      ></el-table-column>-->
      <el-table-column prop="name" label="操作" min-width="80">
        <template slot-scope="scope">
          <el-button size="small" type="text" icon="" @click="handleEdit(2, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :pageNo.sync="geoCategoryParams.pageNo"
      :limit.sync="geoCategoryParams.pageSize" @pagination="getAccountsList" />
    <el-dialog title="台账详情" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="80%">
      <threeAccountsDetail :tabState="tabState" :detail="detail" :ydid="ydid" @handleDialogClose="handleDialogClose">
      </threeAccountsDetail>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { threeAccountList } from "@/api/styem/account";
import threeAccountsDetail from "./threeAccountsDetail";
import { getToken } from "@/utils/auth";
//import Bus from "@/utils/vueBus";
//import Toolbar from "@/components/toolbar/index.vue";
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { threeAccountsDetail },
  data() {
    return {
      dialogFormVisible: false,
      ydid: "",
      loading: true,
      spaceTableData: [
        { text: 1, value: 1 },
        { text: 2, value: 2 },
      ],
      //土地利用类型字典值
      tdlylxData: [
        { code: '0101', name: '水田' },
        { code: '0102', name: '水浇地' },
        { code: '0103', name: '旱地' },
        { code: '0201', name: '果园' },
        { code: '0202', name: '茶园' },
        { code: '0203', name: '橡胶园' },
        { code: '0204', name: '其他园地' },
        { code: '0301', name: '乔木林地' },
        { code: '0302', name: '竹林地' },
        { code: '0303', name: '红树林地' },
        { code: '0304', name: '森林沼泽' },
        { code: '0305', name: '灌木林地' },
        { code: '0306', name: '灌丛沼泽' },
        { code: '0307', name: '其他林地' },
        { code: '0401', name: '天然牧草地' },
        { code: '0402', name: '沼泽草地' },
        { code: '0403', name: '人工牧草地' },
        { code: '0404', name: '其他草地' },
        { code: '0501', name: '零售商业用地' },
        { code: '0502', name: '批发市场用地' },
        { code: '0503', name: '餐饮用地' },
        { code: '0504', name: '旅馆用地' },
        { code: '0505', name: '商务金融用地' },
        { code: '0506', name: '娱乐用地' },
        { code: '0507', name: '其他商服用地' },
        { code: '0601', name: '工业用地' },
        { code: '0602', name: '采矿用地' },
        { code: '0603', name: '盐田' },
        { code: '0604', name: '仓储用地' },
        { code: '0701', name: '城镇住宅用地' },
        { code: '0702', name: '农村宅基地' },
        { code: '0801', name: '机关团体用地' },
        { code: '0802', name: '新闻出版用地' },
        { code: '0803', name: '教育用地' },
        { code: '0804', name: '科研用地' },
        { code: '0805', name: '医疗卫生用地' },
        { code: '0806', name: '社会福利用地' },
        { code: '0807', name: '文化设施用地' },
        { code: '0808', name: '体育用地' },
        { code: '0809', name: '公用设施用地' },
        { code: '0810', name: '公园与绿地' },
        { code: '0901', name: '军事设施用地' },
        { code: '0902', name: '使领馆用地' },
        { code: '0903', name: '监教场所用地' },
        { code: '0904', name: '宗教用地' },
        { code: '0905', name: '殡葬用地' },
        { code: '0906', name: '风景名胜设施用地' },
        { code: '1001', name: '铁路用地' },
        { code: '1002', name: '轨道交通用地' },
        { code: '1003', name: '公路用地' },
        { code: '1004', name: '城镇村道路用地' },
        { code: '1005', name: '交通服务场站用地' },
        { code: '1006', name: '农村道路' },
        { code: '1007', name: '机场用地' },
        { code: '1008', name: '港口码头用地' },
        { code: '1009', name: '管道运输用地' },
        { code: '1101', name: '河流水面' },
        { code: '1102', name: '湖泊水面' },
        { code: '1103', name: '水库水面' },
        { code: '1104', name: '坑塘水面' },
        { code: '1105', name: '沿海滩涂' },
        { code: '1106', name: '内陆滩涂' },
        { code: '1107', name: '沟渠' },
        { code: '1108', name: '沼泽地' },
        { code: '1109', name: '水工建筑用地' },
        { code: '1110', name: '冰川及永久积雪' },
        { code: '1201', name: '空闲地' },
        { code: '1202', name: '设施农用地' },
        { code: '1203', name: '田坎' },
        { code: '1204', name: '盐碱地' },
        { code: '1205', name: '沙地' },
        { code: '1206', name: '裸土地' },
        { code: '1207', name: '裸岩石砾地' }
      ],
      spaceTableData1: [
        {
          "msg": "操作成功",
          "code": 200,
          "data": {
            "pageNo": 1,
            "pageSize": 11,
            "count": 9,
            "list": [
              {
                "id": "1",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090102000048",
                "ydlb": "0",
                "cylx": "1",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109007205",
                "zldwmc": "门头沟区龙泉地区（镇）三家店村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0102",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "石灰性褐土",
                "ts": "泥砂质石灰性褐土",
                "tz": "黏底砂壤质泥砂质石灰性褐土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "王刘庆",
                "dcdw": "北京普析通用仪器有限责任公司",
                "dcsj": "2022-10-07 13:40:28"
              },
              {
                "id": "2",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090102000068",
                "ydlb": "0",
                "cylx": "1",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109006215",
                "zldwmc": "门头沟区永定地区（镇）西辛称村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0102",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "石灰性褐土",
                "ts": "泥砂质石灰性褐土",
                "tz": "砂底砂壤质泥砂质石灰性褐土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "李畔",
                "dcdw": "北京华源厚土科技有限公司",
                "dcsj": "2022-10-08 09:46:48"
              },
              {
                "id": "3",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090102100008",
                "ydlb": "1",
                "cylx": "1",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109107217",
                "zldwmc": "门头沟区清水镇黄安坨村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0102",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "石灰性褐土",
                "ts": "黄土质石灰性褐土",
                "tz": "耕种轻壤质厚层黄土质石灰性褐土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "陈杨",
                "dcdw": "北京华源厚土科技有限公司",
                "dcsj": "2022-09-27 10:05:53"
              },
              {
                "id": "4",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090103000024",
                "ydlb": "0",
                "cylx": "2",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109106223",
                "zldwmc": "门头沟区斋堂镇桑峪村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0103",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "石灰性褐土",
                "ts": "泥砂质石灰性褐土",
                "tz": "耕种卵石底轻壤质泥砂质石灰性褐土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "孙紫坚",
                "dcdw": "北京矿产地质研究院有限责任公司",
                "dcsj": "2022-10-07 16:01:09"
              },
              {
                "id": "5",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090103000042",
                "ydlb": "0",
                "cylx": "1",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109107205",
                "zldwmc": "门头沟区清水镇上清水村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0103",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "褐土性土",
                "ts": "堆垫褐土性土",
                "tz": "卵石底轻壤质堆垫褐土性土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "牛福文",
                "dcdw": "北京中地兴业农林科技有限公司",
                "dcsj": "2022-10-08 12:40:42"
              },
              {
                "id": "6",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090103000060",
                "ydlb": "0",
                "cylx": "1",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109101205",
                "zldwmc": "门头沟区潭柘寺镇南辛房村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0103",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "典型褐土",
                "ts": "黄土质褐土",
                "tz": "耕种轻壤质厚层黄土质褐土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "孙紫坚",
                "dcdw": "北京矿产地质研究院有限责任公司",
                "dcsj": "2022-10-01 14:27:21"
              },
              {
                "id": "7",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090201000001",
                "ydlb": "0",
                "cylx": "1",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109105219",
                "zldwmc": "门头沟区雁翅镇房良村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0201",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "典型褐土",
                "ts": "泥砂质褐土",
                "tz": "耕种卵石底轻壤质泥砂质褐土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "蒋炜",
                "dcdw": "北京矿产地质研究院有限责任公司",
                "dcsj": "2022-09-24 08:52:58"
              },
              {
                "id": "8",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090201000003",
                "ydlb": "0",
                "cylx": "2",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109105218",
                "zldwmc": "门头沟区雁翅镇大村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0201",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "褐土性土",
                "ts": "堆垫褐土性土",
                "tz": "卵石底轻壤质堆垫褐土性土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "裴森龙",
                "dcdw": "北京矿产地质研究有限责任公司",
                "dcsj": "2022-10-08 12:18:51"
              },
              {
                "id": "9",
                "remarks": null,
                "createDate": null,
                "updateDate": null,
                "bswgid": null,
                "bsm": null,
                "ysdm": "",
                "ydbh": "1101090201000004",
                "ydlb": "0",
                "cylx": "1",
                "sfcjswxdtjt": "1",
                "zldwdm": "110109105219",
                "zldwmc": "门头沟区雁翅镇房良村",
                "jd": null,
                "wd": null,
                "pd": "",
                "tdlylx": "0201",
                "trlxbm": "",
                "tl": "褐土",
                "yl": "石灰性褐土",
                "ts": "泥砂质石灰性褐土",
                "tz": "轻壤质厚层泥砂质石灰性褐土",
                "bz": "",
                "createdBy": null,
                "createdTime": null,
                "updateTime": null,
                "reamrks": null,
                "ldtjdcxx": null,
                "dcr": "梁刚",
                "dcdw": "北京普析通用仪器有限责任公司",
                "dcsj": "2022-10-06 14:46:04"
              }
            ],
            "firstResult": 0,
            "maxResults": 11
          }
        }
      ],
      total: 0,
      showSearch: true,
      columns: [1, 2, 3, 4],
      column: [],
      tableData: [
        {
          id: 0,
          label: "操作菜单",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 1,
          label: "操作用户",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 2,
          label: "类型",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 3,
          label: "参数",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 4,
          label: "请求地址",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 5,
          label: "异常信息",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 6,
          label: "操作者IP",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
        {
          id: 7,
          label: "操作时间",
          isHide: false,
          isFixed: false,
          isFilter: false,
          isSort: false,
        },
      ],
      logTypeData: [
        { value: "LOGIN", name: "登录" },
        { value: "INSERT", name: "添加" },
        { value: "OTHER", name: "其他" },
      ],
      geoCategoryParams: {
        pageNo: 1,
        pageSize: 10,
        ydbh: undefined,
        zldwmc: undefined,
        ydlb: undefined,
        beginDate: undefined,
        endDate: undefined,
        tdlylx: undefined,
        tl: undefined
      },
      issueDate: undefined,
    };
  },
  computed: {
    ...mapGetters(["pageHeight"]),
  },
  created() {
    this.getAccountsList();
    this.createTime();
    this.resetQuery();
  },
  activated() {
    this.resetQuery();
  },
  methods: {
    //序号
    indexMethod(index) {
      return (this.geoCategoryParams.pageNo - 1) * this.geoCategoryParams.pageSize + index + 1
    },
    createTime() {
      const end = new Date();
      const nowMonth = end.getMonth(); //当前月
      const nowYear = end.getFullYear(); //当前年
      const monthStartDate = new Date(nowYear, nowMonth, 1);
      const monthEndDate = new Date(nowYear, nowMonth + 1, 0);
      this.issueDate = [monthStartDate, monthEndDate];
      this.geoCategoryParams.beginDate = this.format(
        monthStartDate,
        "yyyy-MM-dd"
      ); //yyyy-MM-dd hh:mm:ss
      this.geoCategoryParams.endDate = this.format(monthEndDate, "yyyy-MM-dd");
    },
    //获取列表数据
    async getAccountsList() {
      // this.spaceTableData = this.spaceTableData1[0].data.list;
      // this.total = this.spaceTableData1[0].data.count;
      this.loading = true;
      const reponse = await threeAccountList(this.geoCategoryParams);
      this.spaceTableData = reponse.data.list;
      this.total = reponse.data.count;
      this.loading = false;
    },
    //查询按钮
    handleQuery() {
      // if (this.geoCategoryParams.exception === true) {
      //   this.geoCategoryParams.exception = 1;
      // } else {
      //   this.geoCategoryParams.exception = undefined;
      // }
      // this.geoCategoryParams.pageNo = 1;
      this.getAccountsList();
    },
    //重置按钮
    resetQuery() {
      this.geoCategoryParams.pageNo = 1;
      this.geoCategoryParams.ydbh = undefined;
      this.geoCategoryParams.zldwmc = undefined;
      this.geoCategoryParams.ydlb = undefined;
      this.geoCategoryParams.tl = undefined;
      this.geoCategoryParams.beginDate = undefined;
      this.geoCategoryParams.endDate = undefined;
      this.geoCategoryParams.tdlylx = undefined;
      this.issueDate = undefined;
      this.getAccountsList();
    },
    ydlbChange(val) {
      if (val === "0") {
        return "表层样";
      } else {
        return "剖面样";
      }
    },
    cylxChange(val) {
      if (val === "1") {
        return "普通样";
      } else {
        return "平行样";
      }
    },
    tdlylxChange(val) {
      for (var i = 0; i < this.tdlylxData.length; i++) {
        if (val == this.tdlylxData[i].code) {
          return this.tdlylxData[i].name;
        }
      }
    },
    issueDateChange(picker) {
      if (picker == null) {
        this.geoCategoryParams.beginDate = undefined;
        this.geoCategoryParams.endDate = undefined;
      } else {
        this.geoCategoryParams.beginDate = picker[0];
        this.geoCategoryParams.endDate = picker[1];
      }
    },
    //“详情”点击事件
    handleEdit(type, row) {
      /* this.$router.push({
         path: "/task/todo/detail/index",
         query: row,
       });*/

      this.dialogFormVisible = true;
      this.tabState = "edit";
      this.ydid = row.id;
      this.detail = row;
    },
    handleDialogClose() {
      this.dialogFormVisible = false;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__icon {
  line-height: 24px !important;
}

/deep/.el-table th.el-table__cell {
  padding: 10px 0;
  background-color: #f8f8f9 !important;
  border-right: none;
}

/deep/.el-table th.el-table__cell>.cell {
  border: none;
  padding: 0 10px;
  font-weight: 600;
  color: #515a6e;
  font-size: 13px;
}

/deep/.el-table .el-table__cell {
  border-right: none !important;
}

.mb10 {
  margin-bottom: 8px;
}
</style>

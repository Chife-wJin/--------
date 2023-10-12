<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col class="el_top" :span="24">
                <el-row :gutter="20">
                    <!-- <el-col class="icon_col" :offset="1" :span="18">
                        <svg-icon icon-class="u225" class="icon" />
                        <span class="span_top">{{ item.ydbh }}</span>
                    </el-col> -->
                    <el-col class="icon_col" :span="18">
                        <span style="font-weight: 700;">样点编号：{{ item.ydbh }}</span>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">坐落位置: {{ item.zldwmc }}</el-col>
                            <el-col :span="8">采样类型: {{ item.cylx == '1' ? '普通样' : '平行样' }}</el-col>
                            <el-col :span="8">是否水团样:{{ item.sfcjswxdtjt == '1' ? '是' : '否' }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">样点类别:{{ item.ydlb == '0' ? '表层样' : '剖面样' }}</el-col>
                            <el-col :span="8">士壤类型:{{ item.tl }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">调查单位: {{ item.dcdw }}</el-col>
                            <el-col :span="8">调查时间: {{ item.dcsj }}</el-col>
                            <el-col :span="8">调查人: {{ item.dcr }}</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="el_top" style="height: 100px;" :span="24">
                <el-row :gutter="20">
                    <el-col class="icon_col" :span="18">
                        <span style="font-weight: 700;">基本信息</span>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">天气: {{ tq }}</el-col>
                            <el-col :span="8">海拔高度: {{ item.ldtjdcxx.hbgd }}米</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="el_top" style="height: 150px;" :span="24">
                <el-row :gutter="20">
                    <el-col class="icon_col" :span="18">
                        <span style="font-weight: 700;">地表特征</span>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 30px;">
                        <el-row>
                            <el-col :span="8">侵蚀类型: {{ qslx }}</el-col>
                            <el-col :span="8">基岩出露丰度: {{ jyclfd }}</el-col>
                            <el-col :span="8">地表砾石丰度: {{ dblsfd }}</el-col>
                        </el-row>
                        <el-row style="margin-top: 10px;">
                            <el-col :span="8">地表盐斑丰度: {{ dbybfd }}</el-col>
                            <el-col :span="8">地表裂隙丰度: {{ dblxfd }}</el-col>
                            <el-col :span="8">士壤沙化:{{ trsh }}</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="el_top" :span="24">
                <el-row :gutter="20">
                    <el-col class="icon_col" :span="18">
                        <span style="font-weight: 700;">成土环境</span>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">大地形: {{ ddx }}</el-col>
                            <el-col :span="8">中地形: {{ zdx }}</el-col>
                            <el-col :span="8">小地形: {{ xdx }}</el-col>
                        </el-row>
                        <el-row style="margin-top: 10px;">
                            <el-col :span="8">地形部位: {{ dxbw }}</el-col>
                            <el-col :span="8">坡度: {{ pd }}</el-col>
                            <el-col :span="8">母岩类型: {{ mylx }}</el-col>
                        </el-row>
                        <el-row style="margin-top: 10px;">
                            <el-col :span="8">母质类型: {{ mz }}</el-col>
                            <el-col :span="8">植被类型:{{ zblx }}</el-col>
                        </el-row>
                        <el-row style="margin-top: 10px;">
                            <el-col :span="8">植物优势种:{{ item.ldtjdcxx.zbzwysz }}</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="el_top" style="height: 150px;" :span="24">
                <el-row :gutter="20">
                    <el-col class="icon_col" :span="18">
                        <span style="font-weight: 700;">土地利用</span>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">土地利用类型现状: {{ tdlylxChange }}</el-col>
                            <el-col :span="8">是否蔬菜用地: {{ item.sfscyd == '1' ? '是' : '否' }}</el-col>
                            <el-col :span="8">设施农业类型: {{ ssnylx }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">蔬菜种植年限: {{ item.sczznx }}年</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="el_top" style="height: 150px;" :span="24">
                <el-row :gutter="20">
                    <el-col class="icon_col" :span="18">
                        <span style="font-weight: 700;">农田建设情况</span>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">是否高标准农田: {{ item.ldtjdcxx.sfgbznt == '1' ? '是' : '否' }}</el-col>
                            <el-col :span="8">灌保证率: {{ item.ldtjdcxx.ggbzl }} %</el-col>
                            <el-col :span="8">农田排水条件:{{ item.ldtjdcxx.ntpstj }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">田间道路工程: {{ item.ldtjdcxx.tjdlgc == '1' ? '机耕路' : '生产路' }}</el-col>
                            <el-col :span="8">是否梯田建设:{{ item.ldtjdcxx.ttjs == '1' ? '是' : '否' }}</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="el_top" style="height: 220px;" :span="24">
                <el-row :gutter="20">
                    <el-col class="icon_col" :span="18">
                        <span style="font-weight: 700;">耕地利用</span>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">熟制类型:{{ zzlx }}</el-col>
                            <el-col :span="8">休耕类型: {{ xglx }}</el-col>
                            <el-col :span="8">休耕频次:{{ item.ldtjdcxx.xgpc }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">撂荒类型: {{ lhlx }}</el-col>
                            <el-col :span="8">轮作制度第一季收获物:{{ lzzd1 }}</el-col>
                            <el-col :span="8">轮作制度第二季收获物:{{ lzzd2 }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">轮作制度第三季收获物：{{ lzzd3 }}</el-col>
                            <el-col :span="8">是否存在轮作变更: {{ item.ldtjdcxx.lzzdbgsf == '1' ? '是' : '否' }}</el-col>
                            <el-col :span="8">当季作物: {{ djzw }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="1" :span="24" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">施肥方式:{{ sffs }}</el-col>
                            <el-col :span="8">秸秆还田年限: {{ item.ldtjdcxx.jghtnx }}</el-col>
                            <el-col :span="8">是否绿肥种植: {{ item.ldtjdcxx.lfsf == '1' ? '是' : '否' }}</el-col>
                        </el-row>
                    </el-col>

                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { threeAccountInfoById } from "@/api/styem/account";
export default {
    props: {
        detail: {
            type: Object,
            default: () => { },
        },
        tabState: {
            type: String,
            default: "",
        },
        ydid: {
            type: String,
            default: "",
        },

    },
    data() {
        return {
            item: '',
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
                { code: '1207', name: '裸岩石砾地' }],
            zwlxData: [
                { code: '01', name: '水稻' },
                { code: '02', name: '玉米' },
                { code: '03', name: '小麦' },
                { code: '04', name: '春小麦' },
                { code: '05', name: '大麦' },
                { code: '06', name: '燕麦' },
                { code: '07', name: '黑麦' },
                { code: '08', name: '青稞' },
                { code: '09', name: '谷子' },
                { code: '10', name: '豆类' },
                { code: '11', name: '高粱' },
                { code: '12', name: '油菜' },
                { code: '13', name: '棉花' },
                { code: '14', name: '花生' },
                { code: '15', name: '烟草' },
                { code: '16', name: '马铃薯' },
                { code: '17', name: '甘薯' },
                { code: '18', name: '甘蔗' },
                { code: '19', name: '甜菜' },
                { code: '20', name: '木薯' },
                { code: '21', name: '芝麻' },
                { code: '22', name: '蔬菜' },
            ]
        };
    },
    computed: {
        sffs() {
            if (this.item.ldtjdcxx.sffs == '01') {
                return '沟施'
            } else if (this.item.ldtjdcxx.sffs == '02') {
                return '穴施'
            } else if (this.item.ldtjdcxx.sffs == '03') {
                return '撒施'
            } else if (this.item.ldtjdcxx.sffs == '04') {
                return '水肥一体化'
            } else if (this.item.ldtjdcxx.sffs == '99') {
                return '其他'
            } else {
                return '无'
            }
        },
        lhlx() {
            if (this.item.ldtjdcxx.lhlx == '1') {
                return '无'
            } else if (this.item.ldtjdcxx.lhlx == '2') {
                return '季节性撂荒'
            } else if (this.item.ldtjdcxx.lhlx == '3') {
                return '全年撂荒'
            } else {
                return '无'
            }
        },
        xglx() {
            if (this.item.ldtjdcxx.xglx == '1') {
                return '无'
            } else if (this.item.ldtjdcxx.xglx == '2') {
                return '季节性休耕'
            } else if (this.item.ldtjdcxx.xglx == '3') {
                return '全年休耕'
            } else {
                return '无'
            }
        },
        zzlx() {
            if (this.item.ldtjdcxx.zzlx == '1') {
                return '一年一熟'
            } else if (this.item.ldtjdcxx.zzlx == '2') {
                return '一年两熟'
            } else if (this.item.ldtjdcxx.zzlx == '3') {
                return '一年三熟'
            } else if (this.item.ldtjdcxx.zzlx == '4') {
                return '两年三熟'
            } else {
                return '无'
            }
        },
        ssnylx() {
            if (this.item.ssnylx == '1') {
                return '露天蔬菜地'
            } else if (this.item.ssnylx == '2') {
                return '塑料大棚'
            } else if (this.item.ssnylx == '3') {
                return '玻璃温室'
            } else if (this.item.ssnylx == '99') {
                return '其他'
            } else {
                return '无'
            }
        },
        djzw() {
            for (var i = 0; i < this.zwlxData.length; i++) {
                if (this.item.djzw == this.zwlxData[i].code) {
                    return this.zwlxData[i].name;
                } else {
                    return '水稻';
                }
            }
            return '水稻';
        },
        lzzd1() {
            for (var i = 0; i < this.zwlxData.length; i++) {
                if (this.item.lzzd1 == this.zwlxData[i].code) {
                    return this.zwlxData[i].name;
                } else {
                    return '水稻';
                }
            }
            return '水稻';
        },
        lzzd2() {
            for (var i = 0; i < this.zwlxData.length; i++) {
                if (this.item.lzzd2 == this.zwlxData[i].code) {
                    return this.zwlxData[i].name;
                } else {
                    return '水稻';
                }
            }
            return '水稻';
        },
        lzzd3() {
            for (var i = 0; i < this.zwlxData.length; i++) {
                if (this.item.lzzd3 == this.zwlxData[i].code) {
                    return this.zwlxData[i].name;
                } else {
                    return '水稻';
                }
            }
            return '水稻';
        },
        tdlylxChange() {
            for (var i = 0; i < this.tdlylxData.length; i++) {
                if (this.item.tdlylx == this.tdlylxData[i].code) {
                    return this.tdlylxData[i].name;
                } else {
                    return '裸岩石砾地';
                }
            }
            return '裸岩石砾地';
        },
        zblx() {
            if (this.item.ldtjdcxx.zblx == '1') {
                return '针叶林'
            } else if (this.item.ldtjdcxx.zblx == '2') {
                return '针阔混交林'
            } else if (this.item.ldtjdcxx.zblx == '3') {
                return '阔叶林'
            } else if (this.item.ldtjdcxx.zblx == '4') {
                return '灌丛'
            } else if (this.item.ldtjdcxx.zblx == '5') {
                return '荒漠'
            } else if (this.item.ldtjdcxx.zblx == '6') {
                return '草原'
            } else if (this.item.ldtjdcxx.zblx == '7') {
                return '草丛'
            } else if (this.item.ldtjdcxx.zblx == '8') {
                return '草甸'
            } else if (this.item.ldtjdcxx.zblx == '9') {
                return '沼泽'
            } else if (this.item.ldtjdcxx.zblx == '10') {
                return '高山植被'
            } else if (this.item.ldtjdcxx.zblx == '11') {
                return '栽培植被'
            } else if (this.item.ldtjdcxx.zblx == '12') {
                return '无植被地段'
            } else {
                return '无'
            }
        },
        mz() {
            if (this.item.ldtjdcxx.mz == 'AS') {
                return '风积沙'
            } else if (this.item.ldtjdcxx.mz == 'LO') {
                return '原生黄土'
            } else if (this.item.ldtjdcxx.mz == 'LOP') {
                return '黄土状物质 ( 次生黄土)'
            } else if (this.item.ldtjdcxx.mz == 'LI') {
                return '残积物'
            } else if (this.item.ldtjdcxx.mz == 'LG') {
                return '坡积物'
            } else if (this.item.ldtjdcxx.mz == 'MA') {
                return '洪积物'
            } else if (this.item.ldtjdcxx.mz == 'FL') {
                return '冲积物'
            } else if (this.item.ldtjdcxx.mz == 'PY') {
                return '海岸沉积物'
            } else if (this.item.ldtjdcxx.mz == 'AL') {
                return '湖沉积物'
            } else if (this.item.ldtjdcxx.mz == 'VA') {
                return '河流沉积物'
            } else if (this.item.ldtjdcxx.mz == 'CO') {
                return '火成碎屑沉积物'
            } else if (this.item.ldtjdcxx.mz == 'WE') {
                return '冰川沉积物'
            } else if (this.item.ldtjdcxx.mz == 'SA') {
                return '有机沉积物'
            } else if (this.item.ldtjdcxx.mz == 'CD') {
                return '崩积物'
            } else if (this.item.ldtjdcxx.mz == 'QR') {
                return '红黏土'
            } else if (this.item.ldtjdcxx.mz == 'OT') {
                return '其他'
            } else {
                return '其他';
            }
        },
        mylx() {
            if (this.item.ldtjdcxx.my == '01') {
                return '第四纪松散沉积物'
            } else if (this.item.ldtjdcxx.my == '02') {
                return '花岗岩'
            } else if (this.item.ldtjdcxx.my == '03') {
                return '流纹岩'
            } else if (this.item.ldtjdcxx.my == '04') {
                return '闪长岩'
            } else if (this.item.ldtjdcxx.my == '05') {
                return '安山岩'
            } else if (this.item.ldtjdcxx.my == '06') {
                return '正长岩'
            } else if (this.item.ldtjdcxx.my == '07') {
                return '粗面岩'
            } else if (this.item.ldtjdcxx.my == '08') {
                return '辉长岩'
            } else if (this.item.ldtjdcxx.my == '09') {
                return '玄武岩'
            } else if (this.item.ldtjdcxx.my == '10') {
                return '橄榄岩'
            } else if (this.item.ldtjdcxx.my == '11') {
                return '脉岩'
            } else if (this.item.ldtjdcxx.my == '12') {
                return '块集岩'
            } else if (this.item.ldtjdcxx.my == '13') {
                return '火山角砾岩'
            } else if (this.item.ldtjdcxx.my == '14') {
                return '凝灰岩'
            } else if (this.item.ldtjdcxx.my == '15') {
                return '角砾岩'
            } else if (this.item.ldtjdcxx.my == '16') {
                return '砾岩'
            } else if (this.item.ldtjdcxx.my == '17') {
                return '砂岩'
            } else if (this.item.ldtjdcxx.my == '18') {
                return '页岩'
            } else if (this.item.ldtjdcxx.my == '19') {
                return '化学石灰岩'
            } else if (this.item.ldtjdcxx.my == '20') {
                return '生物石灰岩'
            } else if (this.item.ldtjdcxx.my == '21') {
                return '白云岩'
            } else if (this.item.ldtjdcxx.my == '22') {
                return '片麻岩'
            } else if (this.item.ldtjdcxx.my == '23') {
                return '石英岩'
            } else if (this.item.ldtjdcxx.my == '24') {
                return '板岩'
            } else if (this.item.ldtjdcxx.my == '25') {
                return '结晶片岩'
            } else if (this.item.ldtjdcxx.my == '26') {
                return '大理岩'
            } else if (this.item.ldtjdcxx.my == '27') {
                return '泥岩'
            } else if (this.item.ldtjdcxx.my == '99') {
                return ' 其他'
            } else {
                return '无'
            }
        },
        qslx() {
            if (this.item.ldtjdcxx.qslx == 'N') {
                return '无'
            } else if (this.item.ldtjdcxx.qslx == 'W') {
                return '水蚀'
            } else if (this.item.ldtjdcxx.qslx == 'M') {
                return '重力侵蚀'
            } else if (this.item.ldtjdcxx.qslx == 'A') {
                return '风蚀'
            } else if (this.item.ldtjdcxx.qslx == 'F') {
                return '冻融侵蚀'
            } else if (this.item.ldtjdcxx.qslx == 'WA') {
                return '水蚀与风蚀复合'
            } else {
                return '无'
            }
        },
        tq() {
            if (this.item.ldtjdcxx.tqqk == '01') {
                return '晴或极少云'
            } else if (this.item.ldtjdcxx.tqqk == '02') {
                return '部分云'
            } else if (this.item.ldtjdcxx.tqqk == '03') {
                return '阴'
            } else if (this.item.ldtjdcxx.tqqk == '04') {
                return '雨'
            } else if (this.item.ldtjdcxx.tqqk == '05') {
                return '雨夹雪或冰雹'
            } else if (this.item.ldtjdcxx.tqqk == '06') {
                return '雪'
            } else {
                return '无'
            }
        },
        pd() {
            if (this.item.pd == 'I') {
                return '平地 (≤2°)'
            } else if (this.item.pd == 'II') {
                return '微坡 (2°~6°)'
            } else if (this.item.pd == 'III') {
                return '缓坡 (6°~15°)'
            } else if (this.item.pd == 'IV') {
                return '中缓坡 (15°~25°)'
            } else if (this.item.pd == 'V') {
                return '极陡坡 (>25°)'
            } else {
                return '无'
            }
        },
        jyclfd() {
            if (this.item.ldtjdcxx.jyclfd == 'N') {
                return '无'
            } else if (this.item.ldtjdcxx.jyclfd == 'F') {
                return '少'
            } else if (this.item.ldtjdcxx.jyclfd == 'C') {
                return '中'
            } else if (this.item.ldtjdcxx.jyclfd == 'M') {
                return '多'
            } else if (this.item.ldtjdcxx.jyclfd == 'A') {
                return '很多'
            } else {
                return '无'
            }
        },
        dblsfd() {
            if (this.item.ldtjdcxx.dblsfd == 'N') {
                return '无'
            } else if (this.item.ldtjdcxx.dblsfd == 'F') {
                return '少'
            } else if (this.item.ldtjdcxx.dblsfd == 'C') {
                return '中'
            } else if (this.item.ldtjdcxx.dblsfd == 'M') {
                return '多'
            } else if (this.item.ldtjdcxx.dblsfd == 'A') {
                return '很多'
            } else {
                return '无'
            }
        },
        dbybfd() {
            if (this.item.ldtjdcxx.dbybfd == 'N') {
                return '无'
            } else if (this.item.ldtjdcxx.dbybfd == 'F') {
                return '少'
            } else if (this.item.ldtjdcxx.dbybfd == 'C') {
                return '中'
            } else if (this.item.ldtjdcxx.dbybfd == 'M') {
                return '多'
            } else if (this.item.ldtjdcxx.dbybfd == 'A') {
                return '很多'
            } else {
                return '无'
            }
        },
        dblxfd() {
            if (this.item.ldtjdcxx.dblxfd == 'N') {
                return '无'
            } else if (this.item.ldtjdcxx.dblxfd == 'F') {
                return '少'
            } else if (this.item.ldtjdcxx.dblxfd == 'MI') {
                return '中'
            } else if (this.item.ldtjdcxx.dblxfd == 'MA') {
                return '多'
            } else if (this.item.ldtjdcxx.dblxfd == 'VM') {
                return '很多'
            } else {
                return '无'
            }
        },
        dxbw() {
            if (this.item.ldtjdcxx.dxbw == 'CR') {
                return '顶部'
            } else if (this.item.ldtjdcxx.dxbw == 'UP') {
                return '上坡'
            } else if (this.item.ldtjdcxx.dxbw == 'MS') {
                return '中坡'
            } else if (this.item.ldtjdcxx.dxbw == 'LS') {
                return '下坡'
            } else if (this.item.ldtjdcxx.dxbw == 'BOf') {
                return '坡麓 ( 底部)'
            } else if (this.item.ldtjdcxx.dxbw == 'IN') {
                return '高阶地 (洪-冲积平原)'
            } else if (this.item.ldtjdcxx.dxbw == 'LO') {
                return '低阶地 (河流冲积平原)'
            } else if (this.item.ldtjdcxx.dxbw == 'RB') {
                return '河漫滩'
            } else if (this.item.ldtjdcxx.dxbw == 'BOl') {
                return '底部 (排水线)'
            } else {
                return '无'
            }
        },
        trsh() {
            if (this.item.ldtjdcxx.trsh == '0') {
                return '未沙化'
            } else if (this.item.ldtjdcxx.trsh == '1') {
                return '轻度沙化'
            } else if (this.item.ldtjdcxx.trsh == '2') {
                return '中度沙化'
            } else if (this.item.ldtjdcxx.trsh == '3') {
                return '重度沙化'
            } else {
                return '无'
            }
        },
        ddx() {
            if (this.item.ldtjdcxx.ddx == 'MO') {
                return '山地'
            } else if (this.item.ldtjdcxx.ddx == 'HI') {
                return '丘陵'
            } else if (this.item.ldtjdcxx.ddx == 'PL') {
                return '平原'
            } else if (this.item.ldtjdcxx.ddx == 'PT') {
                return '高原'
            } else if (this.item.ldtjdcxx.ddx == 'BA') {
                return '盆地'
            } else {
                return '无'
            }
        },
        zdx() {
            if (this.item.ldtjdcxx.zdx == 'AP') {
                return '冲积平原'
            } else if (this.item.ldtjdcxx.zdx == 'CP') {
                return '海岸 (海积) 平原'
            } else if (this.item.ldtjdcxx.zdx == 'LP') {
                return '湖积平原'
            } else if (this.item.ldtjdcxx.zdx == 'PE') {
                return '山麓平原'
            } else if (this.item.ldtjdcxx.zdx == 'DF') {
                return '洪积平原'
            } else if (this.item.ldtjdcxx.zdx == 'WI') {
                return '风积平原'
            } else if (this.item.ldtjdcxx.zdx == 'DU') {
                return '沙丘'
            } else if (this.item.ldtjdcxx.zdx == 'DT') {
                return '三角洲'
            } else if (this.item.ldtjdcxx.zdx == 'TF') {
                return '河滩/潮滩'
            } else if (this.item.ldtjdcxx.zdx == 'LH') {
                return '低丘'
            } else if (this.item.ldtjdcxx.zdx == 'HH') {
                return '高丘'
            } else if (this.item.ldtjdcxx.zdx == 'LM') {
                return '低山'
            } else if (this.item.ldtjdcxx.zdx == 'MM') {
                return '中山'
            } else if (this.item.ldtjdcxx.zdx == 'OM') {
                return '高山'
            } else if (this.item.ldtjdcxx.zdx == 'EM') {
                return '极高山'
            } else {
                return '无'
            }
        },
        xdx() {
            if (this.item.ldtjdcxx.xdx == 'IF') {
                return '沟谷地'
            } else if (this.item.ldtjdcxx.xdx == 'VA') {
                return '谷底'
            } else if (this.item.ldtjdcxx.xdx == 'VF') {
                return '河道'
            } else if (this.item.ldtjdcxx.xdx == 'CH') {
                return '河道'
            } else if (this.item.ldtjdcxx.xdx == 'LE') {
                return '河堤'
            } else if (this.item.ldtjdcxx.xdx == 'TE') {
                return '阶地'
            } else if (this.item.ldtjdcxx.xdx == 'FP') {
                return '泛滥平原'
            } else if (this.item.ldtjdcxx.xdx == 'PF') {
                return '洪积扇'
            } else if (this.item.ldtjdcxx.xdx == 'AF') {
                return '冲积扇'
            } else if (this.item.ldtjdcxx.xdx == 'PA') {
                return '盘状凹地'
            } else if (this.item.ldtjdcxx.xdx == 'CO') {
                return '珊瑚礁'
            } else if (this.item.ldtjdcxx.xdx == 'CA') {
                return '火山口'
            } else if (this.item.ldtjdcxx.xdx == 'DE') {
                return '洼地'
            } else if (this.item.ldtjdcxx.xdx == 'DU') {
                return '沙丘'
            } else if (this.item.ldtjdcxx.xdx == 'LD') {
                return '纵向沙丘'
            } else if (this.item.ldtjdcxx.xdx == 'ID') {
                return '沙丘间洼地'
            } else if (this.item.ldtjdcxx.xdx == 'SL') {
                return '坡'
            } else if (this.item.ldtjdcxx.xdx == 'LA') {
                return '潟湖'
            } else if (this.item.ldtjdcxx.xdx == 'RI') {
                return '山脊'
            } else if (this.item.ldtjdcxx.xdx == 'BR') {
                return '滩脊'
            } else {
                return '无'
            }
        }
    },
    created() {
        this.getInfoById();
    },
    activated() {

    },
    methods: {
        async getInfoById() {
            console.log(this.ydid)
            const reponse = await threeAccountInfoById({ id: this.ydid });
            this.item = reponse.data;
        }
    },
};
</script>

<style lang="scss" scoped>
.app-container {
    font-family: "Arial Normal", "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
}

.el_top {
    height: 200px;
    width: 95%;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    margin-top: 20px;
}

.icon {
    width: 50px;
    height: 50px;
    vertical-align: middle;
}

.span_top {
    font-size: 30px;
    vertical-align: middle;
}

.icon_col {
    margin-top: 20px;
}
</style>

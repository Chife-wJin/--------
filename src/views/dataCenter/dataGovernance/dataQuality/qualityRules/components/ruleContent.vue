<template>
  <div>
    <p style="font-weight:bold; font-size:15px">查询条件</p>
    <el-form-item label="" prop="guizeCon" label-width="0">
      <div class="gltj">
        <el-tabs type="border-card" class="tabs">
          <el-tab-pane label="字段列表">
            <div class="group-container">
              <div class="group" v-for="(v, i) in menuContent1" :key="i">
              <p
                @click="dtBtn1(v, i)"
                :class="v.isShow1 ? 'active yiji' : 'yiji'"
              >
                <span>{{ v.name }}</span>
                <i :class='n1==true?"transform":""'></i>
              </p>
              <ul class="content-div">
                <li
                  v-for="(k, j) in v.subItems"
                  :key="j"
                  @click="chooseShuxing(k)"
                  v-show="v.isShow1">
                  {{ k.COLUMN_COMMENT }}{{ k.COLUMN_NAME }}
                </li>
              </ul>
            </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="函数/算子">
            <div class="group-container">
              <div class="group" v-for="(v, i) in menuContent" :key="i">
                <p
                  @click="dtBtn(v, i)"
                  :class="v.isShow ? 'active yiji' : 'yiji'"
                >
                  <span>{{ v.name }}</span>
                  <i :class="v.n == true ? 'transform' : ''"></i>
                </p>
                <ul class="content-div">
                  <li
                    v-for="(k, j) in v.subItems"
                    :key="j"
                    @click="chooseys(k)"
                    v-show="v.isShow"
                  >
                    {{ k.title }}
                  </li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div>
          <el-input
            v-model="form.guizeConValue"
            size="small"
            type="textarea"
            :rows="8"
            style="width:480px; "
          ></el-input>
          <a style="color: #409eff; display:block" @click="check"
            ><i class="el-icon-question"></i>语法检查</a
          >
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { dictListType, grammarCheck } from "@/api/dataCenter/dataGovernance";
export default {
  name: "RuleContent",
  props: {
    gzzdList: Array,
    postData: Object,
  },
  data() {
    return {
      form: {
        guizeCon: "",
        guizeConValue: "",
      },
      guizeConArray: [],
      guizeConValueArray: [],
      bjfTypeData: undefined,
      ysfTypeData: undefined,
      xtblTypeData: undefined,
      input: "",
      menuContent: [
        { id: 1, name: "选择比较符", isShow: false, n:true, subItems: [] },
        { id: 2, name: "选择运算符", isShow: false, n:true, subItems: [] },
        { id: 3, name: "选择系统变量", isShow: false, n:true, subItems: [] },
      ],
      menuContent1: [{ id: 1, name: "", isShow1: true, subItems: [] }],
      n1:false,
    };
  },

  created() {
    this.datacenterDictList();
    console.log(this.gzzdList)
    this.menuContent1[0].name = this.postData.assessTable.tableName;
  },
  watch: {
    gzzdList(newnew, oldold) {
     // console.log("监听", newnew, oldold);
      this.menuContent1[0].subItems = newnew
    }
  },

  methods: {
    async datacenterDictList() {
      const bjfTypeReponse = await dictListType({ type: "range_all" });
      this.menuContent[0].subItems = bjfTypeReponse.data;
      const ysfTypeReponse = await dictListType({ type: "operation" });
      this.menuContent[1].subItems = ysfTypeReponse.data;
      const xtblTypeReponse = await dictListType({ type: "current" });
      this.menuContent[2].subItems = xtblTypeReponse.data;
      //console.log(this.xtblTypeData)
    },
    dtBtn(v, i) {
      v.isShow = !v.isShow;
      v.n = !v.n
    },
    dtBtn1(v, i) {
      v.isShow1 = !v.isShow1;
      this.n1 = !this.n1
      console.log(this.n1)
      console.log(i)
    },
    chooseShuxing(v) {
      this.guizeConArray.push(v.COLUMN_COMMENT);
      this.guizeConValueArray.push(v.COLUMN_NAME);
      this.form.guizeCon = this.guizeConArray.join("");
      console.log(this.form.guizeCon)
      this.form.guizeConValue = this.guizeConValueArray.join("");
      console.log(this.form.guizeCon)
    },
    chooseys(k) {
      console.log(k)
      let element = ' '+ k.title +' '
      console.log(k.title)
      this.guizeConArray.push(element);
      this.form.guizeCon = this.guizeConArray.join("");
      let elementCode = ' '+ k.code +' '
      this.guizeConValueArray.push(elementCode);
      this.form.guizeConValue = this.guizeConValueArray.join("");
    },
    check() {
      grammarCheck({
        assessTableId: this.postData.assessTable.datasourceId,
        specificationValue: this.form.guizeConValue,
      }).then((res) => {
        if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success",
              });
            }else{
              this.$message({
                message: res.msg,
                type: "warning",
              });
            }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sx-input {
  height: 30px;
  width: 150px;
  border: solid 1px #ccc;
  padding: 0 10px;
}

.group p {
  line-height: 30px;
  margin: 0;
  cursor: default;
}
.group ul {
  padding-left: 10px;
  width: 200px;
}
.group li {
  cursor: default;
  line-height: 24px;
  margin-bottom: 10px;
}
.group li:hover {
  color: #409eff;
}
.yiji {
  font-size: 15px;
  font-weight: bold;
}
// p.active {
//   color: #409eff;
// }

.group-container {
  height: 320px;
  overflow: auto;
  width: 240px;
}
.group p i {
  width: 10px;
  height: 10px;
  position: relative;
  top: 0;
  &::after{
    content: "";
    display: inline-block;
    margin-left:5px;
    border-style: solid dashed dashed dashed;
    border-width: 5px;
    /*transparent表示透明，只有上面的三角是有颜色的，其他的都是透明的*/
    border-color: transparent  transparent transparent #333;
  }
}
.group p i.transform {
  transform: rotate(90deg);
  position: relative;
  top: 3px;
  &::after{
    content: "";
    display: inline-block;
    margin-left:5px;
    border-style: solid dashed dashed dashed;
    border-width: 5px;
    /*transparent表示透明，只有上面的三角是有颜色的，其他的都是透明的*/
    border-color: #333 transparent transparent transparent;
  }
}

.tabs {
  width: 250px;
  height: 400px;
  overflow: auto;
}
.gltj{ display: flex; justify-content: space-between;}
</style>
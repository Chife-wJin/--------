<template>
  <div class="video">
    <div class="treeDiv">
      <el-tree :data="data" :props="defaultProps" node-key="id" :default-expanded-keys="defaultShowNodes">
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
          @mouseover="mouseover(data)"
          @mouseleave="mouseout(data)"
        >
          <span @click="leafNodeClick(data)">{{ node.label }}</span>
          <div v-show="!data.children" @click.stop="() => {}">
            <el-dropdown placement="right-start" trigger="click">
              <i class="el-icon-s-operation"><span class="liu">2</span></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(v, i) in maliuList"
                  :key="i"
                  @click.native="maliuClick(node, data, v)"
                  ><i class="el-icon-s-operation">{{
                    v.name
                  }}</i></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </span>
      </el-tree>
    </div>
    <div class="videoArea">
      <div class="radio-container">
        <div
          :class="['radio-item', { 'radio-active': radio == item.value }]"
          v-for="(item, index) in radioList"
          :key="index"
          @click="onRadio(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <div :class="['player_container', 'player_container_' + radio]">
        <div
          class="player_item"
          v-for="(item, index) in playerList"
          :key="index"
          @click="onActive(index)"
        >
          <div class="closes" @click="onCloes(index)">关闭</div>
          <easy-player
            :class="['player_box', { player_active: active == index }]"
            :key="index"
            :muted="muted"
            :data-index="index"
            :video-url="item.videoUrl"
            :ref="'player' + index"
            style="height: 100%"
            @error="restartPlayer"
            @ended="restartPlayer"
          />
        </div>
      </div>
    </div>
    <div class="controlArea">
      <div class="arrows">
        <div class="up-down">
          <div class="control-up control-item"></div>
          <div class="control-down control-item"></div>
        </div>
        <div class="left-right">
          <div class="control-right control-item"></div>
          <div class="control-left control-item"></div>
        </div>
        <div class="control-center">
          <img src="@/assets/images/dataCenter/play.png" />
        </div>
      </div>
      <div class="functions">
        <ul class="function-div">
          <li class="suoxiao"></li>
          <li class="fangda"></li>
        </ul>
        <ul class="function-div">
          <li class="hua1"></li>
          <li class="hua2"></li>
        </ul>
        <ul class="function-div">
          <li class="fz"></li>
          <li class="zt"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  wqVideoTreeData,
  wqVideoCreateLive,
} from "@/api/dataCenter/centerTopic.js";
import EasyPlayer from "@easydarwin/easyplayer";
export default {
  name: "WqzhhjglptUIWqVideoPage",

  data() {
    return {
      defaultShowNodes: [],  
      x: "",
      y: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },

      //播放器
      active: 0,
      radio: 1,
      radioList: [
        // 选择分屏
        { label: "单分屏", value: 1 },
        { label: "四分屏", value: 4 },
        { label: "九分屏", value: 9 },
      ],
      maliuList: [
        // 选择分屏
        { name: "①主码流", value: "1" },
        { name: "②子码流", value: "2" },
        { name: "③虚拟码流", value: "3" },
      ],
      muted: false, // 控制音频
      playerList: [],
      playerUrl: "",

      //选择视频
      id: "",
      isMasterStream: "2",
    };
  },
  components: {
    EasyPlayer,
  },
 
  mounted() {
    this.getWqVideoTreeData();
    this.setPlayerList();
  },

  methods: {
    //播放器
    setPlayerList() {
      // 设置分屏
      this.onStop();
      this.playerList = [];
      for (let index = 0; index < this.radio; index++) {
        this.playerList.push({ videoUrl: "" });
      }
    },
    onPlay() {
      // 播放
      this.playerList[this.active].videoUrl = this.playerUrl;
    },
    onStop() {
      for (let index = 0; index < this.playerList.length; index++) {
        this.playerList[index].videoUrl = "";
      }
    },
    onRadio(val) {
      // 分屏选择
      this.radio = val;
      this.setPlayerList();
    },
    onActive(val) {
      this.active = val;
    },
    onCloes(index) {
      this.playerList[index].videoUrl = "";
    },
    restartPlayer(e) {
      // 错误捕获
      const { index } = e.currentTarget.dataset;
      const playerStr = "player" + index;
      let [player] = this.$refs[playerStr];
      player = player.getVueInstance();
      player.initPlayer(); // 重新初始化播放器
    },

    //选择视频
    leafNodeClick(data) {
      if (!data.children) {
        this.id = data.id;
        this.getWqVideoCreateLive();
      }
    },
    maliuClick(node, data, v) {
      // console.log(node);
      // console.log(data);
      // console.log(v);
      this.isMasterStream = v.value;
      this.id = data.id;
      // console.log(this.id, this.isMasterStream);
      this.getWqVideoCreateLive();
    },
    getWqVideoCreateLive() {
      wqVideoCreateLive({
        id: this.id,
        isMasterStream: this.isMasterStream,
      }).then((res) => {
        if (res.code == 200) {
          console.log(res.msg);
          this.playerUrl = res.msg;
        }
        this.onPlay();
      });
    },

    async getWqVideoTreeData() {
      const reponse = await wqVideoTreeData();
      this.data = reponse.data;
      // 这里的参数 第1个是默认展开几级 第2个是源数据
      this.getDefaultShowNodes(2, this.data)
    },

    //默认展开第几级
    getDefaultShowNodes(num, children) {
      console.log(num)
      console.log(children)
      --num;
      if (num >= 0) {
        for (var i = 0; i < children.length; i++) {
          this.defaultShowNodes.push(children[i].id);
          if (children[i].children) {
            this.getDefaultShowNodes(num, children[i].children);
          }
        }
      }
    },

    mouseover(data) {
      // 移入
      this.$set(data, "dropdownShow", true);
    },
    mouseout(data) {
      // 移除
      this.$set(data, "dropdownShow", false);
    },
    addPeerTree(node, data) {
      console.log("主码流");
    },
    addChildrenTree(node, data) {
      console.log("子码流");
    },
    updateTree(node, data) {
      console.log("新增码流");
    },
  },
};
</script>

<style lang="scss" scoped>
.video {
  display: flex;
  justify-content: space-between;
  .treeDiv {
    width: 290px;
    height: calc(100vh - 130px);
    background: #fff;
    overflow: auto;
  }
  //控制按钮
  .controlArea {
    width: 20%;
    .arrows {
      width: 180px;
      height: 180px;
      margin: 40px auto;
      border: solid 15px #eae8e8;
      border-radius: 100%;
      overflow: hidden;
      position: relative;
      background: #d5d5d5;
      .up-down {
        width: 47px;
        height: 100%;
        margin: 0 auto;
        text-align: center;
        .control-up {
          width: 47px;
          height: 50px;
          background: #d5d5d5;
          border-radius: 15% 15% 0 0;
          border-left: solid 1px #8e8e92;
          border-right: solid 1px #8e8e92;
          &::before {
            content: "";
            width: 10px;
            height: 10px;
            display: inline-block;
            border-color: transparent transparent #fff transparent;
            border-width: 10px;
            border-style: solid;
            margin-top:5px
          }
        }
        .control-down {
          width: 47px;
          height: 52px;
          background: #d5d5d5;
          border-radius: 0 0 15% 15%;
          border-left: solid 1px #8e8e92;
          border-right: solid 1px #8e8e92;
          position: absolute;
          bottom: 0;
          &::before {
            content: "";
            width: 10px;
            height: 10px;
            display: inline-block;
            position: relative;

            top: 25px;
            border-color: #fff transparent transparent transparent;
            border-width: 10px;
            border-style: solid;
          }
        }
      }
      .left-right {
        width: 150px;
        height: 47px;
        overflow: hidden;
        position: absolute;
        top: 51px;
        left: 0;
        .control-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 53px;
          height: 47px;
          margin: 0 auto;
          background: #d5d5d5;
          border-radius: 0 15% 15% 0;
          border-top: solid 1px #8e8e92;
          border-bottom: solid 1px #8e8e92;
          text-align: right;
          float: right;
          &::before {
            content: "";
            width: 10px;
            height: 10px;
            display: inline-block;
            border-color: transparent transparent transparent #fff;
            border-width: 10px;
            border-style: solid;
            position: relative;
            left: 25px;
          }
        }
        .control-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 53px;
          height: 47px;
          margin: 0 auto;
          background: #d5d5d5;
          border-radius: 15% 0 0 15%;
          border-top: solid 1px #8e8e92;
          border-bottom: solid 1px #8e8e92;
          text-align: left;
          float: left;
          &::before {
            content: "";
            width: 10px;
            height: 10px;
            display: inline-block;
            border-color: transparent #fff transparent transparent;
            border-width: 10px;
            border-style: solid;
            position: relative;
            left: 5px;
          }
        }
      }
      .control-center {
        width: 60px;
        height: 60px;
        background: #d6d6d6;
        box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.3);
        border-radius: 100%;
        position: absolute;
        left: 45px;
        top: 45px;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        img {
          width: 70%;
          height: 70%;
          display: block;
          margin: 0 auto;
        }
      }
    }
  }
  //功能区
  .functions {
    display: flex;
    justify-content: space-around;
    .function-div {
      display: flex;
      justify-content: space-between;
      border: solid 1px #777777;
      border-radius: 20px;
      width: 31%;
      height: 40px;
      li {
        width: 49.5%;
      }
      .suoxiao {
        background: url("~@/assets/images/dataCenter/fdjx.png") no-repeat center
          center;
      }
      .fangda {
        background: url("~@/assets/images/dataCenter/fdjd.png") no-repeat center
          center;
      }
      .hua1 {
        background: url("~@/assets/images/dataCenter/hua1.png") no-repeat center
          center;
      }
      .hua2 {
        background: url("~@/assets/images/dataCenter/hua2.png") no-repeat center
          center;
      }
      .fz {
        background: url("~@/assets/images/dataCenter/fz.png") no-repeat center
          center;
      }
      .zt {
        background: url("~@/assets/images/dataCenter/zt.png") no-repeat center
          center;
      }
      li:nth-child(1) {
        border-right: dashed 1px #777777;
      }
    }
  }
}

//树
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 10px;
  height: 100%;
}

//播放器
.videoArea {
  width: 60%;
}
.radio-container {
  padding: 10px 0;
}
.radio-item {
  cursor: pointer;
  display: inline-block;
  padding: 6px 12px;
  margin-right: 15px;
  border-radius: 4px;
  border: 1px #ccc solid;
}
.radio-active {
  color: #fff;
  background-color: #07baf4;
  border-color: #07baf4;
}
.easy-video-player-inner {
  width: 100%;
  height: 100%;
}
.player_container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: calc(100% - 70px);
}
.player_container_1 .player_item {
  width: 100%;
  height: 100%;
  padding-bottom: 0;
}
.player_container_4 .player_item {
  width: 50%;
  height: 50%;
  padding-bottom: 0;
}
.player_container_9 .player_item {
  width: 33.3%;
  height: 33.3%;
  padding-bottom: 0;
}
.player_active {
  box-shadow: 0 0 2px 1px blue;
}
.player_item {
  position: relative;
  padding-bottom: 54%;
  background-color: #ccc;
  border: 1px #fff solid;
}
.player_box {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.playerurl-container {
  display: flex;
  padding-bottom: 10px;
}
.play-btn {
  width: 80px;
  text-align: center;
  line-height: 40px;
  height: 40px;
  cursor: pointer;
  margin-left: 15px;
  border-radius: 4px;
  color: #fff;
  background-color: #07baf4;
  border-color: #07baf4;
}
input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
.closes {
  position: absolute;
  cursor: pointer;
  top: 5px;
  right: 5px;
  width: 40px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
}
.liu {
  font-size: 10px;
  background: #999;
  color: #fff;
  border-radius: 100%;
  display: inline-block;
  width: 12px;
  height: 12px;
  text-align: center;
  line-height: 12px;
  position: relative;
  top: -2px;
}
</style>
<template>
  <div
    v-if="easyFlowVisible"
    class="app-container"
    style="height: calc(100vh - 134px)"
  >
    <el-row>
      <!--顶部工具菜单-->
      <el-col :span="24">
        <div class="ef-tooltar">
          <el-link type="primary" :underline="false">{{ data.name }}</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="large"
            @click="deleteElement"
            :disabled="!this.activeElement.type"
          ></el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            icon="el-icon-edit"
            size="large"
            @click="editElement"
            :disabled="!this.activeElement.type"
          ></el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            icon="el-icon-download"
            size="large"
            @click="downloadData"
          ></el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            icon="el-icon-plus"
            size="large"
            @click="zoomAdd"
          ></el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            icon="el-icon-minus"
            size="large"
            @click="zoomSub"
          ></el-button>
          <div style="float: right; margin-right: 5px">
            <el-button
              type="info"
              plain
              round
              icon="el-icon-document"
              @click="dataInfo"
              size="mini"
              >流程信息</el-button
            >
            <!-- <el-button
              type="primary"
              plain
              round
              @click="dataReloadA"
              icon="el-icon-refresh"
              size="mini"
              >切换流程A</el-button
            >
            <el-button
              type="primary"
              plain
              round
              @click="dataReloadB"
              icon="el-icon-refresh"
              size="mini"
              >切换流程B</el-button
            >
            <el-button
              type="primary"
              plain
              round
              @click="dataReloadC"
              icon="el-icon-refresh"
              size="mini"
              >切换流程C</el-button
            >
            <el-button
              type="primary"
              plain
              round
              @click="dataReloadD"
              icon="el-icon-refresh"
              size="mini"
              >自定义样式</el-button
            >
            <el-button
              type="primary"
              plain
              round
              @click="dataReloadE"
              icon="el-icon-refresh"
              size="mini"
              >力导图</el-button
            > -->
            <el-button
              type="info"
              plain
              round
              icon="el-icon-document"
              @click="openHelp"
              size="mini"
              >帮助</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="display: flex; height: calc(100% - 47px)">
      <div style="width: 230px; border-right: 1px solid #dce3e8">
        <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
      </div>
      <div id="efContainer" ref="efContainer" class="container" v-flowDrag>
        <template v-for="node in data.nodeList">
          <flow-node
            :id="node.nodeId"
            :key="node.nodeId"
            :node="node"
            :activeElement="activeElement"
            @changeNodeSite="changeNodeSite"
            @nodeRightMenu="nodeRightMenu"
            @clickNode="clickNode"
          >
          </flow-node>
        </template>
        <!-- 给画布一个默认的宽度和高度 -->
        <div style="position: absolute; top: 2000px; left: 2000px">&nbsp;</div>
      </div>
      <!-- 右侧表单 -->
      <!-- <div
        style="
          width: 300px;
          border-left: 1px solid #dce3e8;
          background-color: #fbfbfb;
        "
      >
        <flow-node-form
          ref="nodeForm"
          @setLineLabel="setLineLabel"
          @repaintEverything="repaintEverything"
        ></flow-node-form>
      </div> -->
    </div>
    <!-- 流程数据详情 -->
    <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
    <flow-help v-if="flowHelpVisible" ref="flowHelp"></flow-help>
    <!-- 弹窗 -->
    <!-- 模型输入 -->
    <model-input ref="modelInput" v-if="modelInput" :isShow.sync="modelInput" />
    <!-- 横向连接 -->
    <transverse-link
      ref="transverseLink"
      v-if="transverseLink"
      :isShow.sync="transverseLink"
    />
    <!-- 模型输出 -->
    <model-output
      ref="modelOutput"
      v-if="modelOutput"
      :isShow.sync="modelOutput"
      :flowPathForm="flowPathForm"
    />
  </div>
</template>

<script>
import draggable from "vuedraggable";
// import { jsPlumb } from 'jsplumb'
// 使用修改后的jsplumb
import "./jsplumb";
import { easyFlowMixin } from "./mixins";
import flowNode from "./node";
import nodeMenu from "./node_menu";
import FlowInfo from "./info";
import FlowHelp from "./help";
// import FlowNodeForm from "./node_form";
import lodash from "lodash";
import { getDataA } from "./data_A";
import { getDataB } from "./data_B";
import { getDataC } from "./data_C";
import { getDataD } from "./data_D";
import { getDataE } from "./data_E";
import { ForceDirected } from "./force-directed";
import modelInput from "../dialogAll/modelInput";
import transverseLink from "../dialogAll/transverseLink";
import modelOutput from "../dialogAll/modelOutput";

export default {
  props: {
    flowPathForm: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // jsPlumb 实例
      jsPlumb: null,
      // 控制画布销毁
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      // 是否加载完毕标志位
      loadEasyFlowFinish: false,
      flowHelpVisible: false,
      // 前端数据结构
      data: {},
      // 后端的数据结构
      serveData: {},
      // 激活的元素、可能是节点、可能是连线
      activeElement: {
        // 节点类型
        nodeType: undefined,
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined,
      },
      zoom: 0.5,
      // 弹窗字段
      modelInput: false,
      transverseLink: false,
      modelOutput: false,
    };
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  components: {
    // draggable,
    flowNode,
    nodeMenu,
    FlowInfo,
    // FlowNodeForm,
    FlowHelp,
    modelInput,
    transverseLink,
    modelOutput,
  },
  directives: {
    flowDrag: {
      bind(el, binding, vnode, oldNode) {
        if (!binding) {
          return;
        }
        el.onmousedown = (e) => {
          if (e.button == 2) {
            // 右键不管
            return;
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX;
          let disY = e.clientY;
          el.style.cursor = "move";

          document.onmousemove = function (e) {
            // 移动时禁止默认事件
            e.preventDefault();
            const left = e.clientX - disX;
            disX = e.clientX;
            el.scrollLeft += -left;

            const top = e.clientY - disY;
            disY = e.clientY;
            el.scrollTop += -top;
          };

          document.onmouseup = function (e) {
            el.style.cursor = "auto";
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance();
    this.$nextTick(() => {
      // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
      // this.dataReload(getDataB());
      // 读取后台返回的数据并处理
      this.serveData = {
        processDetails: [
          {
            entrance: [],
            preLeftNodeId: "",
            preRightNodeId: "",
            nextNodeId: "gtoec0bstd",
            idCompile: "0",
            isDone: "",
            process: {
              id: "3we4k3cpq8",
              name: "模型输入",
              type: "MODEL_INPUT",
              longitude: "120",
              latitude: "326",
              ico: "moxingbianji",
              state: "success",
              assessTableId: 1,
              tableName: "",
              jsonObject: "",
              input: [],
              output: [
                {
                  dataLength: 19,
                  dataName: "id",
                  dataNull: 0,
                  dataPk: 1,
                  dataPointLength: 0,
                  dataType: "bigint",
                },
                {
                  dataLength: 19,
                  dataName: "office_id",
                  dataNull: 1,
                  dataPk: 0,
                  dataPointLength: 0,
                  dataType: "bigint",
                },
              ],
            },
          },
          {
            entrance: [],
            preLeftNodeId: "",
            preRightNodeId: "",
            nextNodeId: "gtoec0bstd",
            idCompile: "0",
            isDone: "",
            process: {
              id: "6z4yxukdi8",
              name: "模型输入1",
              type: "MODEL_INPUT",
              longitude: "271",
              latitude: "321",
              ico: "moxingbianji",
              state: "success",
              assessTableId: 2,
              tableName: "",
              jsonObject: "",
              input: [],
              output: [
                {
                  dataLength: 2,
                  dataName: "project_simple",
                  dataNull: 1,
                  dataPk: 0,
                  dataPointLength: 0,
                  dataType: "varchar",
                },
              ],
            },
          },
          {
            entrance: ["3we4k3cpq8", "6z4yxukdi8"],
            preLeftNodeId: "3we4k3cpq8",
            preRightNodeId: "6z4yxukdi8",
            nextNodeId: "",
            idCompile: "0",
            isDone: "",
            process: {
              id: "gtoec0bstd",
              name: "横向连接",
              type: "TRANSVERSE_CONNECTION",
              longitude: "209",
              latitude: "668",
              ico: "peizhiguanli1",
              state: "success",
              assessTableId: 1,
              tableName: "",
              jsonObject: JSON.stringify({
                connectType: "2",
                condition: [
                  {
                    leftNodeId: "3we4k3cpq8",
                    leftField: "office_id",
                    rightNodeId: "6z4yxukdi8",
                    rightField: "project_simple",
                  },
                ],
              }),
              input: [],
              output: [
                {
                  dataLength: 19,
                  dataName: "id",
                  dataNull: 0,
                  dataPk: 1,
                  dataPointLength: 0,
                  dataType: "bigint",
                },
                {
                  dataLength: 19,
                  dataName: "office_id",
                  dataNull: 1,
                  dataPk: 0,
                  dataPointLength: 0,
                  dataType: "bigint",
                },
              ],
            },
          },
        ],
        lineList: [
          { from: "3we4k3cpq8", to: "gtoec0bstd" },
          { from: "6z4yxukdi8", to: "gtoec0bstd" },
        ],
      };
      this.dataReload(this.setFrontData());
    });
  },
  methods: {
    // 返回唯一标识
    getUUID() {
      return Math.random().toString(36).substr(3, 10);
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        this.loadEasyFlow();
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
        this.jsPlumb.bind("click", (conn, originalEvent) => {
          this.activeElement.type = "line";
          this.activeElement.sourceId = conn.sourceId;
          this.activeElement.targetId = conn.targetId;
          // this.$refs.nodeForm.lineInit({
          //   from: conn.sourceId,
          //   to: conn.targetId,
          //   label: conn.getLabel(),
          // });
        });
        // 连线
        this.jsPlumb.bind("connection", (evt) => {
          let from = evt.source.id;
          let to = evt.target.id;
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to });
          }
        });

        // 删除连线回调
        this.jsPlumb.bind("connectionDetached", (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId);
        });

        // 改变线的连接节点
        this.jsPlumb.bind("connectionMoved", (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId);
        });

        // 连线右击
        this.jsPlumb.bind("contextmenu", (evt) => {
          console.log("contextmenu", evt);
        });

        // 连线
        this.jsPlumb.bind("beforeDrop", (evt) => {
          let from = evt.sourceId;
          let to = evt.targetId;
          if (from === to) {
            this.$message.error("节点不支持连接自己");
            return false;
          }
          if (this.hasLine(from, to)) {
            this.$message.error("该关系已存在,不允许重复创建");
            return false;
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error("不支持两个节点之间连线回环");
            return false;
          }
          if (!this.linkAstrictOut(evt)) {
            this.$message.error("一个节点出口最多一个");
            return false;
          } else {
            if (!this.linkAstrictInput(evt)) {
              this.$message.error("一个节点入口最多两个");
              return false;
            } else {
              for (let i = 0; i < this.data.nodeList.length; i++) {
                const item = this.data.nodeList[i];
                if (item.nodeId == evt.sourceId) {
                  item.nextNodeId = evt.targetId;
                }
                if (item.nodeId == evt.targetId) {
                  item.entrance.push(evt.sourceId);
                  switch (item.entrance.length) {
                    case 1:
                      item.preLeftNodeId = item.entrance[0];
                      break;
                    case 2:
                      item.preRightNodeId = item.entrance[1];
                      break;
                    default:
                      break;
                  }
                }
              }
            }
          }
          this.$message.success("连接成功");
          return true;
        });

        // beforeDetach
        this.jsPlumb.bind("beforeDetach", (evt) => {
          console.log("beforeDetach", evt);
        });
        this.jsPlumb.setContainer(this.$refs.efContainer);
      });
    },
    // 一个节点出口只能有一个
    linkAstrictOut(evt) {
      for (let i = 0; i < this.data.nodeList.length; i++) {
        const item = this.data.nodeList[i];
        if (item.nodeId == evt.sourceId) {
          if (item.nextNodeId != "") {
            return false;
          } else {
            return true;
          }
        }
      }
    },
    // 一个节点入口最多有两个
    linkAstrictInput(evt) {
      for (let i = 0; i < this.data.nodeList.length; i++) {
        const item = this.data.nodeList[i];
        if (item.nodeId == evt.targetId) {
          if (item.entrance.length >= 2) {
            return false;
          } else {
            return true;
          }
        }
      }
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(
          node.nodeId,
          lodash.merge(this.jsplumbSourceOptions, {})
        );
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.nodeId, this.jsplumbTargetOptions);
        if (!node.viewOnly) {
          this.jsPlumb.draggable(node.nodeId, {
            containment: "parent",
            stop: function (el) {
              // 拖拽节点结束后的对调
              console.log("拖拽结束: ", el);
            },
          });
        }
      }
      // 初始化连线
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        var connParam = {
          source: line.from,
          target: line.to,
          label: line.label ? line.label : "",
          connector: line.connector ? line.connector : "",
          anchors: line.anchors ? line.anchors : undefined,
          paintStyle: line.paintStyle ? line.paintStyle : undefined,
        };
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true;
      });
    },
    // 设置连线条件
    setLineLabel(from, to, label) {
      var conn = this.jsPlumb.getConnections({
        source: from,
        target: to,
      })[0];
      if (!label || label === "") {
        conn.removeClass("flowLabel");
        conn.addClass("emptyFlowLabel");
      } else {
        conn.addClass("flowLabel");
      }
      conn.setLabel({
        label: label,
      });
      this.data.lineList.forEach(function (line) {
        if (line.from == from && line.to == to) {
          line.label = label;
        }
      });
    },
    // 删除激活的元素
    deleteElement() {
      if (this.activeElement.type === "node") {
        this.deleteNode(this.activeElement);
      } else if (this.activeElement.type === "line") {
        this.$confirm("确定删除所点击的线吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            var conn = this.jsPlumb.getConnections({
              source: this.activeElement.sourceId,
              target: this.activeElement.targetId,
            })[0];
            this.jsPlumb.deleteConnection(conn);
            this.removeOutOrInputLine(this.activeElement);
            this.$nextTick(() => {
              this.setServeData();
            });
          })
          .catch(() => {});
      }
    },
    // 编辑激活的元素
    editElement() {
      if (this.activeElement.type === "node") {
        console.log("弹窗", this.activeElement);
        switch (this.activeElement.nodeType) {
          case "MODEL_INPUT":
            this.modelInput = true;
            this.$nextTick(() => {
              this.$refs.modelInput.nodeInit(
                this.data,
                this.activeElement.nodeId,
                this.serveData
              );
            });
            break;
          case "TRANSVERSE_CONNECTION":
            this.transverseLink = true;
            this.$nextTick(() => {
              this.$refs.transverseLink.nodeInit(
                this.data,
                this.activeElement.nodeId,
                this.serveData
              );
            });
            break;
          case "MODEL_OUTPUT":
            this.modelOutput = true;
            this.$nextTick(() => {
              this.$refs.modelOutput.nodeInit(
                this.data,
                this.activeElement.nodeId,
                this.serveData
              );
            });
            break;
          default:
            break;
        }
      } else {
        this.$message.success("请选择要编辑的节点");
      }
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        if (line.from == from && line.to == to) {
          return false;
        }
        return true;
      });
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo);
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.nodeId === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode(evt, nodeMenu, mousePosition) {
      var screenX = evt.originalEvent.clientX,
        screenY = evt.originalEvent.clientY;
      let efContainer = this.$refs.efContainer;
      var containerRect = efContainer.getBoundingClientRect();
      var left = screenX,
        top = screenY;
      // 计算是否拖入到容器中
      if (
        left < containerRect.x ||
        left > containerRect.width + containerRect.x ||
        top < containerRect.y ||
        containerRect.y > containerRect.y + containerRect.height
      ) {
        this.$message.error("请把节点拖入到画布中");
        return;
      }
      left = left - containerRect.x + efContainer.scrollLeft;
      top = top - containerRect.y + efContainer.scrollTop;
      // 居中
      left -= 85;
      top -= 16;
      var nodeId = this.getUUID();
      // 动态生成名字
      var origName = nodeMenu.name;
      var nodeName = origName;
      var index = 1;
      while (index < 10000) {
        var repeat = false;
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i];
          if (node.name === nodeName) {
            nodeName = origName + index;
            repeat = true;
          }
        }
        if (repeat) {
          index++;
          continue;
        }
        break;
      }
      var node = {
        entrance: [],
        preLeftNodeId: "",
        preRightNodeId: "",
        nextNodeId: "",
        nodeId: nodeId,
        name: nodeName,
        type: nodeMenu.type,
        left: left,
        top: top,
        ico: nodeMenu.ico,
        state: "success",
      };
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      this.data.nodeList.push(node);
      this.$nextTick(function () {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions);
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions);
        this.jsPlumb.draggable(nodeId, {
          containment: "parent",
          stop: function (el) {
            // 拖拽节点结束后的对调
            console.log("拖拽结束: ", el);
          },
        });
      });
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(node) {
      const { nodeId } = node;
      this.$confirm("确定要删除节点" + nodeId + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          /**
           * 这里需要进行业务判断，是否可以删除
           */
          this.data.nodeList = this.data.nodeList.filter(function (node) {
            if (node.nodeId === nodeId) {
              // 伪删除，将节点隐藏，否则会导致位置错位
              // node.show = false
              return false;
            }
            return true;
          });
          this.$nextTick(function () {
            this.jsPlumb.removeAllEndpoints(nodeId);
            this.removeOutOrInputNode(node);
            this.$nextTick(() => {
              this.setServeData();
              this.activeElement.nodeType = undefined;
              this.activeElement.type = undefined;
              this.activeElement.nodeId = undefined;
              this.activeElement.sourceId = undefined;
              this.activeElement.targetId = undefined;
            });
          });
        })
        .catch(() => {});
      return true;
    },
    // 删除连线对应的上级或下级节点的链接id也需要删除
    removeOutOrInputLine(node) {
      this.data.nodeList.forEach((item, index) => {
        if (item.nextNodeId == node.targetId && item.nodeId == node.sourceId) {
          item.nextNodeId = "";
        }
        if (
          item.nodeId == node.targetId &&
          item.entrance.includes(node.sourceId)
        ) {
          let num = "";
          item.entrance.forEach((itemx, indexx) => {
            if (itemx == node.sourceId) {
              num = indexx;
            }
          });
          if (num !== "") {
            this.data.nodeList[index].entrance.splice(num, 1);
          }
          if (item.preLeftNodeId == node.sourceId) {
            item.preLeftNodeId = "";
          } else if (item.preRightNodeId == node.sourceId) {
            item.preRightNodeId = "";
          }
        }
      });
    },
    // 删除节点对应的上级或下级节点的链接id也需要删除
    removeOutOrInputNode(node) {
      this.data.nodeList.forEach((item, index) => {
        if (item.preLeftNodeId == node.nodeId) {
          item.preLeftNodeId = "";
        } else if (item.preRightNodeId == node.nodeId) {
          item.preRightNodeId = "";
        }
        let num = "";
        item.entrance.forEach((itemx, indexx) => {
          if (itemx == node.nodeId) {
            num = indexx;
          }
        });
        if (num !== "") {
          this.data.nodeList[index].entrance.splice(num, 1);
        }
        if (item.nextNodeId == node.nodeId) {
          item.nextNodeId = "";
        }
      });
    },
    clickNode(nodeId, nodeType) {
      this.activeElement.type = "node";
      this.activeElement.nodeId = nodeId;
      this.activeElement.nodeType = nodeType;
      // this.$refs.nodeForm.nodeInit(this.data, nodeId);
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i];
        if (line.from === from && line.to === to) {
          return true;
        }
      }
      return false;
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from);
    },
    nodeRightMenu(nodeId, evt) {
      this.menu.show = true;
      this.menu.curNodeId = nodeId;
      this.menu.left = evt.x + "px";
      this.menu.top = evt.y + "px";
    },
    repaintEverything() {
      this.jsPlumb.repaint();
    },
    // 流程数据信息
    dataInfo() {
      this.flowInfoVisible = true;
      this.$nextTick(function () {
        this.$refs.flowInfo.init();
      });
    },
    // 加载流程图
    dataReload(data) {
      this.easyFlowVisible = false;
      this.data.nodeList = [];
      this.data.lineList = [];
      this.$nextTick(() => {
        data = lodash.cloneDeep(data);
        this.easyFlowVisible = true;
        this.data = data;
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance();
          this.$nextTick(() => {
            this.jsPlumbInit();
          });
        });
      });
    },
    // 模拟载入数据dataA
    dataReloadA() {
      this.dataReload(getDataA());
    },
    // 模拟载入数据dataB
    dataReloadB() {
      this.dataReload(getDataB());
    },
    // 模拟载入数据dataC
    dataReloadC() {
      this.dataReload(getDataC());
    },
    // 模拟载入数据dataD
    dataReloadD() {
      this.dataReload(getDataD());
    },
    // 模拟加载数据dataE，自适应创建坐标
    dataReloadE() {
      let dataE = getDataE();
      let tempData = lodash.cloneDeep(dataE);
      let data = ForceDirected(tempData);
      this.dataReload(data);
      this.$message({
        message: "力导图每次产生的布局是不一样的",
        type: "warning",
      });
    },
    zoomAdd() {
      if (this.zoom >= 1) {
        return;
      }
      this.zoom = this.zoom + 0.1;
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`;
      this.jsPlumb.setZoom(this.zoom);
    },
    zoomSub() {
      if (this.zoom <= 0) {
        return;
      }
      this.zoom = this.zoom - 0.1;
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`;
      this.jsPlumb.setZoom(this.zoom);
    },
    // 下载数据
    downloadData() {
      this.$confirm("确定要下载该流程数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          var datastr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(this.data, null, "\t"));
          var downloadAnchorNode = document.createElement("a");
          downloadAnchorNode.setAttribute("href", datastr);
          downloadAnchorNode.setAttribute("download", "data.json");
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
          this.$message.success("正在下载中,请稍后...");
        })
        .catch(() => {});
    },
    openHelp() {
      this.flowHelpVisible = true;
      this.$nextTick(function () {
        this.$refs.flowHelp.init();
      });
    },
  },
};
</script>

<template>
  <div class="flow-menu" ref="tool">
    <div v-for="menu in menuList" :key="menu.id">
      <span class="ef-node-pmenu" @click="menu.open = !menu.open">
        <i
          :class="{
            'el-icon-caret-bottom': menu.open,
            'el-icon-caret-right': !menu.open,
          }"
        >
        </i>
        &nbsp;{{ menu.name }}</span
      >
      <ul v-show="menu.open" class="ef-node-menu-ul">
        <draggable
          @end="end"
          @start="move"
          v-model="menu.children"
          :options="draggableOptions"
        >
          <li
            v-for="subMenu in menu.children"
            class="ef-node-menu-li"
            :key="subMenu.id"
            :type="subMenu.type"
          >
            <svg-icon :icon-class="subMenu.ico"></svg-icon> {{ subMenu.name }}
          </li>
        </draggable>
      </ul>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";

var mousePosition = {
  left: -1,
  top: -1,
};

export default {
  data() {
    return {
      activeNames: "1",
      // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        ghostClass: "tt",
        // 不使用H5原生的配置
        forceFallback: true,
        // 拖拽的时候样式
        // fallbackClass: 'flow-node-draggable'
      },
      // 默认打开的左侧菜单的id
      defaultOpeneds: ["1", "2"],
      menuList: [
        {
          id: "1",
          type: "root",
          name: "输入输出",
          ico: "el-icon-video-play",
          open: true,
          children: [
            {
              id: "11",
              type: "MODEL_INPUT",
              name: "模型输入",
              ico: "moxingbianji",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "12",
              type: "SQL_INPUT",
              name: "SQL输入",
              ico: "ETL-SQL",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "13",
              type: "MODEL_OUTPUT",
              name: "模型输出",
              ico: "moxingbianji_1",
              // 自定义覆盖样式
              style: {},
            },
          ],
        },
        {
          id: "2",
          type: "root",
          name: "数据处理",
          ico: "el-icon-video-pause",
          open: true,
          children: [
            {
              id: "21",
              type: "TRANSVERSE_CONNECTION",
              name: "横向连接",
              ico: "peizhiguanli1",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "22",
              type: "PORTRAIT_CONNECTION",
              name: "纵向连接",
              ico: "tongbi",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "23",
              type: "DATA_FILTER",
              name: "数据过滤",
              ico: "guolv_1",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "24",
              type: "DATA_DUPLICATE",
              name: "数据去重",
              ico: "quzhong",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "25",
              type: "DATA_SORT",
              name: "数据排序",
              ico: "paixu",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "26",
              type: "DATA_MAPPING",
              name: "数值映射",
              ico: "yingshe",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "27",
              type: "ATTRIBUTE_FILTER",
              name: "属性过滤",
              ico: "guolv",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "28",
              type: "FIELD_MERGE",
              name: "字段合并",
              ico: "hebing",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "29",
              type: "chaifen",
              name: "字段拆分",
              ico: "chaifen",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "30",
              type: "GROUPING_AGGREGATION",
              name: "分组聚合",
              ico: "combine",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "31",
              type: "TYPE_CONVERSION",
              name: "类型转化",
              ico: "zhuanhua",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "32",
              type: "TOGGLE_CASE",
              name: "大小写转化",
              ico: "fontsize",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "33",
              type: "COLUMN_RENAME",
              name: "列重命名",
              ico: "mingming",
              // 自定义覆盖样式
              style: {},
            },

            {
              id: "34",
              type: "ADD_COLUMN",
              name: "新增列",
              ico: "xinzengliebiao",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "35",
              type: "EASY_ASSIGNMENT",
              name: "简单赋值",
              ico: "fuzhi",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "36",
              type: "NUM_ASSIGNMENT",
              name: "序列赋值",
              ico: "fuzhi_1",
              // 自定义覆盖样式
              style: {},
            },
            {
              id: "37",
              type: "FUNCTION_ASSIGNMENT",
              name: "函数赋值",
              ico: "changguihanshu",
              // 自定义覆盖样式
              style: {},
            },
          ],
        },
      ],
      nodeMenu: {},
    };
  },
  components: {
    draggable,
  },
  created() {
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX;
        mousePosition.top = event.clientY - 50;
        event.preventDefault();
        event.stopPropagation();
      };
    }
  },
  methods: {
    // 根据类型获取左侧菜单对象
    getMenuByType(type) {
      for (let i = 0; i < this.menuList.length; i++) {
        let children = this.menuList[i].children;
        for (let j = 0; j < children.length; j++) {
          if (children[j].type === type) {
            return children[j];
          }
        }
      }
    },
    // 拖拽开始时触发
    move(evt, a, b, c) {
      var type = evt.item.attributes.type.nodeValue;
      this.nodeMenu = this.getMenuByType(type);
    },
    // 拖拽结束时触发
    end(evt, e) {
      this.$emit("addNode", evt, this.nodeMenu, mousePosition);
    },
    // 是否是火狐浏览器
    isFirefox() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") > -1) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang="scss" scoped>
  .ef-node-menu-li {
    .svg-icon {
      color: #1879FF;
    }
  }
</style>

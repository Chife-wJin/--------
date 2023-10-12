<template>
  <div>
    <el-button type="primary" @click="addCondition" size="small">
      添加
    </el-button>
    <el-table border :data="List" max-height="500" class="container-table">
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.name"
      >
        <template slot-scope="scope">
          <el-select
            v-if="index == 0"
            v-model="scope.row.leftField"
            size="small"
          >
            <el-option
              v-for="itemx in item.output"
              :key="itemx.dataName"
              :label="itemx.dataName"
              :value="itemx.dataName"
            ></el-option>
          </el-select>
          <el-select v-else v-model="scope.row.rightField" size="small">
            <el-option
              v-for="itemx in item.output"
              :key="itemx.dataName"
              :label="itemx.dataName"
              :value="itemx.dataName"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <i class="el-icon-delete del" @click="handleDel(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUuiD } from "@/utils/random";
export default {
  props: {
    data: {
      required: true,
      type: Object,
      default: () => {},
    },
    node: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      List: [],
      leftNodeId: "",
      rightNodeId: "",
      columnList: [],
    };
  },
  methods: {
    // 初始化表头
    setTableColumn() {
      this.$nextTick(() => {
        let num = 0;
        // 找出当前节点的两个入口节点, 将入口节点选中的字段拿过来
        const sourceList = [];
        this.data.lineList.forEach((item) => {
          if (item.to == this.node.nodeId) {
            sourceList.push(item.from);
          }
        });
        this.data.nodeList.forEach((item) => {
          if (sourceList.includes(item.nodeId)) {
            const { nodeId, name, output } = item;
            const obj = {
              nodeId,
              name,
              output,
            };
            if (num == 0) {
              this.leftNodeId = nodeId;
            } else if (num == 1) {
              this.rightNodeId = nodeId;
            }
            this.columnList.push(obj);
            num++;
          }
          // if (item.type == "MODEL_INPUT") {
          //   const { nodeId, name, output } = item;
          //   const obj = {
          //     nodeId,
          //     name,
          //     output,
          //   };
          //   if (num == 0) {
          //     this.leftNodeId = nodeId;
          //   } else if (num == 1) {
          //     this.rightNodeId = nodeId;
          //   }
          //   this.columnList.push(obj);
          //   num++;
          // }
        });
      });
    },
    setTableList() {
      this.$nextTick(() => {
        this.List = JSON.parse(this.node.jsonObject).condition;
      });
    },
    // 添加
    addCondition() {
      this.List.push({
        id: getUuiD(),
        leftNodeId: this.leftNodeId,
        rightNodeId: this.rightNodeId,
        leftField: "",
        rightField: "",
      });
    },
    // 删除激活的元素
    handleDel(row) {
      this.List = this.List.filter((item) => {
        return item.id != row.id;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.del {
  cursor: pointer;
  color: #f56c6c;
}
</style>
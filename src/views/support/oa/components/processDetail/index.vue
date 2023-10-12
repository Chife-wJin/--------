<template>
  <div>
    <div class="process-title">
      流转记录
    </div>
    <el-table :data="flowRecordList" border style="width: 100%;">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column label="当前节点" prop="taskName" />
      <el-table-column label="办理人" prop="assigneeName" />
      <el-table-column label="候选办理" prop="candidate" />
      <el-table-column label="接收时间" prop="createTime" />
      <el-table-column label="处理时间" prop="finishTime" />
      <el-table-column label="耗时" prop="duration" />
      <el-table-column label="处理意见" prop="comment">
        <template slot-scope="scope">
          {{scope.row.comment && scope.row.comment.comment}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    flowRecordList: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.process-title {
  height: 40px;
  line-height: 40px;
  color: #409EFF;
}
</style>
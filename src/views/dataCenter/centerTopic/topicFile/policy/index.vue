<template>
  <div class="app-container">
    <div class="left">
      <h1 class="structure-title">分类</h1>
      <div class="structure-inner">
        <div class="tree-container">
          <el-tree
            class="filter-tree"
            :data="deptOptions"
            :props="defaultProps"
            default-expand-all
            :default-expanded-keys="expandDefault"
            @node-click="handleNodeClick"
            ref="tree"
          >
          </el-tree>
        </div>
      </div>
    </div>

    <div class="right">
      <el-form
        class="search-body"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        size="small"
        label-width="78px"
      >
        <el-form-item label="文件名称:" prop="searchWord">
          <el-input
            v-model="queryParams.searchWord"
            style="width: 180px"
            placeholder="请输入文件名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" border class="container-table" :data="List">
        <el-table-column type="index" width="50" label="序号">
          <template slot-scope="scope">
            {{
              (queryParams.pageNo - 1) * queryParams.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="namecn" label="文件名称" width="400">
          <template slot-scope="scope">
            <tooltip-view :value="scope.row.namecn" />
          </template>
        </el-table-column>
        <el-table-column prop="documentNum" label="文件编号">
          <template slot-scope="scope">
            <tooltip-view :value="scope.row.documentNum" />
          </template>
        </el-table-column>
        <el-table-column
          prop="area"
          label="适用区域"
          width="100"
        ></el-table-column>
        <el-table-column prop="classificationThree" label="三级分类名称">
        </el-table-column>
        <el-table-column
          prop="implDate"
          label="实施日期"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="pubDate"
          label="发布日期"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="isFail_text"
          label="文件状态"
          width="100"
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :pageNo.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        class="pull-right"
      />
    </div>

    <el-dialog
      title="详细信息"
      :visible.sync="isShowAlert"
      width="1200px"
      append-to-body
      v-if="isShowAlert"
    >
      <div class="detail-div">
        <h1>{{ detailData.namecn }}</h1>
        <ul class="top-ul">
          <li>文件分类：{{ detailData.namecn }}</li>
          <li>文件编号：{{ detailData.documentNum }}</li>
          <li>发布日期：{{ detailData.pubDate }}</li>
          <li>实施日期：{{ detailData.implDate }}</li>
          <li>发布部门：{{ detailData.departmenttext }}</li>
          <li>适用区域：{{ detailData.area }}</li>
          <li>是否有效：{{ detailData.isFail | myFilterA }}</li>
        </ul>
        <dl class="forward-div">
          <dt>前言</dt>
          <dd>{{ detailData.forward }}</dd>
        </dl>
        <h2>原文附件</h2>
        <ul class="attachmentList-div">
          <li
            v-for="(v, i) in detailData.attachmentList"
            :key="i"
            @click="downLoad(v, i)"
          >
            {{ v.fileName }} <span>{{ v.size }}</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { TooltipView } from "@/components";
import pagination from "../Pagination/index.vue";
const path = process.env.VUE_APP_BASE_API_DATAS;
export default {
  name: "dataCenterPolicy",
  components: {
    TooltipView,
    pagination,
  },
  data() {
    return {
      expandDefault: [],
      deptOptions: [],
      defaultProps: {
        children: "childList",
        label: "title",
      },

      queryParams: {
        pageNo: 1,
        pageSize: 10,
        type: "1",
        searchWord: "",
        id: "",
      },
      total: 1,
      loading: false,
      List: [],
      detailData: {},
      isShowAlert: false,
    };
  },
  created() {
    this.getTreeList();
    this.getList();
  },

  filters: {
    myFilterA(message) {
      if (message == "0") {
        return "有效";
      } else if (message == "1") {
        return "无效";
      } else {
        return "征求意见";
      }
    },
  },
  // 选中第一层级下的第一个节点
  watch: {
    expandDefault(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document
            // .querySelector('.el-tree-node__children .el-tree-node__content') //有子节点的第一个
            .querySelector(".el-tree-node__content") //没有子节点的第一个
            .click();
        });
      }
    },
  },
  methods: {
    //获取左侧树
    getTreeList() {
      this.$axios({
        method: "GET",
        url:  path + "/api/lawstandard/treeList",
        headers: {
          appId: "wv2ZGo1F",
          secretKey: "b1aa60b7be6d986405e41384026223eeb92c7783",
        },
        params: { type: 1 },
      }).then((response) => {
        let { code, data } = response.data;
        if (code == 200) {
          console.log("data: ", data);
          this.deptOptions = data;
          this.expandDefault.push(data[0].id);
        }
      });
    },

    // 获取表格
    getList() {
      this.loading = true;
      this.$axios({
        method: "POST",
        url: path + "/api/lawstandard/plateList",
        headers: {
          appId: "wv2ZGo1F",
          secretKey: "b1aa60b7be6d986405e41384026223eeb92c7783",
        },
        data: this.queryParams,
      }).then((response) => {
        let { code, data, totalRows } = response.data;
        if (code == 200) {
          this.List = data;
          this.List.map((item) => {
            item.isFail === "0"
              ? (item.isFail_text = "有效")
              : item.isFail === "1"
              ? (item.isFail_text = "无效")
              : (item.isFail_text = "征求意见稿");
          });
          this.total = totalRows;
        }
      });
      this.loading = false;
    },

    //树节点点击
    handleNodeClick(data) {
      this.queryParams.id = data.id;
      this.queryParams.searchWord = "";
      this.getList();
    },

    //查询
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    // 重置
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },

    //查看
    handleView(row) {
      this.isShowAlert = true;
      this.$axios({
        method: "GET",
        url:  path + "/api/lawstandard/searchDetail",
        headers: {
          appId: "wv2ZGo1F",
          secretKey: "b1aa60b7be6d986405e41384026223eeb92c7783",
        },
        params: { id: row.id },
      }).then((response) => {
        let { code, data } = response.data;
        if (code == 200) {
          this.detailData = data;
        }
      });
    },

    //下载
    downLoad(v, i) {
      window.open(
         path + "/api/lawstandard/downAttachment?id=" +
          v.id +
          "&appId=wv2ZGo1F"
      );
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background: none;
}
.app-container {
  display: flex;
  .left {
    width: 260px;
  }

  .right {
    flex: 1;
    padding: 0 10px 0 20px;
  }
  .structure-title {
    font-size: 16px;
  }
  .structure-inner {
    height: calc(100vh - 180px);
    background: #fff;
    overflow: auto;
  }
  .tree-container {
    margin: 0 auto;
  }
  .el-tree {
    padding: 10px 0;
    margin-bottom: 20px;
  }
}
.detail-div {
  width: 1000px;
  min-height: 500px;
  padding-bottom: 50px;
  margin: 0 auto;
  h1 {
    font-size: 20px;
    text-align: center;
  }
  h2 {
    font-size: 18px;
    margin: 0;
  }
  .top-ul {
    font-size: 14px;
    line-height: 28px;
    li {
      &::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 12px;
        background: #409eff;
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }
  .forward-div {
    dt {
      font-size: 18px;
      font-weight: bold;
    }
    dd {
      line-height: 30px;
      font-size: 14px;
    }
    margin-bottom: 30px;
  }
  .attachmentList-div {
    li {
      line-height: 30px;
      color: #409eff;
      font-size: 14px;
      cursor: pointer;
      span {
        color: #999;
        display: inline-block;
        padding-left: 10px;
        font-size: 12px;
      }
    }
  }
}
</style>
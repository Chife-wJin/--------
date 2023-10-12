<template>
  <div class="app-container">
    <div class="left-container">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="companyList"
        :props="defaultProps"
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="nodeClick"
        :render-content="renderContent"
        ref="tree"
      >
      </el-tree>
    </div>
    <div class="right-container">
      <el-form
        class="search-body"
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        label-width="108px"
      >
        <el-form-item label="工程名称:" prop="generatorSetName">
          <el-input
            v-model="queryParams.generatorSetName"
            placeholder="请输入工程名称"
            style="width: 180px"
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
      <el-row :gutter="10" class="mb8 container-state">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleAddDel"
          >
            批量删除
          </el-button>
        </el-col>
        <right-toolbar @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        border
        class="container-table"
        :data="List"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="generatorSetName"
          label="工程名称"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="generatorSetType"
          label="下次执行时间"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="generatorSetTypeFine"
          label="创建人"
          min-width="110"
        ></el-table-column>
        <el-table-column
          prop="fuelType"
          label="创建时间"
          min-width="110"
        ></el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >
              修改
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-edit">
              加工流程
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-edit">
              调度配置
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-edit">
              授权
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :pageNo.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        class="pull-right"
      />
      <!-- 新增弹窗 -->
      <el-dialog
        :title="titleName"
        :visible.sync="detailDialog"
        :show-close="true"
        center
        width="700px"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="88px"
          size="small"
          class="dialog-form"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item prop="name" label="工程名称：">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item prop="remarks" label="备注：">
                <el-input
                  v-model="ruleForm.remarks"
                  type="textarea"
                  rows="4"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            size="small"
          >
            保存并提交
          </el-button>
          <el-button @click="formCancel('ruleForm')" size="small">
            返回
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getGroupTreeList } from "@/api/carbonAsset/carbonPreparation";
// import { TooltipView } from "@/components";
export default {
  name: "FlowPathList",
  data() {
    return {
      filterText: "",
      treeData: [],
      defaultProps: {
        // label: "groupName",
        label: "label",
        children: "children",
      },
      loading: true,
      queryParams: {
        pageSize: 15,
        pageNo: 1,
        generatorSetName: undefined,
        belongUnitId: undefined,
        permissionCode: undefined,
      },
      total: 0,
      List: [],
      dataSourceList: [],
      rowSpanArr: [],
      position: 0,
      rowSpanArr2: [],
      position2: 0,
      rowSpanArr3: [],
      position3: 0,
      rowSpanArr4: [],
      position4: 0,
      titleName: "",
      detail: "",
      detailDialog: false,
      ids: "",
      single: "",
      multiple: "",
      rules: {
        name: [{ required: true, message: "请输入工程名称", trigger: "blur" }],
      },
      ruleForm: {
        name: undefined,
        remarks: undefined,
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    companyList: {
      immediate: true,
      handler: function (newV) {
        if (newV.length) {
          this.$nextTick(() => {
            this.nodeClick(this.companyList[0]);
            this.getList();
          });
        }
      },
    },
  },
  computed: {
    ...mapState({
      companyList: (state) => state.publicVariable.companyList,
    }),
  },
  mounted() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeClick(data) {
      if (!data.children) {
        this.queryParams.belongUnitId = data.id;
        this.$refs.tree.setCurrentKey(data.id);
        this.getList();
      } else {
        if (data.children[0].children) {
          this.nodeClick(data.children[0].children[0]);
        } else {
          this.$refs.tree.setCurrentKey(data.children[0].id);
          this.queryParams.belongUnitId = data.children[0].id;
          this.getList();
        }
      }
    },
    renderContent(h, { node }) {
      return node.childNodes.length > 0 ? (
        <span class="custom-tree-node">
          <svg-icon icon-class="fa-list" style="margin-right: 0px;"></svg-icon>
          <span>{node.label}</span>
        </span>
      ) : (
        <span
          class="custom-tree-node"
          title={node.label}
          style="width: 100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
        >
          <span>{node.label}</span>
        </span>
      );
    },
    // 搜索相关 start
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.resetFieldsTap("queryForm");
      this.handleQuery();
    },
    // 搜索相关 end

    // 弹窗相关 start
    handleAdd() {
      this.titleName = "工程添加";
      this.detail = {
        type: "添加",
        belongUnitId: this.queryParams.belongUnitId,
      };
      this.detailDialog = true;
      this.$nextTick(() => {
        this.resetFieldsTap("ruleForm");
      });
    },
    handleAddDel() {
      console.log(this.ids);
    },
    handleUpdate(row) {
      this.titleName = "工程修改";
      this.detail = {
        id: row.id,
        groupName: row.groupName,
        type: "修改",
      };
      this.detailDialog = true;
      this.$nextTick(() => {
        this.resetFieldsTap("ruleForm");
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.$emit("cutCom", "panel");
          this.$emit("addFlowPath", this.ruleForm);
          this.detailDialog = false;
        } else {
          return false;
        }
      });
    },
    formCancel() {
      this.detailDialog = false;
    },
    // 弹窗相关 end

    async getList() {
      this.loading = true;
      const res = await getGroupTreeList(this.queryParams);
      if (res.code == 200) {
        this.List = res.data.list;
        this.total = res.data.total;
        // this.getRowSpan();
        this.loading = false;
      }
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 表格相关 end
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
.app-container {
  position: relative;
  height: 100%;
  overflow-y: auto !important;
  .left-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 260px;
    height: calc(100% - 40px);
    margin-top: 10px;
    overflow-y: hidden;
  }
  .filter-tree {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
  .right-container {
    display: inline-block;
    width: calc(100% - 260px);
    margin-left: 260px;
    height: fit-content;
  }
}
.ellipsis {
  @include textOmit;
}
</style>
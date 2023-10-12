<template>
  <div class="resource-dir">
    <div class="tree">
      <ul v-for="(v,i) in treeList" :key="i">
        <li @click="handleNodeClick(v,i)"  :class="m==v.id?'active':''">
          {{v.classifyName}}
          <ul v-for="(k,j) in v.children" :key="j" v-show='v.isShow' :class="m==k.id?'active1':''">
              <li @click.stop="handleNodeClick1(k,j)">{{k.classifyName}}</li>
          </ul>
        </li>
      </ul>
      <!-- <Tree
        :tree="tree"
        :loading="loading"
        @handleNodeClick="handleNodeClick"
      /> -->
    </div>
    <div class="content">
       <List ref="list" :treeData="treeData" />
    </div>
  </div>
</template>
<script>
import { treeLevelBean } from "@/api/dataCenter/metaData.js";
import Tree from "./tree";
import List from "./list"
export default {
  name: "dataResourceDir",
  data() {
    return {
      isShowAlert: false,
      loading: true,
      treeData:{},
      id: "",
      treeList:[],
      m:undefined
    };
  },

  created() {
    this.getContent()
  },
  components: {
   // Tree,
    List
  },
  methods: {
    handleNodeClick(v,i) {
     console.log(v)
      this.treeData = v
      this.m = v.id
    },
    handleNodeClick1(k,j){
      console.log(k)
      console.log(j)
      this.treeData = k
      this.m = k.id
    },
    async getContent() {
       this.loading = true;
      let res = await treeLevelBean();
      this.treeList = res.data
      this.treeList.map(item => {
        this.$set(item, "isShow", true)
        this.$set(item,"m",undefined)
        // item.children.map(v => {
          
        // })
      })
      
      console.log(this.treeList)
      this.loading = false;
    },

  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-loading-spinner{top:20%}
.resource-dir {
  display: flex;
  min-height: 100%;
  .tree {
    width: 200px;
    ul{
      font-size:14px;
      color: #333;
      line-height: 32px;
      cursor: default;
      .active{color: #409eff; }
      li{
        font-weight: bold;
        cursor: pointer;
        
        ul{
          text-indent: 2em;
          li{
            font-weight: normal;
            &:hover{ background: #a7c7e7;}
          }
        }
        .active1{color: #409eff;}
      }
      
    }
    
    
  }
  .content {
    width: calc(100% - 210px);
    padding-left: 10px;
  }
  
}
</style>
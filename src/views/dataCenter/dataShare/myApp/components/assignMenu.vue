<template>
<div>
  <div class="app-container">
    <el-form :model="form">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%; margin-top:20px"
        row-key="id"
        :stripe="true"
        border
        default-expand-all
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="container-table"
      >
        <el-table-column prop="apiServicename" label="服务名称" >
        </el-table-column>
        <el-table-column prop="apiServiceurl" label="服务地址" >
        </el-table-column>
        <el-table-column label="调用次数/天" prop="apiRequestcount">
        <template slot-scope="scope">
            <el-input v-model="scope.row.apiRequestcount" size="small" value="" placeholder="请输入"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="assignbtn(scope.row)"
              >分配</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      </el-form>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :pageNo.sync="params.pageNo"
      :limit.sync="params.pageSize"
      @pagination="getData"
      class="pull-right"
    />
</div>
</template>

<script>
import {
  accessLimit,
  doAccessLimit
 } from "@/api/dataCenter/dataShare.js";
export default {
  name: 'AssignMenu',
  components:{},
  props:{
      id: String,
  },
  data(){
    return {
        tableData:[],
        params:{
            pageNo: 1,
            pageSize: 15,
            id:""
        },
        total:0,
        form:{
            appId:undefined,
            limitNum:undefined,
            serviceId:undefined,
            userName:undefined,
        },
        arr:[],
        loading:true
    }
  },

  created(){ 
      this.getData();
  },
  methods:{
    getData () {
      this.loading = true
      this.params.id = this.id
      accessLimit(this.params).then((res) => {
        //console.log(res)
         this.tableData = res.page.list
        // console.log(this.tableData)
         this.loading = false;
      });
      
    },
    assignbtn(row){
      console.log(row)
       this.form.appId = this.id
       this.form.serviceId = row.id
       this.form.userName = row.apiServicename
       this.form.limitNum = row.apiRequestcount
      console.log(this.form)
        this.$confirm("确定分配吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          doAccessLimit(this.form).then((reponse) => {
            if (reponse.code == 200) {
              console.log(reponse)
              if (reponse.code == 200) {
                this.getData();
            this.$message.success("提交成功");
          } else {
            this.$notify({
              title: "系统提示",
              message: "提交失败",
              showClose: false,
            });
          }
            }
          });
        })
        .catch((err) => err);
    }
  },
  

}
</script>
<style lang="scss" scoped>

</style>
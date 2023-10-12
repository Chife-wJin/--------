<template>
    <div>
      <div class="check-body">
      <el-table
        :data="tableData"
        v-loading="loading"
        row-key="id"
        :stripe="true"
        border
        class="container-table"
      >
        <el-table-column label="排名" width="70">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterprisesName" label="企业简称">
        </el-table-column>
        <el-table-column prop="county" label="所在地区">
        </el-table-column>
        <el-table-column prop="grade" label="分数">
        </el-table-column>
      </el-table>
    </div>

    <div class="back-div">
        <el-button
         @click="goBack" 
         type="primary"
         plain>返回</el-button>
    </div>
    
    </div>
    
</template>

<script>
import {
  environmentRankingList
} from "@/api/dataCenter/centerTopic.js";

export default {
    name: 'WqzhhjglptUICheck',

    data() {
        return {
          loading: true,
            tableData: [],
            total: 0,
            params: {
                    enterprisesType:"1",
                    year:"",
                    month:"",
                    industryType:"20"
                },
        };
    },

    created() {
        this.getList()
    },
    props: {
        row: Object,
        type: String,
    },

    methods: {
        async getList() {
          console.log(this.row)
            const reponse = await environmentRankingList({
                enterprisesType:this.row.enterprisesType,
                year:this.row.year,
                month:this.row.month,
                industryType:this.row.industryType
            });
            console.log(reponse)
            this.tableData = reponse.data
            this.loading = false;
        },
        goBack(){
            this.$emit("closeSelf")
            },
    },
};
</script>

<style lang="scss" scoped>
.back-div{ text-align: center; clear: both}
.check-body{margin: 20px auto 30px;}
</style>
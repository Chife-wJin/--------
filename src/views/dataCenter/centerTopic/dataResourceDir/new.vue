<template>
    <div class="container">
        <el-tabs type="border-card">
            <el-tab-pane label="排污单位信息">
                <UnitInformation />
            </el-tab-pane>
            <el-tab-pane label="公开信息">
                <TopicAirPollution />
            </el-tab-pane>
            <el-tab-pane label="水污染">
                <TopicWaterPollution />
            </el-tab-pane>
            <el-tab-pane label="注销信息">
                <TopicNoiseEmission />
            </el-tab-pane>
            <el-tab-pane label="排污许可变更">
                <PermitChange />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { permitRectification } from "@/api/dataCenter/centerTopic";
import UnitInformation from "./components/unitInformation"
import TopicAirPollution from "./components/topicAirPollution"
import TopicWaterPollution from "./components/topicWaterPollution"
import TopicNoiseEmission from "./components/topicNoiseEmission"
import PermitChange from "./components/permitChange"
export default {
    name: 'WqzhhjglptUINew',

    data() {
        return {
           queryParams: {
            pageNum: 1,
            pageSize: 15,
            industry:undefined,
            name:undefined
            },
            total: 1,
            loading: true,   
            List:[]    
            };
    },
    components: {
        UnitInformation,
        TopicAirPollution,
        TopicWaterPollution,
        TopicNoiseEmission,
        PermitChange
    },

    created(){ },

    methods: { },
};
</script>

<style lang="scss" scoped>
.container{ padding-top:20px}
</style>
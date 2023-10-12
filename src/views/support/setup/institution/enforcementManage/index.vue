<template>
  <div>
    <enforcement-add></enforcement-add>
    <enforcement-list></enforcement-list>
  </div>
</template>

<script>
import enforcementList from './enforcementList.vue'
import enforcementAdd from './enforcementAdd.vue'
export default {
    components:{
      enforcementList,
      enforcementAdd
    }
}
</script>

<style>

</style>
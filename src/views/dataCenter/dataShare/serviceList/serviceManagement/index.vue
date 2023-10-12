<template>
  <div>
    <List @changeCom="changeCom" @docSee="docSee" @docWirite="docWirite"  ref="list" />
    <el-dialog
      :title="title"
      v-if="isShowAlert"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><New :type="type" :id="id" @hidden="hidden" @goBack="goBack" ref="new"
    /></el-dialog>
    <el-dialog
      :title="titleSee"
      v-if="isShowAlertSee"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1000px"
      append-to-body
      ><DocSee  :typeSee="typeSee" :idSee="idSee" @goBack = "goBack"
    /></el-dialog>
    <!-- <el-dialog
      :title="titleWrite"
      v-if="isShowAlertWrite"
      :before-close="handleDialogClose"
      :visible="visible"
      width="1220px"
      append-to-body
      ><DocWrite :typeWrite="typeWrite" :idWrite="idWrite" @goBack = "goBack"  @hidden="hidden"
    /></el-dialog> -->
    <div 
      class="mask"
      v-if="isShowAlertWrite"
      :before-close="handleDialogClose"
      :visible="visible"
      >
        <div class="tankuang" >
          <a class="close" @click="close">×</a>
            <DocWrite :typeWrite="typeWrite" :idWrite="idWrite" @goBack = "goBack"  @hidden="hidden"
          />
        </div>
    </div>
  </div>
</template>

<script>
import List from "./list.vue";
import New from "./new.vue";
import DocSee from "./docSee.vue";
import DocWrite from "./docWrite.vue";
export default {
  name: "serviceManagement",

  data() {
    return {
      isShowAlert: false,
      isShowAlertSee:false,
      isShowAlertWrite:false,
      type: "new",
      id: "",
      visible:true,
      idSee:"",
      typeSee:"",
      idWrite:"",
      typeWrite:"",
    };
  },
  components: {
    List,
    New,
    DocSee,
    DocWrite
  },

  methods: {
    changeCom(type, title, id) {
      if (id) {
        this.id = id;
      }
      this.isShowAlert = true;
      this.type = type;
      this.title = title;
    },
    docSee(type, title, id){
      this.idSee = id;
      this.isShowAlertSee = true;
      this.typeSee = type;
      this.titleSee = title;
    },
    docWirite(type, title, id){
      this.idWrite = id;
      this.isShowAlertWrite = true;
      this.typeWrite = type;
      this.titleWrite = title;
    },
    close(){
      this.isShowAlertWrite = false
    },
    hidden(){
      this.isShowAlert = false
      this.isShowAlertWrite = false
      this.$refs.list.getList();
    },
    goBack(){
      this.isShowAlert = false
      this.isShowAlertWrite = false
      this.isShowAlertSee = false
    },
    handleDialogClose: function () {
      this.isShowAlert = false;
      this.isShowAlertSee = false;
      this.isShowAlertWrite = false;
    },
  },
  
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__wrapper{
    z-index: 1500;
  }
  .mask{ width: 100%; height: auto; background: rgba($color: #000000, $alpha: 0.4); position:fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; overflow: auto;}
  .tankuang{width: 1220px; height:auto ; padding: 30px; background: #fff; margin: 6% auto 6%; overflow: auto;}
  .close{ float: right; font-size: 28px; cursor: default; position: relative; top:-20px; color: #bbb;}
  .close:hover{ color: #409EFF;}
</style>
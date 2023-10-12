<template>
  <div class="tree">
    <el-input
      v-model="searchValue"
      class="input-with-select"
      @click.native="handleInput"
      :disabled="true"
      size="small"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
  </div>
</template>
<script>
export default {
  name: "SearchBar",
  data() {
    return {};
  },

  props: {
    searchValue: String,
    id: String,
    searchType: String,
    index: Number,
    showType:String
  },

  methods: {
    handleInput: function () {
      this.$emit("handleSearch",this.searchValue,this.searchType,this.index,this.showType);
    },
  },
};
</script>

<style lang="scss" scoped>
.tree{
  display: flex;
  height: 40px;
  align-items: center;
}
</style>
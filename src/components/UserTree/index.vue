<template>
  <treeselect
    name="demo"
    :multiple="multiple"
    :clearable="clearable"
    :searchable="searchable"
    :disabled="disabled"
    :clear-on-select="clearOnSelect"
    :always-open="alwaysOpen"
    :append-to-body="appendToBody"
    :options="options"
    :normalizer="normalizer"
    :limit="limit"
    :max-height="200"
    v-model="value"
    @select="treeSelect"
  />
</template>

<script>
export default {
  props: {
    // 是否支持多选
    multiple: {
      required: false,
      type: Boolean,
      default: false,
    },
    // 是否支持清空
    clearable: {
      required: false,
      type: Boolean,
      default: true,
    },
    // 是否支持搜索筛选
    searchable: {
      required: false,
      type: Boolean,
      default: true,
    },
    // 是否禁用
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    // 选择选项后是否清除搜索输入。仅在:multiple="true"时使用
    clearOnSelect: {
      required: false,
      type: Boolean,
      default: true,
    },
    // 菜单是否始终展开
    alwaysOpen: {
      required: false,
      type: Boolean,
      default: false,
    },
    // 将菜单追加到 <body />
    appendToBody: {
      required: false,
      type: Boolean,
      default: false,
    },
    // 限制所选选项的显示。其余的将隐藏在limitText 字符串中
    limit: {
      required: false,
      type: Number,
      default: 3,
    },
    // 选中的值绑定, multiple为true时这里必须传数组
    treeValue: {
      required: true,
      type: [Number, String, Array],
      default: () => [],
    },
    // 数据源
    options: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      normalizer(node) {
        return {
          label: node.label,
          id: node.id,
        };
      },
      value: undefined,
    };
  },
  watch: {
    treeValue: {
      handler: function (newV) {
        this.value = newV;
      },
      immediate: true,
    },
  },
  methods: {
    // 菜单选中事件
    treeSelect(val) {
      this.$emit("update:treeValue", val);
    },
  },
};
</script>

<style>
</style>
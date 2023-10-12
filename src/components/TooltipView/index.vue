<template>
  <el-tooltip :disabled="!showTooltip" :placement="placement" effect="light">
    <span
      :class="maxLine ? 'max-line-' + maxLine : ''"
      @mouseenter="handleCellMouseEnter"
    >
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>{{ formatterValue }}</template>
    </span>
    <div
      slot="content"
      class="pre-wrap"
      :style="{ maxHeight: maxHeight + 'px', width: width + 'px' }"
    >
      <template v-if="$slots.content">
        <slot name="content"></slot>
      </template>
      <template v-else>{{ tip }}</template>
    </div>
  </el-tooltip>
</template>

<script>
/**
 * @file TooltipView 查看数据组件
 * 可限制展示行数和展示tooltip;
 * 注意line-height、border、padding可能会影响是否展示tooltip判断
 * @property {Slot} [default] tooltip下面放置的内容
 * @property {Slot} [content] tooltip显示的内容
 */

export default {
  name: "TooltipView",
  props: {
    /** @param {String|Number|Object|Array} value 要查看的数据 */
    value: [String, Number, Object, Array],
    /** @param {Object} [model] 要查看的数据 属性tooltip函数中的参数*/
    model: Object,
    /** @param {String} [emptyTip="-"] 数据为空时展示内容 */
    emptyTip: {
      type: String,
      default: "--",
    },
    /** @param {Number} [maxLine] 最多展示行数。当内容超过设置的行数时，会展示tooltip提示，maxLine可选范围[1,3]*/
    maxLine: {
      type: Number,
      default: 1,
    },
    /** @param {String|Function(value, model)} [tooltip] 展示tooltip的文字 */
    tooltip: [String, Function],
    /** @param {Number} [width] hover显示div的宽度 */
    width: Number,
    /** @param {Number} [maxHeight] hover显示div的最大高度 */
    maxHeight: Number,
    /** @param {String} [placement] tooltip的出现位置 */
    placement: {
      type: String,
      default: "top",
    },
    /** @property {Function(model, value)} [formatter] 字段列文字格式化 */
    formatter: Function,
  },
  data() {
    return {
      showTooltip: false,
    };
  },
  computed: {
    tip() {
      if (typeof this.tooltip === "function") {
        return this.tooltip(this.value, this.model);
      } else if (!this.tooltip && this.formatter) {
        return this.formatter(this.model, this.value);
      }
      return this.tooltip || this.value;
    },
    formatterValue() {
      if (this.formatter) {
        return this.formatter(this.model, this.value);
      }
      if (typeof this.value === "string") {
        return this.value || this.emptyTip;
      }
      if (this.value === undefined || this.value === null) {
        return this.emptyTip;
      }
      return this.value;
    },
  },
  methods: {
    handleCellMouseEnter(event) {
      if (![1, 2, 3, 4, 5].includes(this.maxLine)) {
        this.showTooltip = true;
        return;
      }
      const cellChild = event.target;
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width - 1;
      const rangeHeight = range.getBoundingClientRect().height;
      // scrollWidth 元素内容宽度，包括溢出不可见内容   rangeWidth dom对象的宽度
      const widthOverflow =
        rangeWidth > cellChild.offsetWidth ||
        cellChild.scrollWidth > cellChild.offsetWidth;
      const heightOverflow =
        rangeHeight > cellChild.offsetHeight ||
        cellChild.scrollHeight > cellChild.offsetHeight;
      if (widthOverflow || heightOverflow) {
        this.showTooltip = true;
      } else {
        this.showTooltip = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pre-wrap {
  white-space: pre-wrap;
}

@mixin line-clamp($line: 1) {
  display: -webkit-box;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding: 0;
  word-break: break-all;
  overflow-wrap: break-word;
  -webkit-line-clamp: $line;
}

.max-line-1 {
  @include line-clamp(1);
}

.max-line-2 {
  @include line-clamp(2);
}

.max-line-3 {
  @include line-clamp(3);
}

.max-line-4 {
  @include line-clamp(4);
}

.max-line-5 {
  @include line-clamp(5);
}
</style>

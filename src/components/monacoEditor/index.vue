<template>
  <div
    id="monaco-editor"
    ref="monaco"
    class="monaco"
    :style="{ height: height }"
  ></div>
</template>

<script>
import * as monaco from "monaco-editor";
import { language as sqlLanguage } from "monaco-editor/esm/vs/basic-languages/sql/sql.js";
import {
  pythonCompletion,
  sqlCompletion,
  cppCompletion,
  javaCompletion,
  csharpCompletion,
} from "./completion";
export default {
  props: {
    // 编辑器初始值
    monitorValue: {
      type: String,
      default: "",
    },
    // 识别的语言
    language: {
      type: String,
      default: "sql",
    },
    // 官方自带三种主题vs, hc-black, or vs-dark
    theme: {
      type: String,
      default: "vs",
    },
    // 是否显示行号
    selectOnLineNumbers: {
      type: Boolean,
      default: false,
    },
    // 编辑器高度
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      monacoEditor: {},
      standaloneEditorConstructionOptions: {
        value: this.monitorValue, //编辑器初始显示文字
        language: this.language, //语言支持自行查阅demo
        theme: this.theme, //官方自带三种主题vs, hc-black, or vs-dark
        selectOnLineNumbers: this.selectOnLineNumbers, //显示行号
        roundedSelection: false,
        readOnly: false, // 只读
        cursorStyle: "line", //光标样式
        automaticLayout: true, //自动布局
        glyphMargin: true, //字形边缘
        useTabStops: false,
        fontSize: 15, //字体大小
        autoIndent: true, //自动布局
        quickSuggestionsDelay: 100, //代码提示延时
      },
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      const self = this;
      this.editor = monaco.editor.create(
        self.$refs.monaco,
        self.standaloneEditorConstructionOptions
      );
      //监测窗口变化
      window.addEventListener("resize", function () {
        self.editor.layout();
      });
      // 创建代码提醒
      pythonCompletion;
      sqlCompletion;
      cppCompletion;
      javaCompletion;
      csharpCompletion;
      // 切换语言
      // monaco.editor.setModelLanguage(
      //   this.editor.getModel(),
      //   "sql"
      // );
      // 监听值的变化
      // this.editor.onDidChangeModelContent((val) => {
      //   console.log(val.changes[0].text);
      // });
      // 监听失去焦点事件
      this.editor.onDidBlurEditorText(() => {
        this.setEditorValue();
      });
    },
    setEditorValue() {
      this.$emit("setEditorValue", this.editor.getValue());
    },
    changeEditor() {
      // 更改editor内容
      this.monacoEditor.setValue(result.data);
      this.monacoEditor.getAction("editor.action.formatDocument")._run();
    },
    destroyEditor() {
      // 销毁编辑器
      this.monacoEditor.dispose();
    },
  },
};
</script>

<style lang="scss" scoped>
.monaco {
  width: 100%;
}
</style>
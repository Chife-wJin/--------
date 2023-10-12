<template>
  <div>
    <div class="container">
      <div class="top">
        <div class="title">
          <input
            type="checkbox"
            name="all"
            @click="all"
            :checked="filter_chosen === filter && filter"
          />
          <span>业务名称（字段名称）</span>
        </div>

        <div class="number">
          <span v-show="filter_chosen">{{ filter_chosen }}/</span
          >{{ filter_search_word }}
        </div>
      </div>

      <input
        type="text"
        placeholder="搜索"
        @keyup="change_search_word"
        class="search"
      />

      <ul class="contents">
        <li
          class="content"
          v-for="(content, idx) in datas"
          v-show="
            content.type === type &&
            (has_search_word(content.COLUMN_NAME) ||
              has_search_word(content.COLUMN_COMMENT))
          "
          :key="idx"
        >
          <input
            type="checkbox"
            @click="change(idx)"
            :checked="content.chosen"
          />{{ content.COLUMN_COMMENT }}（{{ content.COLUMN_NAME }}）
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransferContainer",
  data() {
    return {
      search_word: "",
    };
  },
  props: {
    datas: Array,
    type: Number,
  },
  mounted() {},
  created() {
    // console.log(this.datas)
  },
  methods: {
    change(idx) {
      this.datas[idx].chosen = !this.datas[idx].chosen;
    },
    all() {
      this.change_chosen(!(this.filter_chosen === this.filter));
    },
    change_chosen(bool) {
      this.datas.map((x) => {
        if (x.type === this.type) {
          x.chosen = bool;
        }
      });
    },

    change_search_word(e) {
      this.search_word = e.target.value;
    },

    has_search_word(content) {
      if (this.search_word) {
        return content.includes(this.search_word);
      }

      return true;
    },
  },

  computed: {
    filter() {
      return this.datas.filter((x) => x.type === this.type).length;
    },

    filter_chosen() {
      return this.datas.filter((x) => x.type === this.type && x.chosen).length;
    },

    filter_search_word() {
      return this.datas.filter(
        (x) =>
          x.type === this.type &&
          (this.has_search_word(x.COLUMN_NAME) ||
            this.has_search_word(x.COLUMN_COMMENT))
      ).length;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 280px;
  border: solid 1px #ccc;
}

.to {
  margin: 0 10px 10px 10px;

  width: 30px;
}

.search {
  width: 250px;
  height: 25px;
  outline: 0;
  margin: 10px 0 0 10px;
  border: solid 1px #ddd;
  border-radius: 20px;
  padding: 0 10px;
}

.content {
  list-style: none;

  margin-bottom: 10px;
}
.contents {
  height: 300px;
  overflow: auto;
  padding: 10px;
}
.top {
  display: flex;
  justify-content: space-between;
  background: #409eff;
  height: 38px;
  line-height: 38px;
  padding-right: 10px;
}
.title span {
  font-weight: bold;
  color: #fff;
}
.number {
  color: #fff;
}
</style>
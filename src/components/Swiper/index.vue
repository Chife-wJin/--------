<template>
  <!--具体参数的配置请仔细查看文档-->
  <!-- autoplay：自动播放 -->
  <!-- autoplayTimeout: 自动播放超时 -->
  <!-- perspective: 幻灯片透视位置 -->
  <!-- display: 展示个数 -->
  <!--animationSpeed:动画速度  -->
  <!-- controlsVisible:控制的箭头 -->
  <!--controlsHeight:控件高度  -->

  <carousel-3d
    :display="5"
    :count="6"
    :width="120"
    :height="120"
    :space="260"
    :border="0"
    :scaling="300"
    controlsVisible
    :autoplay="false"
    :perspective="10"
    :animationSpeed="1000"
    :autoplayTimeout="2000"
    @after-slide-change="afterSlideChange"
    v-if="slides.length > 0"
    ref="carousel3d"
  >
    <slide v-for="(item, i) in slides" :key="i" :index="i">
      <!--通过插槽作用域可以拿到点击的图片的索引-->
      <template slot-scope="obj" >
        {{obj}}
        <div class="slide" :class="obj.isCurrent ? 'active' : ''">
          <img src="item.cover" alt="" >
          <span>{{item.tilte}}</span>
          
        </div>
        <!-- <img
          @click="imgClick(item)"
          :src="obj.isCurrent ? item.coverDeep : item.cover"
        />
        <span class="imgTitle" :class="obj.isCurrent ? 'imgTitleActive' : ''">{{
          item.title
        }}</span> -->
      </template>
    </slide>
  </carousel-3d>
</template>
<script>
import { Carousel3d, Slide } from "vue-carousel-3d";
export default {
  data() {
    return {};
  },
  props: {
    slides: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Carousel3d,
    Slide,
  },
  watch: {
    slides: function (newv, oldv) {
      this.$refs.carousel3d && this.$refs.carousel3d.setSize();
    },
  },
  mounted: function(){
  },
  methods: {
    // 点击路由跳转
    imgClick(item) {
      // this.$router.push(item.name);
      this.$emit("imgClick", item);
    },
    afterSlideChange(e) {
      this.$emit("swiperChange", this.slides[e]);
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel-3d-slide {
  background-color: transparent;
  overflow: visible;
}
.carousel-3d-container[data-v-07917306] {
  min-height: 160px;
}
img {
  width: 100%;
  height: 100%;
}
.imgTitle {
  display: inline-block;
  width: 100%;
  color: #333;
  text-align: center;
}
.imgTitleActive {
  color: #0e5994;
  font-weight: bolder;
}
.next[data-v-05517ad0], .prev[data-v-05517ad0]{
  color: white!important;;
}
.slide{
  width: 120px;
  height: 120px;
  background: yellowgreen;
}
</style>
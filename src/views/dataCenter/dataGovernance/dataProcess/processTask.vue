<template>
  <div class="video-body">
    <easy-player :video-url="url"></easy-player>
  </div>
</template>

<script>
import EasyPlayer from "@easydarwin/easyplayer";
export default {
  components: {
    EasyPlayer,
  },
  data() {
    return {
      url: "http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8",
    };
  },
};
</script>

<style lang="scss" scoped>
.video-body {
  width: 100%;
  height: 100%;
}
</style>
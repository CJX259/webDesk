<template>
  <div class="icon" :class="{ active: active }">
    <img v-show="imgUrl != ''" class="icon_img" :src="imgUrl" />
    <span class="title">{{ title }}</span>
  </div>
</template>
<script>
export default {
  props: ["title", "imgUrl", "handleClick", "active"],
  methods: {},
};
</script>
<style lang="less" scoped>
.icon {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 68px;
  box-sizing: border-box;
  padding: 3px 5px 0 5px;
  border-radius: 3px;

  user-select: none;
  &.active {
    background: #aac;
  }
  .icon_img {
    width: 100%;
    height: 45px;
  }
  .title {
    font-size: 12px;
    display: inline-block;
    text-align: center;
    width: 100%;
    // display: flex;
    color: #fff;
    line-height: 15px;
    // justify-content: center;
    user-select: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
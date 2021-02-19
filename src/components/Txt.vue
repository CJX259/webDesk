<template>
  <div class="txt-wrapper" :class="{active: this.activeWrapper === 'txt'}">txt</div>
</template>

<script>
export default {
  props: ['activeWrapper']
}
</script>

<style lang="less" scoped>
.txt-wrapper{
  position: absolute;
  height: 300px;
  width: 1000px;
  left: calc(50% - 500px);
  top: calc(50% - 150px);
  background-color: #ccc;
  &.active{
    z-index: 20;
  }
}
</style>
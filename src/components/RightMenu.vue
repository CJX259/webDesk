<template>
  <ul class="right-menu-wrapper" ref="rightMenu">
    <template v-if="mode === 'update'">
      <li v-for="(item, i) in update" @click="()=>{item.click(); changeShow(false)}" :key="i">{{ item.text }}</li>
    </template>
    <template v-if="mode === 'add'">
      <li v-for="(item, i) in add" @click="()=>{item.click(); changeShow(false)}" :key="i">{{ item.text }}</li>
    </template>
  </ul>
</template>

<script>
export default {
  props: [
    "mode",
    "icon",
    "left",
    "top",
    "handleUpdate",
    "handleAdd",
    "handleDelete",
    "changeShow"
  ],
  watch: {
    left(newValue) {
      this.$refs.rightMenu.style.left = newValue + "px";
    },
    top(newValue) {
      this.$refs.rightMenu.style.top = newValue + "px";
    },
  },
  methods: {},
  data() {
    return {
      update: [
        {
          text: "修改图标",
          click: this.handleUpdate,
        },
        {
          text: "删除图标",
          click: this.handleDelete,
        },
      ],
      add: [
        {
          text: "新建图标",
          click: this.handleAdd,
        },
      ],
    };
  },
  mounted() {
    this.$refs.rightMenu.style.left = this.left + "px";
    this.$refs.rightMenu.style.top = this.top + "px";
  },
};
</script>

<style lang="less" scoped>
.right-menu-wrapper {
  color: #000;
  position: absolute;
  background: #eee;
  width: 100px;
  box-shadow: 1px 2px 1px 1px #111;
  text-align: center;
  left: 100px;
  top: 100px;
  > li {
    font-size: 13px;
    height: 25px;
    line-height: 25px;
    user-select: none;
    &:hover {
      background: #fff;
    }
  }
}
</style>
<template>
  <div class="application-wrapper" ref="appWrapper">
    <div
      class="header"
      @mousedown="onMousedown($event)"
      @mouseup="onMouseup"
    >
      <div class="left" @drag.prevent="onDrag">
        <div
          v-for="(app, i) in apps"
          :key="i"
          :class="['page', { active: i === activeIndex }]"
          @click.stop="changeActive(i)"
        >
          <div class="title">{{ app.title }}</div>
          <img
            class="close"
            @click.stop="closePage(i)"
            src="../assets/close.png"
          />
        </div>
      </div>
      <div class="operate">
        <div class="min"></div>
        <div class="normal" @click="resize"></div>
        <div class="close" @click="closeAllPage"></div>
      </div>
    </div>
    <div
      class="content"
      v-show="index === activeIndex"
      v-for="(page, index) in webPage"
      :key="index"
    >
      <div class="cover" v-if="mouseDown"></div>
      <iframe class="webpage" :src="page"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: ["apps", "clearApps", "closePageByIndex", "updateActive"],
  data() {
    return {
      dataMap: {
        个人博客: "http://www.jessyblog.cn/jessy/index",
        选课系统: "http://www.jessyblog.cn:8080",
      },
      activeIndex: 0,
      mouseDown: false,
      // 处理拖拽事件
      disX: 0,
      disY: 0,
    };
  },
  watch: {
    // 父组件通知子组件把activeIndex修改成最后一位
    updateActive() {
      this.activeIndex = this.apps.length - 1;
    },
  },
  methods: {
    // 无实际作用，用于阻止pageDom产生的drag事件，导致移动header失败
    onDrag() {},
    onMousedown(e) {
      this.mouseDown = true;
      this.disX = e.pageX - this.$refs.appWrapper.getClientRects()[0].left;
      this.disY = e.pageY - this.$refs.appWrapper.getClientRects()[0].top;
      // 给document注册move事件
      document.onmousemove = (e) => {
        const appWrapperDom = this.$refs.appWrapper;
        if (!this.mouseDown || appWrapperDom.className.includes("max")) {
          return;
        }
        let left = e.pageX - this.disX;
        let top = e.pageY - this.disY;
        appWrapperDom.style.left = left + "px";
        appWrapperDom.style.top = top + "px";
      };
      document.onmouseup = () => {
        this.mouseDown = false;
        this.disX = 0;
        this.disY = 0;
      }
    },
    onMouseup() {
    },
    changeActive(index) {
      this.activeIndex = index;
    },
    // 关闭网页页面
    // 最后一个问题：无论是什么情况，减去一个后再双击，都是不能切换active
    closePage(index) {
      // 如果删除了activeIndex，就要选出下一个
      // apps没有了就触发close
      if (this.activeIndex === index) {
        console.log("activeIndex = index喔");
        if (this.apps.length === 1) {
          this.closeAllPage();
        } else {
          // this.activeIndex = this.activeIndex - 1;
          this.closePageByIndex(index);
          this.activeIndex === 0 ? "" : this.changeActive(this.activeIndex - 1);
        }
      } else {
        // 如果删除的不是activeIndex,就直接在数组中删除index;
        this.closePageByIndex(index);
        if (this.activeIndex > index) {
          this.changeActive(this.activeIndex - 1);
          console.log("active>index");
        }
      }
    },
    // 关闭所有网页标签
    closeAllPage() {
      this.clearApps();
      this.activeIndex = 0;
    },
    // 最大化或正常
    resize() {
      if (this.$refs.appWrapper.className.includes("max")) {
        this.$refs.appWrapper.setAttribute("class", "application-wrapper");
      } else {
        this.$refs.appWrapper.setAttribute("class", "max application-wrapper");
      }
      // console.log(this.$refs.appWrapper.classList) ;
    },
  },
  computed: {
    webPage() {
      let pageUrl = this.apps.map((app) => {
        return this.dataMap[app.title] ? this.dataMap[app.title] : "";
      });
      return pageUrl;
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.application-wrapper {
  position: relative;
  width: 1100px;
  height: 540px;
  left: calc(50% - 550px);
  z-index: 10;
  top: 30px;
  // margin-left: -550px;
  transition: all 0.03s linear;
  &.max {
    width: 100%;
    height: calc(100% - 80px);
    // height: 100%;
    left: 0!important;
    top: 0!important;
    margin-left: 0;
  }
  .header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    padding-bottom: 3px;
    background: #ddd;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 3px;
      background: #fff;
      bottom: 0;
    }
    .left {
      flex: 1;
      display: flex;
      padding-top: 4px;
      overflow: hidden;
      box-sizing: border-box;
      .page {
        /* min-width: 16px; */
        border-top-right-radius: 10px;
        margin-left: -2px;
        border-top-left-radius: 10px;
        color: #000;
        background: #eee;
        padding: 0 10px;
        width: 200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.active {
          background: #fff;
          z-index: 10;
        }
        &:nth-of-type(1) {
          margin-left: 7px;
        }
        .title {
          font-size: 12px;
          user-select: none;
        }
        .close {
          flex: 0 0 12px;
          padding: 1px;
          height: 12px;
          user-select: none;
          &:hover {
            background: #ccc;
            border-radius: 50%;
          }
        }
      }
    }
    .operate {
      flex: 0 0 150px;
      > div.min {
        background-image: url("../assets/min.png");
      }
      > div.normal {
        background-image: url("../assets/normal.png");
      }
      > div.close {
        background-image: url("../assets/close.png");
        &:hover {
          background-color: red;
          background-image: url("../assets/close_2.png");
        }
      }
      > div {
        width: 30px;
        height: 17px;
        padding: 10px;
        display: inline-block;
        transition: all 0.2s ease;
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: center center;
        &:hover {
          background-color: #ccc;
        }
      }
    }
  }
  .content {
    height: 100%;
    position: relative;
    .webpage {
      width: 100%;
      // height: 600px;
      height: 100%;
      box-sizing: border-box;
    }
    .cover{
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
}
</style>